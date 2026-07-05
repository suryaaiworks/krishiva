from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import date, datetime

class FarmLocationCreate(BaseModel):
    location_name: str
    latitude: float
    longitude: float

class FarmLocationResponse(BaseModel):
    id: UUID
    location_name: str
    latitude: float
    longitude: float

    class Config:
        from_attributes = True

class FarmCreate(BaseModel):
    name: str
    area: str
    soil_type: str
    water_source: str
    current_crop: Optional[str] = None
    location: Optional[FarmLocationCreate] = None

class FarmResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    area: str
    soil_type: str
    water_source: str
    current_crop: Optional[str]
    health_score: int
    location: Optional[FarmLocationResponse] = None

    class Config:
        from_attributes = True

class CropHealthResponse(BaseModel):
    farm_id: UUID
    health_score: int
    growth_stage: str
    water_level: str
    disease_risk: str
    ai_confidence: float
    updated_at: datetime

    class Config:
        from_attributes = True

class WeatherForecastResponse(BaseModel):
    temperature_c: float
    feels_like_c: float
    humidity_pct: float
    wind_speed_kph: float
    rain_prob_pct: float
    uv_index: int
    condition: str
    forecast_date: date

    class Config:
        from_attributes = True
