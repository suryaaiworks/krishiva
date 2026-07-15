from sqlalchemy import Column, String, Integer, Double, ForeignKey, DateTime, UUID
from sqlalchemy.orm import relationship
from app.database.connection import Base
import datetime
import uuid

class Farm(Base):
    __tablename__ = "farms"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    area = Column(String, nullable=False)
    soil_type = Column(String, nullable=False)
    water_source = Column(String, nullable=False)
    current_crop = Column(String, nullable=True)
    health_score = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="farms")
    location = relationship("FarmLocation", uselist=False, back_populates="farm")
    crops = relationship("Crop", back_populates="farm")
    health = relationship("CropHealth", uselist=False, back_populates="farm")

class FarmLocation(Base):
    __tablename__ = "farm_locations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), unique=True, nullable=False)
    location_name = Column(String, nullable=False)
    latitude = Column(Double, nullable=False)
    longitude = Column(Double, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    farm = relationship("Farm", back_populates="location")

class CropHealth(Base):
    __tablename__ = "crop_health"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), unique=True, nullable=False)
    health_score = Column(Integer, default=100, nullable=False)
    growth_stage = Column(String, nullable=False)
    water_level = Column(String, nullable=False)
    disease_risk = Column(String, nullable=False)
    ai_confidence = Column(Double, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    
    farm = relationship("Farm", back_populates="health")
