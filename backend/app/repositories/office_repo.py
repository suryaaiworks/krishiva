from sqlalchemy.orm import Session
from app.models.office import SupportOffice, OfficeBooking
from uuid import UUID
from typing import Optional, List

class OfficeRepository:
    @staticmethod
    def get_all(db: Session) -> List[SupportOffice]:
        return db.query(SupportOffice).all()

    @staticmethod
    def get_by_id(db: Session, office_id: UUID) -> Optional[SupportOffice]:
        return db.query(SupportOffice).filter(SupportOffice.id == office_id).first()

    @staticmethod
    def create_office(db: Session, office_data: dict) -> SupportOffice:
        so = SupportOffice(**office_data)
        db.add(so)
        db.commit()
        db.refresh(so)
        return so

    @staticmethod
    def get_bookings_by_user(db: Session, user_id: UUID) -> List[OfficeBooking]:
        return db.query(OfficeBooking).filter(OfficeBooking.user_id == user_id).all()

    @staticmethod
    def create_booking(db: Session, office_id: UUID, user_id: UUID, purpose: str, date: str, slot: str, token_number: str) -> OfficeBooking:
        booking = OfficeBooking(
            office_id=office_id,
            user_id=user_id,
            purpose=purpose,
            date=date,
            slot=slot,
            token_number=token_number,
            status="confirmed"
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        return booking
