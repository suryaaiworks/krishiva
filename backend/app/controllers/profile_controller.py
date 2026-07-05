import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.repositories.user_repo import UserRepository
from app.repositories.farm_repo import FarmRepository
from uuid import UUID

logger = logging.getLogger(__name__)

class ProfileController:
    @staticmethod
    def get_profile(db: Session, user_id: UUID) -> dict:
        """Retrieves verified profile details, registered farms count, and experience years."""
        profile = UserRepository.get_profile(db, user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not registered.")
        
        user = UserRepository.get_by_id(db, user_id)
        farms = FarmRepository.get_by_user(db, user_id)
        
        # Calculate total acreage from farms
        total_acres = 0.0
        for f in farms:
            try:
                # e.g., "5.5 Acres" -> 5.5
                val = float(f.area.lower().replace("acres", "").strip())
                total_acres += val
            except Exception:
                pass
                
        return {
            "name": profile.name,
            "role": user.role if user else "Farmer",
            "experience_years": profile.experience_years,
            "verified_id": profile.verified_id or f"KA-2026-{str(user_id)[:5].upper()}",
            "bank_account": profile.bank_account,
            "bank_name": profile.bank_name,
            "certification_status": profile.certification_status,
            "farms_count": len(farms),
            "total_land_holdings": f"{total_acres:.1f} Acres" if total_acres > 0 else "0.0 Acres",
            "dbt_linked": bool(profile.bank_account and profile.bank_name)
        }

    @staticmethod
    def update_profile(db: Session, user_id: UUID, name: str, experience_years: int, bank_account: str = None, bank_name: str = None) -> dict:
        """Updates profile details in database."""
        profile = UserRepository.create_or_update_profile(
            db,
            user_id,
            name=name,
            experience_years=experience_years,
            bank_account=bank_account,
            bank_name=bank_name
        )
        UserRepository.log_activity(db, user_id, "UPDATE_PROFILE", "Updated account profile bank details.")
        return {"success": True, "message": "Profile updated successfully."}

    @staticmethod
    def get_settings(db: Session, user_id: UUID) -> dict:
        """Loads app configurations."""
        settings = UserRepository.get_settings(db, user_id)
        if not settings:
            # Seed default settings
            settings = UserRepository.update_settings(db, user_id, {})
        
        return {
            "language": settings.language,
            "theme": settings.theme,
            "font_size": settings.font_size,
            "voice_enabled": settings.voice_enabled,
            "offline_mode": settings.offline_mode,
            "biometrics_enabled": settings.biometrics_enabled,
            "pin_lock_enabled": settings.pin_lock_enabled,
            "notifications_config": settings.notifications_config or {
                "weather": True,
                "market": True,
                "schemes": True,
                "disaster": True,
                "buyers": False,
                "ngos": True
            }
        }

    @staticmethod
    def update_settings(db: Session, user_id: UUID, settings_data: dict) -> dict:
        """Updates app settings."""
        UserRepository.update_settings(db, user_id, settings_data)
        UserRepository.log_activity(db, user_id, "UPDATE_SETTINGS", "Updated system and notification channels.")
        return {"success": True, "message": "Configurations updated successfully."}
