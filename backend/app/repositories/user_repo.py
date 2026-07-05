from sqlalchemy.orm import Session
from app.models.user import User, FarmerProfile, Settings, ActivityLog
from uuid import UUID
from typing import Optional, List

class UserRepository:
    @staticmethod
    def get_by_id(db: Session, user_id: UUID) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_phone(db: Session, phone: str) -> Optional[User]:
        return db.query(User).filter(User.phone == phone).first()

    @staticmethod
    def create_user(db: Session, user_id: UUID, email: str, phone: Optional[str], role: str) -> User:
        user = User(id=user_id, email=email, phone=phone, role=role)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_profile(db: Session, user_id: UUID) -> Optional[FarmerProfile]:
        return db.query(FarmerProfile).filter(FarmerProfile.id == user_id).first()

    @staticmethod
    def create_or_update_profile(db: Session, user_id: UUID, name: str, experience_years: int = 0, verified_id: str = None, bank_account: str = None, bank_name: str = None) -> FarmerProfile:
        profile = UserRepository.get_profile(db, user_id)
        if not profile:
            profile = FarmerProfile(
                id=user_id,
                name=name,
                experience_years=experience_years,
                verified_id=verified_id,
                bank_account=bank_account,
                bank_name=bank_name
            )
            db.add(profile)
        else:
            profile.name = name
            profile.experience_years = experience_years
            if verified_id is not None:
                profile.verified_id = verified_id
            if bank_account is not None:
                profile.bank_account = bank_account
            if bank_name is not None:
                profile.bank_name = bank_name
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def get_settings(db: Session, user_id: UUID) -> Optional[Settings]:
        return db.query(Settings).filter(Settings.user_id == user_id).first()

    @staticmethod
    def update_settings(db: Session, user_id: UUID, settings_data: dict) -> Settings:
        settings_obj = UserRepository.get_settings(db, user_id)
        if not settings_obj:
            settings_obj = Settings(user_id=user_id, **settings_data)
            db.add(settings_obj)
        else:
            for k, v in settings_data.items():
                if v is not None:
                    setattr(settings_obj, k, v)
        db.commit()
        db.refresh(settings_obj)
        return settings_obj

    @staticmethod
    def log_activity(db: Session, user_id: Optional[UUID], action: str, details: str = None) -> ActivityLog:
        log = ActivityLog(user_id=user_id, action=action, details=details)
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def get_activity_logs(db: Session, user_id: UUID, limit: int = 50) -> List[ActivityLog]:
        return db.query(ActivityLog).filter(ActivityLog.user_id == user_id).order_by(ActivityLog.created_at.desc()).limit(limit).all()
