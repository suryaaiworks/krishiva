from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class MachineryResponse(BaseModel):
    id: UUID
    name: str
    price: str
    dist: str
    owner: str
    phone: str
    status: str
    rating: str

    class Config:
        from_attributes = True

class MachineryBookingCreate(BaseModel):
    machinery_id: UUID
    booking_date: str
    booking_time: Optional[str] = None

class MachineryBookingResponse(BaseModel):
    id: UUID
    machinery_id: UUID
    user_id: UUID
    status: str
    booked_at: datetime
    booking_date: Optional[str] = None
    booking_time: Optional[str] = None

    class Config:
        from_attributes = True
