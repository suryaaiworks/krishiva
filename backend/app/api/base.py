from fastapi import APIRouter
from app.database.firestore import get_db

router = APIRouter(prefix="/base", tags=["Base Operations"])

@router.get("/health")
def health_check():
    # Check database status
    db_connected = False
    try:
        db = get_db()
        if db is not None:
            db_connected = True
    except Exception:
        db_connected = False

    return {
        "success": True,
        "status": "healthy",
        "database": "connected" if db_connected else "mock_mode",
        "service": "kisan-alert-ai-backend"
    }

@router.get("/version")
def get_version():
    return {
        "success": True,
        "version": "1.0.0",
        "api_release": "v1-stable",
        "hackathon_phase": "Phase 17 - Backend Foundation"
    }

@router.get("/status")
def get_status():
    return {
        "success": True,
        "uptime": "operational",
        "components": {
            "api_server": "running",
            "langgraph_agents": "skeleton_placeholder",
            "firebase_auth": "configured_no_endpoints"
        }
    }
