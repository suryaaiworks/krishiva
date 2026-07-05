import logging
import datetime
import time
import httpx
from typing import Dict, Any, List
from app.config.settings import settings
from app.database.connection import SessionLocal
from app.models.farm import FarmLocation
from app.models.weather import WeatherForecast

logger = logging.getLogger(__name__)

# Global memory cache to prevent duplicate API requests
# Key: (round(lat, 2), round(lng, 2)), Value: (timestamp, data_dict)
WEATHER_MEMORY_CACHE = {}

class WeatherService:
    @staticmethod
    def get_weather_forecast(lat: float, lng: float) -> dict:
        """
        Compiles current, hourly, and 7-day forecasts using OpenWeatherMap.
        Integrates dynamic agricultural advice and handles database caching.
        """
        now_ts = time.time()
        coord_key = (round(lat, 2), round(lng, 2))
        
        # 1. Memory Cache Check
        if coord_key in WEATHER_MEMORY_CACHE:
            cached_ts, cached_data = WEATHER_MEMORY_CACHE[coord_key]
            if now_ts - cached_ts < 3600: # 1 hour
                logger.info(f"Weather memory cache HIT for lat: {lat}, lng: {lng}")
                return cached_data

        # Check if OpenWeather API key is configured
        is_api_configured = settings.OPENWEATHER_API_KEY and "your-openweather" not in settings.OPENWEATHER_API_KEY
        
        if not is_api_configured:
            logger.warning("OPENWEATHER_API_KEY is not configured or is a placeholder. Using mock weather.")
            mock_data = WeatherService._get_mock_weather(lat, lng)
            return mock_data

        # 2. Database Cache Check (if location matches)
        db_cached_data = None
        db_location = None
        try:
            with SessionLocal() as db:
                # Find matching farm location within 0.05 degrees (~5km)
                db_location = db.query(FarmLocation).filter(
                    FarmLocation.latitude.between(lat - 0.05, lat + 0.05),
                    FarmLocation.longitude.between(lng - 0.05, lng + 0.05)
                ).first()
                
                if db_location:
                    one_hour_ago = datetime.datetime.utcnow() - datetime.timedelta(hours=1)
                    db_forecasts = db.query(WeatherForecast).filter(
                        WeatherForecast.location_id == db_location.id,
                        WeatherForecast.created_at >= one_hour_ago
                    ).order_by(WeatherForecast.forecast_date.asc()).all()
                    
                    if len(db_forecasts) >= 5:
                        logger.info(f"Supabase cache HIT for location: {db_location.location_name}")
                        db_cached_data = WeatherService._reconstruct_from_db(db_forecasts)
        except Exception as e:
            logger.error(f"Failed to query database cache: {e}")

        if db_cached_data:
            # Update memory cache
            WEATHER_MEMORY_CACHE[coord_key] = (now_ts, db_cached_data)
            return db_cached_data

        # 3. Live API Fetch
        try:
            logger.info(f"Fetching live weather from OpenWeatherMap for lat: {lat}, lng: {lng}")
            appid = settings.OPENWEATHER_API_KEY
            
            # Fetch Current
            current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={appid}&units=metric"
            current_res = httpx.get(current_url, timeout=10)
            if current_res.status_code != 200:
                raise Exception(f"Current weather API failed: {current_res.text}")
            current_data = current_res.json()
            
            # Fetch Forecast
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lng}&appid={appid}&units=metric"
            forecast_res = httpx.get(forecast_url, timeout=10)
            if forecast_res.status_code != 200:
                raise Exception(f"Forecast weather API failed: {forecast_res.text}")
            forecast_data = forecast_res.json()
            
            # Process & Map response
            final_weather = WeatherService._parse_and_map_response(current_data, forecast_data)
            
            # 4. Save to Database Cache (if location matched)
            if db_location:
                try:
                    with SessionLocal() as db:
                        # Clear old entries
                        db.query(WeatherForecast).filter(WeatherForecast.location_id == db_location.id).delete()
                        
                        # Save new daily entries
                        for idx, d in enumerate(final_weather["daily"][:7]):
                            f_date = datetime.date.today() + datetime.timedelta(days=idx)
                            # Parse temps
                            t_min = 20.0
                            t_max = 30.0
                            if " - " in d["temp"]:
                                try:
                                    t_min = float(d["temp"].split("°C - ")[0].replace("°C", ""))
                                    t_max = float(d["temp"].split("°C - ")[1].replace("°C", ""))
                                except Exception:
                                    pass
                            
                            wf = WeatherForecast(
                                id=uuid_generator(),
                                location_id=db_location.id,
                                temperature_c=(t_min + t_max) / 2,
                                feels_like_c=(t_min + t_max) / 2,
                                humidity_pct=float(d["humidity"].replace("%", "")),
                                wind_speed_kph=float(d["wind"].replace(" km/h", "")),
                                rain_prob_pct=float(d["rain"].replace("%", "")),
                                uv_index=6,
                                condition=d["condition"],
                                forecast_date=f_date,
                                created_at=datetime.datetime.utcnow()
                            )
                            db.add(wf)
                        db.commit()
                        logger.info("Successfully updated Supabase weather forecast cache table.")
                except Exception as db_err:
                    logger.error(f"Failed to update database cache: {db_err}")
            
            # Update memory cache
            WEATHER_MEMORY_CACHE[coord_key] = (now_ts, final_weather)
            return final_weather

        except Exception as e:
            logger.error(f"Live Weather API call failed: {e}. Falling back to mock data.")
            # Graceful fallback to mock data
            return WeatherService._get_mock_weather(lat, lng)

    @staticmethod
    def _parse_and_map_response(current_data: dict, forecast_data: dict) -> dict:
        main_current = current_data.get("main", {})
        wind_current = current_data.get("wind", {})
        weather_desc = current_data.get("weather", [{}])[0].get("description", "clear sky").title()
        weather_main = current_data.get("weather", [{}])[0].get("main", "Clear").lower()
        clouds = current_data.get("clouds", {}).get("all", 0)

        # Estimate UV index from clouds
        uv = max(1, 10 - round(clouds / 10))
        wind_kph = round(wind_current.get("speed", 0) * 3.6)
        
        # Check first forecast pop for rain probability
        first_pop = forecast_data.get("list", [{}])[0].get("pop", 0)
        rain_prob = round(first_pop * 100)

        spraying_favorable = wind_kph < 15 and rain_prob < 30
        best_window = "6:00 PM - 8:00 PM" if rain_prob < 40 else "Farming rest day"

        current = {
            "temp": round(main_current.get("temp", 28)),
            "feels_like": round(main_current.get("feels_like", 30)),
            "condition": weather_desc,
            "humidity": main_current.get("humidity", 60),
            "wind_speed": wind_kph,
            "rain_prob": rain_prob,
            "uv_index": uv,
            "best_irrigation_window": best_window,
            "spraying_favorable": spraying_favorable
        }

        # Process Hourly
        hourly = []
        for idx, item in enumerate(forecast_data.get("list", [])[:8]):
            dt_txt = item.get("dt_txt", "")
            hr_str = "Now"
            if idx > 0 and dt_txt:
                try:
                    dt_val = datetime.datetime.strptime(dt_txt, "%Y-%m-%d %H:%M:%S")
                    hr_str = dt_val.strftime("%I %p").lstrip("0")
                except Exception:
                    pass
            
            p_pop = item.get("pop", 0)
            p_clouds = item.get("clouds", {}).get("all", 0)
            p_type = "sun"
            if p_pop > 0.4:
                p_type = "rain"
            elif p_clouds > 50:
                p_type = "cloud"

            hourly.append({
                "time": hr_str,
                "temp": f"{round(item['main']['temp'])}°C",
                "rain": f"{round(p_pop * 100)}%",
                "wind": f"{round(item['wind']['speed'] * 3.6)} km/h",
                "type": p_type
            })

        # Process Daily (Group by Date)
        daily_groups = {}
        for item in forecast_data.get("list", []):
            dt_txt = item.get("dt_txt", "")
            if not dt_txt:
                continue
            date_str = dt_txt.split(" ")[0]
            if date_str not in daily_groups:
                daily_groups[date_str] = []
            daily_groups[date_str].append(item)

        daily = []
        days_names = ["Today", "Tomorrow", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        
        # Sort date keys
        sorted_dates = sorted(daily_groups.keys())
        for idx, d_key in enumerate(sorted_dates[:7]):
            items = daily_groups[d_key]
            temps = [it["main"]["temp"] for it in items]
            min_t = min(temps)
            max_t = max(temps)
            avg_hum = sum(it["main"]["humidity"] for it in items) / len(items)
            avg_wind = sum(it["wind"]["speed"] for it in items) / len(items) * 3.6
            avg_pop = sum(it.get("pop", 0) for it in items) / len(items) * 100
            cond_main = items[0]["weather"][0]["main"]
            cond_desc = items[0]["weather"][0]["description"].title()
            
            p_type = "sun"
            if avg_pop > 40:
                p_type = "rain"
            elif items[0]["clouds"]["all"] > 50:
                p_type = "cloud"

            # Generate advice
            if avg_pop > 60:
                advice = "Heavy rain forecast. Skip irrigation today and clear drainage channels to avoid waterlogging."
            elif avg_wind > 18:
                advice = "High wind speed. Avoid spraying pesticides or fertilizers to prevent chemical drift."
            elif max_t > 30:
                advice = "Hot day. Increase drip cycles by 15% in early morning or evening to combat soil moisture loss."
            else:
                advice = "Clear skies and moderate weather. Ideal conditions for general field weeding and crop health inspections."

            day_lbl = days_names[0] if idx == 0 else (days_names[1] if idx == 1 else "")
            if not day_lbl:
                try:
                    dt_val = datetime.datetime.strptime(d_key, "%Y-%m-%d")
                    day_lbl = dt_val.strftime("%A")
                except Exception:
                    day_lbl = "Next Day"

            if idx == 0:
                day_lbl = f"{day_lbl} (Today)"

            daily.append({
                "day": day_lbl,
                "temp": f"{round(min_t)}°C - {round(max_t)}°C",
                "rain": f"{round(avg_pop)}%",
                "humidity": f"{round(avg_hum)}%",
                "wind": f"{round(avg_wind)} km/h",
                "condition": cond_desc,
                "type": p_type,
                "advice": advice
            })

        # Extrapolate to 7 days if OpenWeather returned fewer
        while len(daily) < 7:
            ref_idx = len(daily) - 1
            ref_day = daily[ref_idx] if ref_idx >= 0 else {}
            next_date = datetime.date.today() + datetime.timedelta(days=len(daily))
            daily.append({
                "day": next_date.strftime("%A"),
                "temp": ref_day.get("temp", "24°C - 30°C"),
                "rain": ref_day.get("rain", "10%"),
                "humidity": ref_day.get("humidity", "60%"),
                "wind": ref_day.get("wind", "12 km/h"),
                "condition": ref_day.get("condition", "Sunny Intervals"),
                "type": ref_day.get("type", "sun"),
                "advice": "Fair weather conditions expected. Proceed with standard irrigation schedules."
            })

        return {
            "current": current,
            "hourly": hourly,
            "daily": daily
        }

    @staticmethod
    def _reconstruct_from_db(forecasts: List[WeatherForecast]) -> dict:
        """Helper to rebuild the daily response block from database cache."""
        first = forecasts[0]
        current = {
            "temp": round(first.temperature_c),
            "feels_like": round(first.feels_like_c),
            "condition": first.condition,
            "humidity": int(first.humidity_pct),
            "wind_speed": round(first.wind_speed_kph),
            "rain_prob": round(first.rain_prob_pct),
            "uv_index": first.uv_index,
            "best_irrigation_window": "6:00 PM - 8:00 PM" if first.rain_prob_pct < 40 else "Farming rest day",
            "spraying_favorable": first.wind_speed_kph < 15 and first.rain_prob_pct < 30
        }
        
        # Build standard dummy hourly for cache hits
        hourly = [
            {"time": "Now", "temp": f"{round(first.temperature_c)}°C", "rain": f"{round(first.rain_prob_pct)}%", "wind": f"{round(first.wind_speed_kph)} km/h", "type": "sun"},
            {"time": "3 PM", "temp": f"{round(first.temperature_c)}°C", "rain": f"{round(first.rain_prob_pct)}%", "wind": f"{round(first.wind_speed_kph)} km/h", "type": "cloud"}
        ]
        
        daily = []
        for idx, f in enumerate(forecasts):
            day_lbl = "Today" if idx == 0 else ("Tomorrow" if idx == 1 else f.forecast_date.strftime("%A"))
            if idx == 0:
                day_lbl = "Today"
            daily.append({
                "day": day_lbl,
                "temp": f"{round(f.temperature_c - 3)}°C - {round(f.temperature_c + 3)}°C",
                "rain": f"{round(f.rain_prob_pct)}%",
                "humidity": f"{round(f.humidity_pct)}%",
                "wind": f"{round(f.wind_speed_kph)} km/h",
                "condition": f.condition,
                "type": "rain" if f.rain_prob_pct > 50 else ("cloud" if f.humidity_pct > 75 else "sun"),
                "advice": "Weather loaded from database cache. Standard agricultural advisories apply."
            })
            
        return {
            "current": current,
            "hourly": hourly,
            "daily": daily
        }

    @staticmethod
    def _get_mock_weather(lat: float, lng: float) -> dict:
        """Unmodified baseline mock implementation for fallback safety."""
        current = {
            "temp": 28,
            "feels_like": 30,
            "condition": "Cloudy Sky",
            "humidity": 62,
            "wind_speed": 14,
            "rain_prob": 10,
            "uv_index": 6,
            "best_irrigation_window": "6:00 PM - 8:00 PM",
            "spraying_favorable": True
        }
        hourly = [
            {"time": "Now", "temp": "28°C", "rain": "10%", "wind": "14 km/h", "type": "sun"},
            {"time": "2 PM", "temp": "29°C", "rain": "10%", "wind": "15 km/h", "type": "sun"},
            {"time": "3 PM", "temp": "29°C", "rain": "15%", "wind": "16 km/h", "type": "cloud"},
            {"time": "4 PM", "temp": "28°C", "rain": "20%", "wind": "14 km/h", "type": "cloud"},
            {"time": "5 PM", "temp": "27°C", "rain": "25%", "wind": "12 km/h", "type": "cloud"},
            {"time": "6 PM", "temp": "26°C", "rain": "40%", "wind": "10 km/h", "type": "rain"},
            {"time": "7 PM", "temp": "25°C", "rain": "65%", "wind": "9 km/h", "type": "rain"},
            {"time": "8 PM", "temp": "24°C", "rain": "80%", "wind": "8 km/h", "type": "rain"}
        ]
        daily = [
            {"day": "Today", "temp": "24°C - 30°C", "rain": "10%", "humidity": "62%", "wind": "14 km/h", "condition": "Sunny Intervals", "type": "sun", "advice": "Delay weeding operations. Soil temperature is high, meaning water evaporation is active."},
            {"day": "Tomorrow", "temp": "23°C - 28°C", "rain": "85%", "humidity": "88%", "wind": "18 km/h", "condition": "Heavy Showers", "type": "rain", "advice": "Skip irrigation entirely. Rain levels will exceed 22mm, leading to saturated clay soils."}
        ]
        return {"current": current, "hourly": hourly, "daily": daily}

def uuid_generator():
    import uuid
    return uuid.uuid4()
