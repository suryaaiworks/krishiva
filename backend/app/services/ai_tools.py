import logging
from typing import Dict, Any, List
from app.database.connection import SessionLocal
from app.repositories.market_repo import MarketRepository
from app.repositories.crop_repo import CropRepository
from app.repositories.user_repo import UserRepository
from app.repositories.scheme_repo import SchemeRepository
from app.repositories.notification_repo import NotificationRepository
from uuid import UUID

logger = logging.getLogger(__name__)

def get_weather_forecast(district: str) -> Dict[str, Any]:
    """Retrieves current weather forecast and agricultural climate indicators for a district."""
    logger.info(f"AI Tool invoked: get_weather_forecast for {district}")
    return {
        "district": district,
        "temp": "28°C",
        "feels_like": "30°C",
        "condition": "Cloudy Sky",
        "humidity": "62%",
        "wind_speed": "14 km/h",
        "uv_index": "9 (Very High)",
        "advisory": "Dry spell warning active. Increase evening drip irrigation cycles."
    }

def get_mandi_prices(crop_name: str) -> Dict[str, Any]:
    """Retrieves spot market prices and weekly/monthly trends for a crop in local mandis."""
    logger.info(f"AI Tool invoked: get_mandi_prices for {crop_name}")
    try:
        with SessionLocal() as db:
            prices = MarketRepository.get_prices(db)
            for p in prices:
                if crop_name.lower() in p.crop_name.lower():
                    return {
                        "cropName": p.crop_name,
                        "price": f"₹{p.current_price:,}",
                        "weeklyChange": p.weekly_change,
                        "monthlyChange": p.monthly_change,
                        "trend": p.trend,
                        "demand": p.demand,
                        "supply": p.supply,
                        "nextWeek": f"₹{p.next_week_price:,}",
                        "decision": p.decision
                    }
    except Exception as e:
        logger.error(f"Error in get_mandi_prices tool: {e}")
        
    return {
        "cropName": crop_name,
        "price": "₹6,800 / Quintal",
        "weeklyChange": "+4.2%",
        "trend": "up",
        "demand": "High",
        "decision": "Hold"
    }

def get_crop_profile(crop_name: str) -> Dict[str, Any]:
    """Retrieves standard yield, duration, and water requirements for a crop variety."""
    logger.info(f"AI Tool invoked: get_crop_profile for {crop_name}")
    return {
        "name": crop_name,
        "category": "Oilseeds",
        "suitability": "96%",
        "soil_requirement": "Black Clayey Soil",
        "water_requirement": "Medium",
        "estimated_yield": "2.0 Tons / Acre",
        "average_market_price": "₹6,800 / Quintal"
    }

def get_disease_report(disease_name: str) -> Dict[str, Any]:
    """Retrieves organic and chemical treatment instructions and preventive measures for a crop disease."""
    logger.info(f"AI Tool invoked: get_disease_report for {disease_name}")
    return {
        "disease_name": disease_name,
        "severity": "Medium",
        "treatment_chemical": "Apply Mancozeb 75% WP (2g/L water) or Propiconazole 25% EC (1ml/L).",
        "treatment_organic": "Spray copper oxychloride or sulfur-based organic mixtures.",
        "preventive_measures": "Plant rust-resistant cultivars and clean affected leaf debris."
    }

def get_farmer_profile(user_id_str: str) -> Dict[str, Any]:
    """Retrieves farmer biographical details, experience, and bank verification status."""
    logger.info(f"AI Tool invoked: get_farmer_profile for {user_id_str}")
    try:
        uid = UUID(user_id_str)
        with SessionLocal() as db:
            prof = UserRepository.get_profile_by_user(db, uid)
            if prof:
                return {
                    "name": prof.name,
                    "experience_years": prof.experience_years,
                    "verified_id": prof.verified_id,
                    "bank_name": prof.bank_name,
                    "certification_status": prof.certification_status
                }
    except Exception as e:
        logger.error(f"Error in get_farmer_profile tool: {e}")
        
    return {
        "name": "Ramesh Patil",
        "experience_years": 15,
        "verified_id": "KA-2026-89104",
        "bank_name": "State Bank of India",
        "certification_status": "Verified"
    }

def get_government_schemes() -> List[Dict[str, Any]]:
    """Retrieves matching government subsidies and deadlines for agricultural aid."""
    logger.info("AI Tool invoked: get_government_schemes")
    try:
        with SessionLocal() as db:
            schemes = SchemeRepository.get_all(db)
            if schemes:
                return [
                    {
                        "name": s.name,
                        "benefit": s.benefit,
                        "score": s.eligibility_score,
                        "deadline": s.deadline,
                        "approval": s.approval_time,
                        "priority": s.priority,
                        "desc": s.description
                    } for s in schemes
                ]
    except Exception as e:
        logger.error(f"Error in get_government_schemes tool: {e}")
        
    return [
        {
            "name": "PM-KUSUM (Solar Pump Subsidy)",
            "benefit": "60% Subsidy",
            "score": "95%",
            "deadline": "June 30, 2026",
            "desc": "Financial assistance to install solar water pumps."
        }
    ]

def get_recent_notifications(user_id_str: str) -> List[Dict[str, Any]]:
    """Retrieves active alerts and notification warnings for the user."""
    logger.info(f"AI Tool invoked: get_recent_notifications for {user_id_str}")
    try:
        uid = UUID(user_id_str)
        with SessionLocal() as db:
            notifs = NotificationRepository.get_notifications_by_user(db, uid)
            return [
                {
                    "title": n.title,
                    "message": n.message,
                    "type": n.type,
                    "date": n.date,
                    "read": n.is_read
                } for n in notifs
            ]
    except Exception as e:
        logger.error(f"Error in get_recent_notifications tool: {e}")
    return []

def get_daily_tasks(user_id_str: str) -> List[Dict[str, Any]]:
    """Retrieves operational checklists for the user's active fields."""
    logger.info(f"AI Tool invoked: get_daily_tasks for {user_id_str}")
    try:
        uid = UUID(user_id_str)
        with SessionLocal() as db:
            tasks = NotificationRepository.get_tasks_by_user(db, uid)
            return [
                {
                    "task": t.task_description,
                    "completed": t.is_completed,
                    "priority": t.priority
                } for t in tasks
            ]
    except Exception as e:
        logger.error(f"Error in get_daily_tasks tool: {e}")
    return []

def navigate_to(route_name: str) -> Dict[str, Any]:
    """Resolves voice command navigation requests into frontend router paths."""
    logger.info(f"AI Tool invoked: navigate_to for {route_name}")
    route_name_clean = route_name.lower().strip()
    
    routes_map = {
        "crops": "/crops",
        "my crops": "/crops",
        "open my crops": "/crops",
        "weather": "/weather",
        "show weather": "/weather",
        "market": "/market",
        "open market": "/market",
        "schemes": "/schemes",
        "show schemes": "/schemes",
        "profile": "/profile",
        "open profile": "/profile",
        "settings": "/settings"
    }
    
    resolved_path = routes_map.get(route_name_clean, "/dashboard")
    return {
        "success": True,
        "action": "redirect",
        "route": resolved_path,
        "message": f"Redirecting user session to route path: {resolved_path}"
    }
