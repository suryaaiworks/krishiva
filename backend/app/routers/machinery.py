from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.machinery import MachineryResponse, MachineryBookingCreate, MachineryBookingResponse
from app.controllers.machinery_controller import MachineryController
from typing import List

router = APIRouter(prefix="/machinery", tags=["Machinery Rentals"])

@router.get("", response_model=List[MachineryResponse])
def get_listings(db: Session = Depends(get_db)):
    return MachineryController.get_listings(db)

@router.post("/book", response_model=MachineryBookingResponse)
def book_machinery(
    payload: MachineryBookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = MachineryController.book_machinery(db, payload.machinery_id, current_user.id, payload.booking_date, payload.booking_time)
    # Fetch booking
    from app.repositories.machinery_repo import MachineryRepository
    bookings = MachineryRepository.get_bookings_by_user(db, current_user.id)
    # Return latest booking matching machinery
    booking = [b for b in bookings if b.machinery_id == payload.machinery_id][-1]
    return booking

@router.get("/bookings", response_model=List[MachineryBookingResponse])
def get_user_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.repositories.machinery_repo import MachineryRepository
    return MachineryRepository.get_bookings_by_user(db, current_user.id)
