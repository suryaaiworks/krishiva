import logging
from sqlalchemy.orm import Session
from app.repositories.farm_repo import FarmRepository
from app.repositories.crop_repo import CropRepository
from app.services.storage_service import StorageService
from app.ai_agents.crop.agent import CropAgent
from app.ai_agents.disease.agent import DiseaseAgent
from uuid import UUID
from fastapi import UploadFile, HTTPException

logger = logging.getLogger(__name__)

class CropsController:
    @staticmethod
    def register_farm(db: Session, user_id: UUID, name: str, area: str, soil_type: str, water_source: str, location_name: str = None, lat: float = None, lng: float = None) -> dict:
        """Saves a new farm field and its geographical coordinate anchors."""
        farm = FarmRepository.create_farm(db, user_id, name, area, soil_type, water_source)
        if location_name and lat is not None and lng is not None:
            FarmRepository.set_location(db, farm.id, location_name, lat, lng)
            
        # Seed a default health status for the farm
        FarmRepository.update_crop_health(
            db,
            farm.id,
            health_score=92,
            growth_stage="Vegetative",
            water_level="Adequate",
            disease_risk="Low",
            ai_confidence=0.96
        )
        return {"success": True, "farm_id": str(farm.id), "message": "Farm registered successfully."}

    @staticmethod
    async def recommend_crops(db: Session, user_id: UUID, stepper_data: dict) -> dict:
        """
        Executes CropAdvisor modular agent check.
        Saves evaluations to history.
        """
        agent = CropAgent()
        result = await agent.evaluate_suitability(stepper_data)
        
        # Save evaluation under AIRecommendations
        CropRepository.save_ai_recommendation(db, user_id, f"Crop evaluation for {stepper_data.get('soilType')}", result)
        
        formatted_crops = result.get("recommended_crops", [])
        
        return {
            "success": True,
            "crop_recommendations": formatted_crops
        }

    @staticmethod
    async def scan_crop_disease(db: Session, user_id: UUID, image_file: UploadFile, farm_id: UUID = None) -> dict:
        """
        Uploads leaf file to Supabase Storage.
        Triggers Disease Scanner AI model mock.
        Saves diagnostic log to database.
        """
        try:
            file_bytes = await image_file.read()
            public_url = StorageService.upload_file(
                bucket_name="disease-images",
                file_name=image_file.filename,
                file_bytes=file_bytes,
                content_type=image_file.content_type
            )
        except Exception as e:
            logger.error(f"Image upload fail: {e}")
            raise HTTPException(status_code=500, detail="Leaf image upload failed.")

        # Run Disease Diagnostic model
        agent = DiseaseAgent()
        diag = await agent.analyze_leaf(file_bytes)
        
        confidence_val = diag["confidence"]
        confidence_pct_str = f"{confidence_val:.1f}%" if confidence_val > 1.0 else f"{confidence_val * 100:.1f}%"
        confidence_float = confidence_val / 100.0 if confidence_val > 1.0 else confidence_val
        
        # Save diagnostic entry in database
        CropRepository.create_disease_scan(
            db,
            user_id=user_id,
            image_url=public_url,
            crop_name=diag["crop_name"],
            disease_name=diag["disease_name"],
            severity=diag["severity"],
            confidence=confidence_float,
            treatment_plan={
                "organic": diag["treatment_organic"],
                "chemical": diag["treatment_chemical"]
            },
            farm_id=farm_id
        )

        return {
            "success": True,
            "image_url": public_url,
            "disease_detected": diag["disease_name"],
            "severity": diag["severity"],
            "confidence": confidence_pct_str,
            "explanation": diag["description"],
            "treatment": {
                "chemical": diag["treatment_chemical"],
                "organic": diag["treatment_organic"]
            }
        }
