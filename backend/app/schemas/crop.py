from pydantic import BaseModel
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class CropCreate(BaseModel):
    farm_id: UUID
    name: str
    category: str
    season: str
    water_requirement: Optional[str] = None
    soil_type: Optional[str] = None

class CropResponse(BaseModel):
    id: UUID
    farm_id: UUID
    name: str
    category: str
    season: str
    water_requirement: Optional[str]
    soil_type: Optional[str]

    class Config:
        from_attributes = True

class DiseaseScanCreate(BaseModel):
    image_url: str
    farm_id: Optional[UUID] = None

class DiseaseScanResponse(BaseModel):
    id: UUID
    user_id: UUID
    farm_id: Optional[UUID]
    image_url: str
    crop_name: str
    disease_name: str
    severity: str
    confidence: float
    treatment_plan: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class AIRecommendationResponse(BaseModel):
    id: UUID
    user_id: UUID
    query: str
    recommendations: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
