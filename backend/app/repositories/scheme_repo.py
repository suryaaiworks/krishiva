from sqlalchemy.orm import Session
from app.models.scheme import GovernmentScheme, SchemeApplication
from uuid import UUID
from typing import Optional, List

class SchemeRepository:
    @staticmethod
    def get_all(db: Session) -> List[GovernmentScheme]:
        return db.query(GovernmentScheme).all()

    @staticmethod
    def get_by_id(db: Session, scheme_id: UUID) -> Optional[GovernmentScheme]:
        return db.query(GovernmentScheme).filter(GovernmentScheme.id == scheme_id).first()

    @staticmethod
    def create_scheme(db: Session, scheme_data: dict) -> GovernmentScheme:
        scheme = GovernmentScheme(**scheme_data)
        db.add(scheme)
        db.commit()
        db.refresh(scheme)
        return scheme

    @staticmethod
    def get_applications_by_user(db: Session, user_id: UUID) -> List[SchemeApplication]:
        return db.query(SchemeApplication).filter(SchemeApplication.user_id == user_id).all()

    @staticmethod
    def create_application(db: Session, scheme_id: UUID, user_id: UUID, docs: list) -> SchemeApplication:
        from sqlalchemy.exc import IntegrityError
        from app.repositories.user_repo import UserRepository
        try:
            app = SchemeApplication(scheme_id=scheme_id, user_id=user_id, status="Pending", submitted_documents=docs)
            db.add(app)
            db.commit()
            db.refresh(app)
            return app
        except IntegrityError:
            db.rollback()
            UserRepository.upsert_skeleton_user(db, user_id)
            
            app = SchemeApplication(scheme_id=scheme_id, user_id=user_id, status="Pending", submitted_documents=docs)
            db.add(app)
            db.commit()
            db.refresh(app)
            return app
