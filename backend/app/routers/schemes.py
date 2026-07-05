from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.scheme import GovernmentSchemeResponse, SchemeApplicationCreate, SchemeApplicationResponse
from app.repositories.scheme_repo import SchemeRepository
from app.ai_agents.schemes.agent import SchemesAgent
from typing import List

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

def translate_schemes(schemes, lang: str):
    if lang not in ["hi", "te"]:
        return schemes
        
    translated = []
    for s in schemes:
        name = s.name
        benefit = s.benefit
        desc = s.description
        docs = list(s.required_documents) if s.required_documents else []
        
        if "PM-KISAN" in name:
            if lang == "te":
                benefit = "₹6,000 / సంవత్సరం"
                desc = "మూడు సమాన వాయిదాలలో ప్రత్యక్ష ప్రయోజన మద్దతు బదిలీ."
                docs = ["ఆధార్ కార్డు", "భూమి పత్రాలు", "బ్యాంక్ పాస్‌బుక్"]
            elif lang == "hi":
                benefit = "₹6,000 / वर्ष"
                desc = "तीन समान किश्तों में प्रत्यक्ष लाभ सहायता।"
                docs = ["आधार कार्ड", "भूमि दस्तावेज", "बैंक पासबुक"]
        elif "PM-KUSUM" in name:
            if lang == "te":
                benefit = "60% సబ్సిడీ (₹24,500 విలువ)"
                desc = "సౌర విద్యుత్ నీటి పంపులను అమర్చడానికి ఆర్థిక సహాయం."
                docs = ["భూమి పత్రాలు", "ఆధార్ కార్డు", "రైతు ధృవీకరణ పత్రం"]
            elif lang == "hi":
                benefit = "60% सब्सिडी (₹24,500 मूल्य)"
                desc = "सौर जल पंप स्थापित करने के लिए वित्तीय सहायता।"
                docs = ["भूमि दस्तावेज", "आधार कार्ड", "किसान पहचान पत्र"]
                
        translated.append({
            "id": s.id,
            "name": name,
            "benefit": benefit,
            "eligibility_score": s.eligibility_score,
            "deadline": s.deadline,
            "approval_time": s.approval_time,
            "priority": s.priority,
            "description": desc,
            "required_documents": docs
        })
    return translated

@router.get("/match", response_model=List[GovernmentSchemeResponse])
async def get_matched_schemes(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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
        
    accept_language = request.headers.get("Accept-Language", "en")
    lang = accept_language.split(",")[0].strip()[:2]
    return translate_schemes(schemes, lang)

@router.post("/apply", response_model=SchemeApplicationResponse)
def submit_scheme_claim(
    payload: SchemeApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = SchemeRepository.create_application(db, payload.scheme_id, current_user.id, payload.submitted_documents)
    return app
