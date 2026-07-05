from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.user import SettingsResponse, SettingsUpdate
from app.schemas.auth import StandardResponse
from app.controllers.profile_controller import ProfileController

router = APIRouter(prefix="/settings", tags=["App Settings configurations"])

@router.get("", response_model=SettingsResponse)
def get_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return ProfileController.get_settings(db, current_user.id)

@router.patch("", response_model=StandardResponse)
def update_settings(
    payload: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Exclude unset values to form delta
    update_data = payload.dict(exclude_unset=True)
    res = ProfileController.update_settings(db, current_user.id, update_data)
    return StandardResponse(success=res["success"], message=res["message"])
