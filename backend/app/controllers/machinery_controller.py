import logging
from sqlalchemy.orm import Session
from app.repositories.machinery_repo import MachineryRepository
from uuid import UUID
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class MachineryController:
    @staticmethod
    def get_listings(db: Session) -> list:
        """Retrieves active machinery rental listings."""
        listings = MachineryRepository.get_all(db)
        if not listings:
            MachineryController._seed_default_machinery(db)
            listings = MachineryRepository.get_all(db)
            
        return [
            {
                "id": str(m.id),
                "name": m.name,
                "price": m.price_rate,
                "dist": m.distance,
                "owner": m.owner_name,
                "phone": m.phone,
                "status": m.status,
                "rating": m.rating
            } for m in listings
        ]

    @staticmethod
    def book_machinery(db: Session, machinery_id: UUID, user_id: UUID, booking_date: str, booking_time: str = None) -> dict:
        """Books a specific machinery and updates status."""
        mach = MachineryRepository.get_by_id(db, machinery_id)
        if not mach:
            raise HTTPException(status_code=404, detail="Machinery not found.")
            
        if mach.status != "available":
            raise HTTPException(status_code=400, detail="Machinery is currently unavailable.")
            
        MachineryRepository.create_booking(db, machinery_id, user_id, booking_date, booking_time)
        return {
            "success": True,
            "message": "Booking confirmed successfully. Owner has been notified."
        }

    @staticmethod
    def _seed_default_machinery(db: Session):
        machinery = [
            {"name": "John Deere 5050D Tractor", "price_rate": "₹800/hour", "distance": "1.2 km away", "owner_name": "Ramesh K.", "phone": "+91 98765 43210", "status": "available", "rating": "4.9"},
            {"name": "Pneumatic Seed Drill", "price_rate": "₹500/hour", "distance": "0.8 km away", "owner_name": "Dattatreya P.", "phone": "+91 98223 88440", "status": "available", "rating": "4.7"},
            {"name": "Multicrop Combine Harvester", "price_rate": "₹1,500/hour", "distance": "2.5 km away", "owner_name": "Sanjay Patil", "phone": "+91 90112 55432", "status": "rented", "rating": "4.8"}
        ]
        for m in machinery:
            MachineryRepository.create_machinery(db, m)
