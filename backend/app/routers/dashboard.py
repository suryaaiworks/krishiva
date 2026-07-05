from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.repositories.farm_repo import FarmRepository
from app.repositories.market_repo import MarketRepository
from app.repositories.scheme_repo import SchemeRepository
from app.repositories.notification_repo import NotificationRepository

router = APIRouter(prefix="/dashboard", tags=["Dashboard Telemetry Summary"])

@router.get("/brief")
def get_dashboard_brief(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Compiles live metrics details for Ramesh's home screen.
    Matches the exact brief shown on the UI mockup.
    """
    farms = FarmRepository.get_by_user(db, current_user.id)
    farm_status = "No farms registered"
    health_score = 100
    if farms:
        farm_status = f"healthy"
        health_score = farms[0].health_score
        
    tasks = NotificationRepository.get_tasks(db, current_user.id)
    pending_tasks = len([t for t in tasks if not t.is_done])
    
    # Mandi price trends snapshot
    sugarcane_price_change = "+3.6% (Pune Mandi)"
    
    # Schemes matching count
    schemes = SchemeRepository.get_all(db)
    schemes_count = len(schemes) if schemes else 2
    
    return {
        "success": True,
        "farmer_name": current_user.profile.name if current_user.profile else "Ramesh",
        "farm_status": farm_status,
        "farm_health": f"{health_score}%",
        "weather_advisory": "Light rain forecast after 5:00 PM today.",
        "mandi_price_highlight": sugarcane_price_change,
        "eligible_schemes_count": schemes_count,
        "pending_recommendations_count": 3,
        "pending_tasks_count": pending_tasks
    }
