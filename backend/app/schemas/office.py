from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class SupportOfficeResponse(BaseModel):
    id: UUID
    name: str
    type: str
    district: str
    block: str
    address: str
    distance: str
    duration: str
    rating: float
    status: str
    hours: str
    officer: str
    designation: str
    phone: str
    email: str
    coords: Dict[str, float]
    directions: List[str]

    class Config:
        from_attributes = True

class OfficeBookingCreate(BaseModel):
    office_id: UUID
    purpose: str
    date: str
    slot: str

class OfficeBookingResponse(BaseModel):
    id: UUID
    office_id: UUID
    user_id: UUID
    purpose: str
    date: str
    slot: str
    token_number: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
