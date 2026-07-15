from sqlalchemy import Column, String, ForeignKey, DateTime, Double, Integer, Date, UUID
from app.database.connection import Base
import datetime
import uuid

class WeatherForecast(Base):
    __tablename__ = "weather_forecasts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    location_id = Column(UUID(as_uuid=True), ForeignKey("farm_locations.id", ondelete="CASCADE"), nullable=False)
    temperature_c = Column(Double, nullable=False)
    feels_like_c = Column(Double, nullable=False)
    humidity_pct = Column(Double, nullable=False)
    wind_speed_kph = Column(Double, nullable=False)
    rain_prob_pct = Column(Double, nullable=False)
    uv_index = Column(Integer, nullable=False)
    condition = Column(String, nullable=False)
    forecast_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
