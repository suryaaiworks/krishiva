from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.scheme import GovernmentSchemeResponse, SchemeApplicationCreate, SchemeApplicationResponse
from app.repositories.scheme_repo import SchemeRepository
from app.ai_agents.schemes.agent import SchemesAgent
from typing import List

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("/match", response_model=List[GovernmentSchemeResponse])
async def get_matched_schemes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    schemes = SchemeRepository.get_all(db)
    if not schemes:
        # Seed default schemes
        SchemeRepository.create_scheme(db, {
            "name": "PM-KISAN (Income Support Scheme)",
            "benefit": "₹6,000 / Year",
            "eligibility_score": "100%",
            "deadline": "July 31, 2026",
            "approval_time": "14 Days",
            "priority": "High",
            "description": "Direct benefit support check of three equal installments.",
            "required_documents": ["Aadhaar", "Land Records", "Bank Passbook"]
        })
        SchemeRepository.create_scheme(db, {
            "name": "PM-KUSUM (Solar Pump Subsidy)",
            "benefit": "60% Subsidy (₹24,500 value)",
            "eligibility_score": "95%",
            "deadline": "June 30, 2026",
            "approval_time": "25 Days",
            "priority": "High",
            "description": "Financial assistance to install solar water pumps.",
            "required_documents": ["Land records", "Aadhaar", "Farmer ID certificate"]
        })
        schemes = SchemeRepository.get_all(db)
        
    return schemes

@router.post("/apply", response_model=SchemeApplicationResponse)
def submit_scheme_claim(
    payload: SchemeApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = SchemeRepository.create_application(db, payload.scheme_id, current_user.id, payload.submitted_documents)
    return app
