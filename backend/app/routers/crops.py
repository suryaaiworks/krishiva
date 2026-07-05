from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.crop import CropResponse
from app.controllers.crops_controller import CropsController
from app.repositories.crop_repo import CropRepository
from app.repositories.farm_repo import FarmRepository
from typing import List, Dict, Any

router = APIRouter(prefix="/crops", tags=["Crop Advisor"])

@router.post("/recommend")
async def recommend_crops(
    payload: Dict[str, Any],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = await CropsController.recommend_crops(db, current_user.id, payload)
    return res

@router.get("/history", response_model=List[CropResponse])
def get_crop_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Find all farms for user first
    farms = FarmRepository.get_by_user(db, current_user.id)
    crop_list = []
    for f in farms:
        crops = CropRepository.get_crops_by_farm(db, f.id)
        crop_list.extend(crops)
    return crop_list
