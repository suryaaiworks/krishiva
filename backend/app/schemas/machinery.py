from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

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

class MachineryBookingResponse(BaseModel):
    id: UUID
    machinery_id: UUID
    user_id: UUID
    status: str
    booked_at: datetime

    class Config:
        from_attributes = True
