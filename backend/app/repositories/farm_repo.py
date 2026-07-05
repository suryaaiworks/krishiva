from sqlalchemy.orm import Session
from app.models.farm import Farm, FarmLocation, CropHealth
from app.models.weather import WeatherForecast
from uuid import UUID
from typing import Optional, List
import datetime

class FarmRepository:
    @staticmethod
    def get_by_id(db: Session, farm_id: UUID) -> Optional[Farm]:
        return db.query(Farm).filter(Farm.id == farm_id).first()

    @staticmethod
    def get_by_user(db: Session, user_id: UUID) -> List[Farm]:
        return db.query(Farm).filter(Farm.user_id == user_id).all()

    @staticmethod
    def create_farm(db: Session, user_id: UUID, name: str, area: str, soil_type: str, water_source: str, current_crop: str = None) -> Farm:
        farm = Farm(user_id=user_id, name=name, area=area, soil_type=soil_type, water_source=water_source, current_crop=current_crop)
        db.add(farm)
        db.commit()
        db.refresh(farm)
        return farm

    @staticmethod
    def set_location(db: Session, farm_id: UUID, location_name: str, latitude: float, longitude: float) -> FarmLocation:
        loc = db.query(FarmLocation).filter(FarmLocation.farm_id == farm_id).first()
        if not loc:
            loc = FarmLocation(farm_id=farm_id, location_name=location_name, latitude=latitude, longitude=longitude)
            db.add(loc)
        else:
            loc.location_name = location_name
            loc.latitude = latitude
            loc.longitude = longitude
        db.commit()
        db.refresh(loc)
        return loc

    @staticmethod
    def get_location(db: Session, farm_id: UUID) -> Optional[FarmLocation]:
        return db.query(FarmLocation).filter(FarmLocation.farm_id == farm_id).first()

    @staticmethod
    def update_crop_health(db: Session, farm_id: UUID, health_score: int, growth_stage: str, water_level: str, disease_risk: str, ai_confidence: float) -> CropHealth:
        ch = db.query(CropHealth).filter(CropHealth.farm_id == farm_id).first()
        if not ch:
            ch = CropHealth(
                farm_id=farm_id,
                health_score=health_score,
                growth_stage=growth_stage,
                water_level=water_level,
                disease_risk=disease_risk,
                ai_confidence=ai_confidence
            )
            db.add(ch)
        else:
            ch.health_score = health_score
            ch.growth_stage = growth_stage
            ch.water_level = water_level
            ch.disease_risk = disease_risk
            ch.ai_confidence = ai_confidence
            ch.updated_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(ch)
        return ch

    @staticmethod
    def get_crop_health(db: Session, farm_id: UUID) -> Optional[CropHealth]:
        return db.query(CropHealth).filter(CropHealth.farm_id == farm_id).first()

    @staticmethod
    def create_weather_forecast(db: Session, location_id: UUID, temp: float, feels_like: float, humidity: float, wind_speed: float, rain_prob: float, uv: int, condition: str, forecast_date: datetime.date) -> WeatherForecast:
        wf = WeatherForecast(
            location_id=location_id,
            temperature_c=temp,
            feels_like_c=feels_like,
            humidity_pct=humidity,
            wind_speed_kph=wind_speed,
            rain_prob_pct=rain_prob,
            uv_index=uv,
            condition=condition,
            forecast_date=forecast_date
        )
        db.add(wf)
        db.commit()
        db.refresh(wf)
        return wf

    @staticmethod
    def get_weather_forecasts(db: Session, location_id: UUID, start_date: datetime.date, end_date: datetime.date) -> List[WeatherForecast]:
        return db.query(WeatherForecast).filter(
            WeatherForecast.location_id == location_id,
            WeatherForecast.forecast_date >= start_date,
            WeatherForecast.forecast_date <= end_date
        ).order_by(WeatherForecast.forecast_date.asc()).all()
