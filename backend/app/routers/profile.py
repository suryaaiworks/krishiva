from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.user import FarmerProfileResponse, FarmerProfileCreate
from app.schemas.farm import FarmCreate, FarmResponse
from app.schemas.auth import StandardResponse
from app.controllers.profile_controller import ProfileController
from app.controllers.crops_controller import CropsController
from app.repositories.farm_repo import FarmRepository
from typing import List

router = APIRouter(prefix="/profile", tags=["Profile Management"])

@router.get("", response_model=FarmerProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    res = ProfileController.get_profile(db, current_user.id)
    return FarmerProfileResponse(
        id=current_user.id,
        name=res["name"],
        experience_years=res["experience_years"],
        verified_id=res["verified_id"],
        bank_account=res["bank_account"],
        bank_name=res["bank_name"],
        certification_status=res["certification_status"]
    )

@router.put("", response_model=StandardResponse)
def update_profile(
    payload: FarmerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = ProfileController.update_profile(
        db,
        current_user.id,
        name=payload.name,
        experience_years=payload.experience_years,
        bank_account=payload.bank_account,
        bank_name=payload.bank_name
    )
    return StandardResponse(success=res["success"], message=res["message"])

@router.post("/farms", response_model=StandardResponse)
def register_farm(
    payload: FarmCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    loc_name = payload.location.location_name if payload.location else None
    lat = payload.location.latitude if payload.location else None
    lng = payload.location.longitude if payload.location else None
    
    res = CropsController.register_farm(
        db,
        current_user.id,
        name=payload.name,
        area=payload.area,
        soil_type=payload.soil_type,
        water_source=payload.water_source,
        location_name=loc_name,
        lat=lat,
        lng=lng
    )
    return StandardResponse(success=res["success"], message=res["message"])

@router.get("/farms", response_model=List[FarmResponse])
def get_user_farms(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    farms = FarmRepository.get_by_user(db, current_user.id)
    result = []
    for f in farms:
        loc = FarmRepository.get_location(db, f.id)
        loc_resp = None
        if loc:
            from app.schemas.farm import FarmLocationResponse
            loc_resp = FarmLocationResponse(
                id=loc.id,
                location_name=loc.location_name,
                latitude=loc.latitude,
                longitude=loc.longitude
            )
        result.append(
            FarmResponse(
                id=f.id,
                user_id=f.user_id,
                name=f.name,
                area=f.area,
                soil_type=f.soil_type,
                water_source=f.water_source,
                current_crop=f.current_crop,
                health_score=f.health_score,
                location=loc_resp
            )
        )
    return result
