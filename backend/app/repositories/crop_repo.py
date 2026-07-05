from sqlalchemy.orm import Session
from app.models.crop import Crop, DiseaseScan, AIRecommendation
from uuid import UUID
from typing import Optional, List

class CropRepository:
    @staticmethod
    def get_crops_by_farm(db: Session, farm_id: UUID) -> List[Crop]:
        return db.query(Crop).filter(Crop.farm_id == farm_id).all()

    @staticmethod
    def create_crop_record(db: Session, farm_id: UUID, name: str, category: str, season: str, water_requirement: str = None, soil_type: str = None) -> Crop:
        crop = Crop(farm_id=farm_id, name=name, category=category, season=season, water_requirement=water_requirement, soil_type=soil_type)
        db.add(crop)
        db.commit()
        db.refresh(crop)
        return crop

    @staticmethod
    def get_disease_scans(db: Session, user_id: UUID, limit: int = 10) -> List[DiseaseScan]:
        return db.query(DiseaseScan).filter(DiseaseScan.user_id == user_id).order_by(DiseaseScan.created_at.desc()).limit(limit).all()

    @staticmethod
    def create_disease_scan(db: Session, user_id: UUID, image_url: str, crop_name: str, disease_name: str, severity: str, confidence: float, treatment_plan: dict, farm_id: Optional[UUID] = None) -> DiseaseScan:
        scan = DiseaseScan(
            user_id=user_id,
            farm_id=farm_id,
            image_url=image_url,
            crop_name=crop_name,
            disease_name=disease_name,
            severity=severity,
            confidence=confidence,
            treatment_plan=treatment_plan
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)
        return scan

    @staticmethod
    def get_ai_recommendations(db: Session, user_id: UUID, limit: int = 10) -> List[AIRecommendation]:
        return db.query(AIRecommendation).filter(AIRecommendation.user_id == user_id).order_by(AIRecommendation.created_at.desc()).limit(limit).all()

    @staticmethod
    def save_ai_recommendation(db: Session, user_id: UUID, query: str, recommendations: dict) -> AIRecommendation:
        rec = AIRecommendation(user_id=user_id, query=query, recommendations=recommendations)
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return rec
