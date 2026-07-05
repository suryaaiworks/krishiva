from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.controllers.crops_controller import CropsController
from uuid import UUID
from typing import Optional

router = APIRouter(prefix="/disease", tags=["Disease Scanner"])

@router.post("/scan")
async def scan_crop_disease(
    file: UploadFile = File(...),
    farm_id: Optional[UUID] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = await CropsController.scan_crop_disease(db, current_user.id, file, farm_id)
    return res
