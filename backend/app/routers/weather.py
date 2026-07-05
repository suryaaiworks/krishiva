from fastapi import APIRouter, Depends, Query
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather Intelligence Advisory"])

@router.get("/forecast")
def get_weather_forecast(
    latitude: float = Query(18.5204, description="Latitude coordinates"),
    longitude: float = Query(73.8567, description="Longitude coordinates")
):
    """
    Returns live weather summaries, hourly details,
    and 7-day advisory checklists.
    """
    return WeatherService.get_weather_forecast(latitude, longitude)
