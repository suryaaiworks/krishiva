from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.task import NotificationResponse
from app.schemas.auth import StandardResponse
from app.repositories.notification_repo import NotificationRepository
from uuid import UUID
from typing import List

router = APIRouter(prefix="/notifications", tags=["Notifications Alert Panel"])

@router.get("", response_model=List[NotificationResponse])
def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notis = NotificationRepository.get_notifications(db, current_user.id)
    if not notis:
        # Seed default alerts matching the frontend mockup
        NotificationRepository.create_notification(
            db, current_user.id, "critical", "weather",
            "Dry Spell Warning - Action Needed",
            "Zero precipitation is forecasted for the next 5 consecutive days starting tomorrow. Drip irrigate Sugarcane Zone B today.",
            "Just now", "Irrigation Guide", "/weather"
        )
        NotificationRepository.create_notification(
            db, current_user.id, "warning", "pest",
            "Sugarcane Stem Borer Alert",
            "Local humidity and temperature profiles indicate high risk of stem borer propagation. Inspect lower stalks.",
            "3 hours ago", "Foliage Scan", "/disease"
        )
        notis = NotificationRepository.get_notifications(db, current_user.id)
    return notis

@router.post("/{noti_id}/toggle", response_model=NotificationResponse)
def toggle_notification_read(noti_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    noti = NotificationRepository.toggle_read(db, noti_id)
    return noti

@router.post("/read-all", response_model=StandardResponse)
def mark_all_read(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    NotificationRepository.mark_all_read(db, current_user.id)
    return StandardResponse(success=True, message="All notifications marked as read.")

@router.delete("", response_model=StandardResponse)
def clear_all_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    NotificationRepository.clear_all(db, current_user.id)
    return StandardResponse(success=True, message="All notifications purged.")
