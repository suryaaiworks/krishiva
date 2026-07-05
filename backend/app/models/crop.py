from sqlalchemy import Column, String, Integer, Double, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base
import datetime
import uuid

class Crop(Base):
    __tablename__ = "crops"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    season = Column(String, nullable=False)
    water_requirement = Column(String, nullable=True)
    soil_type = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    farm = relationship("Farm", back_populates="crops")

class DiseaseScan(Base):
    __tablename__ = "disease_scans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id", ondelete="CASCADE"), nullable=True)
    image_url = Column(String, nullable=False)
    crop_name = Column(String, nullable=False)
    disease_name = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    confidence = Column(Double, nullable=False)
    treatment_plan = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    query = Column(String, nullable=False)
    recommendations = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="ai_recommendations")
