from sqlalchemy.orm import Session
from app.models.machinery import Machinery, MachineryBooking
from uuid import UUID
from typing import Optional, List

class MachineryRepository:
    @staticmethod
    def get_all(db: Session) -> List[Machinery]:
        return db.query(Machinery).all()

    @staticmethod
    def get_by_id(db: Session, mach_id: UUID) -> Optional[Machinery]:
        return db.query(Machinery).filter(Machinery.id == mach_id).first()

    @staticmethod
    def create_machinery(db: Session, mach_data: dict) -> Machinery:
        mach = Machinery(**mach_data)
        db.add(mach)
        db.commit()
        db.refresh(mach)
        return mach

    @staticmethod
    def update_status(db: Session, mach_id: UUID, status: str) -> Optional[Machinery]:
        mach = MachineryRepository.get_by_id(db, mach_id)
        if mach:
            mach.status = status
            db.commit()
            db.refresh(mach)
        return mach

    @staticmethod
    def get_bookings_by_user(db: Session, user_id: UUID) -> List[MachineryBooking]:
        return db.query(MachineryBooking).filter(MachineryBooking.user_id == user_id).all()

    @staticmethod
    def create_booking(db: Session, machinery_id: UUID, user_id: UUID) -> MachineryBooking:
        booking = MachineryBooking(machinery_id=machinery_id, user_id=user_id, status="booked")
        db.add(booking)
        
        # Mark machinery as rented
        MachineryRepository.update_status(db, machinery_id, "rented")
        
        db.commit()
        db.refresh(booking)
        return booking
