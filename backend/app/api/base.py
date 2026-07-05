from fastapi import APIRouter, Depends
from app.database.connection import get_db, db_connected
from sqlalchemy.orm import Session
from sqlalchemy import text

router = APIRouter(prefix="/base", tags=["Base Operations"])

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    # Check database status
    db_active = False
    try:
        db.execute(text("SELECT 1"))
        db_active = True
    except Exception:
        db_active = False

    return {
        "success": True,
        "status": "healthy",
        "database": "connected" if (db_active and db_connected) else ("sqlite_fallback" if db_active else "error"),
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
