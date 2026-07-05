from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.office import SupportOfficeResponse, OfficeBookingCreate, OfficeBookingResponse
from app.repositories.office_repo import OfficeRepository
import random
from typing import List

router = APIRouter(prefix="/offices", tags=["Helpline & Offices"])

@router.get("", response_model=List[SupportOfficeResponse])
def get_offices(db: Session = Depends(get_db)):
    offices = OfficeRepository.get_all(db)
    if not offices:
        # Seed default offices
        OfficeRepository.create_office(db, {
            "name": "Rythu Seva Kendra (RSK Shirur)",
            "type": "seva-kendra",
            "district": "Pune",
            "block": "Shirur",
            "address": "Opposite Gram Panchayat Office, Shirur, MH",
            "distance": "2.4 km",
            "duration": "8 mins",
            "rating": 4.8,
            "status": "Open Now",
            "hours": "9:00 AM - 5:00 PM",
            "officer": "Dr. Sanjay Patil",
            "designation": "Lead Agronomist",
            "phone": "+91 98234 56789",
            "email": "shirur.rsk@maharashtra.gov.in",
            "coords": {"x": 120, "y": 150},
            "directions": ["head east on Village Road", "turn right onto NH-60"]
        })
        OfficeRepository.create_office(db, {
            "name": "District Soil & Testing Lab",
            "type": "soil-lab",
            "district": "Pune",
            "block": "Haveli",
            "address": " Shivaji Nagar Agriculture College, Pune",
            "distance": "8.7 km",
            "duration": "18 mins",
            "rating": 4.5,
            "status": "Open Now",
            "hours": "10:00 AM - 4:00 PM",
            "officer": "Mrs. Smita Joshi",
            "designation": "Chief Analyst",
            "phone": "+91 94220 98765",
            "email": "soillab.pune@maharashtra.gov.in",
            "coords": {"x": 210, "y": 80},
            "directions": ["head west", "take SH-27 north"]
        })
        offices = OfficeRepository.get_all(db)
    return offices

@router.post("/book", response_model=OfficeBookingResponse)
def book_appointment(
    payload: OfficeBookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    token = f"TK-{random.randint(1000, 9999)}"
    booking = OfficeRepository.create_booking(
        db,
        office_id=payload.office_id,
        user_id=current_user.id,
        purpose=payload.purpose,
        date=payload.date,
        slot=payload.slot,
        token_number=token
    )
    return booking
