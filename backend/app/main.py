import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from app.config.settings import settings
from app.database.connection import engine, Base
import os

# Import all SQLAlchemy models to register them in Base.metadata
import app.models.user
import app.models.farm
import app.models.crop
import app.models.market
import app.models.machinery
import app.models.scheme
import app.models.office
import app.models.task
import app.models.conversation
import app.models.weather

# Setup Logging
from app.utils.logger import api_logger, error_logger

# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered Agricultural platform B2B APIs for Krishiva.",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None
)

# CORS configurations
cors_kwargs = {
    "allow_origins": settings.cors_origins,
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}
if getattr(settings, "CORS_ORIGIN_REGEX", None):
    cors_kwargs["allow_origin_regex"] = settings.CORS_ORIGIN_REGEX

app.add_middleware(CORSMiddleware, **cors_kwargs)

# Mount local mock uploads directory if static fallback is required
STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "static_uploads"))
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static_uploads", StaticFiles(directory=STATIC_DIR), name="static_uploads")

# Global Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_logger.error(f"Global server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error occurred.",
            "detail": str(exc) if settings.DEBUG else "Please contact administrator."
        }
    )

# Startup Lifecycle
@app.on_event("startup")
async def startup_event():
    api_logger.info("Starting up Krishiva AI Backend Server...")
    
    # Verify database connection and auto-create SQLAlchemy schemas on Supabase if they do not exist
    if engine is not None:
        try:
            with engine.connect() as conn:
                from sqlalchemy import text
                conn.execute(text("SELECT 1"))
            api_logger.info("Successfully verified connection to Supabase PostgreSQL database.")
            
            Base.metadata.create_all(bind=engine)
            api_logger.info("Successfully synced/created database tables on Supabase Postgres.")
            
            # Check and add missing columns if they do not exist
            with engine.connect() as conn:
                for col_name, col_type in [
                    ("voice_language", "VARCHAR"),
                    ("speech_speed", "FLOAT"),
                    ("voice_name", "VARCHAR"),
                    ("translator_enabled", "BOOLEAN")
                ]:
                    try:
                        conn.execute(text(f"ALTER TABLE settings ADD COLUMN {col_name} {col_type}"))
                        api_logger.info(f"Added column {col_name} to settings table.")
                    except Exception:
                        pass
                
                for col_name, col_type in [
                    ("booking_date", "VARCHAR"),
                    ("booking_time", "VARCHAR")
                ]:
                    try:
                        conn.execute(text(f"ALTER TABLE machinery_bookings ADD COLUMN {col_name} {col_type}"))
                        api_logger.info(f"Added column {col_name} to machinery_bookings table.")
                    except Exception:
                        pass
        except Exception as e:
            error_logger.error(f"Database connection or table sync failed on startup: {e}")
    else:
        error_logger.warning("Database engine not configured. Skipping schema creation.")

from fastapi.exceptions import HTTPException

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    accept_language = request.headers.get("Accept-Language", "en")
    lang = accept_language.split(",")[0].strip()[:2]
    
    detail = exc.detail
    # Translate detail if not English using Gemini/TranslationService
    if lang in ["hi", "te"] and detail:
        try:
            from app.services.translation_service import TranslationService
            detail = await TranslationService.translate_to_language(detail, lang)
        except Exception as err:
            error_logger.error(f"Failed to translate error detail: {err}")
            # Use dictionary translation lookup for common error phrases if Gemini failed
            common_translations = {
                "User not found": {"te": "వినియోగదారు కనుగొనబడలేదు", "hi": "उपयोगकर्ता नहीं मिला"},
                "Incorrect phone or password": {"te": "తప్పు ఫోన్ లేదా పాస్‌వర్డ్", "hi": "गलत फोन या पासवर्ड"},
                "Database error occurred": {"te": "డేటాబేస్ లోపం జరిగింది", "hi": "डेटाबेस त्रुटि हुई"},
            }
            if detail in common_translations:
                detail = common_translations[detail][lang]
            
    return JSONResponse(
        status_code=exc.status_code,
        headers=exc.headers,
        content={"success": False, "detail": detail}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_logger.error(f"Unhandled system error: {exc}", exc_info=True)
    
    accept_language = request.headers.get("Accept-Language", "en")
    lang = accept_language.split(",")[0].strip()[:2]
    
    # Standard farmer-friendly messages
    if lang == "te":
        msg = "క్షమించండి, సర్వర్‌లో ఏదో సమస్య ఉన్నట్లుంది. దయచేసి కాసేపటి తర్వాత మళ్లీ ప్రయత్నించండి."
    elif lang == "hi":
        msg = "क्षमा करें, सर्वर में कोई समस्या आ रही है। कृपया कुछ समय बाद पुनः प्रयास करें।"
    else:
        msg = "We are experiencing a temporary server glitch. Please check back in a few minutes."
        
    return JSONResponse(
        status_code=500,
        content={"success": False, "detail": msg}
    )

# Root endpoint
@app.get("/")
def read_root():
    commit_hash = "unknown"
    try:
        import subprocess
        commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode("utf-8").strip()
    except Exception:
        commit_hash = os.environ.get("RENDER_GIT_COMMIT", "unknown")
        
    return {
        "success": True,
        "message": f"Welcome to {settings.APP_NAME} APIs",
        "docs": "/docs" if settings.DEBUG else "disabled",
        "commit_hash": commit_hash
    }

# Register Routers
from app.routers import (
    auth, profile, crops, disease, market,
    machinery, schemes, offices, notifications,
    tasks, settings as app_settings, assistant,
    dashboard, weather
)
from app.api.base import router as base_router

app.include_router(base_router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")
app.include_router(crops.router, prefix="/api/v1")
app.include_router(disease.router, prefix="/api/v1")
app.include_router(market.router, prefix="/api/v1")
app.include_router(machinery.router, prefix="/api/v1")
app.include_router(schemes.router, prefix="/api/v1")
app.include_router(offices.router, prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(app_settings.router, prefix="/api/v1")
app.include_router(assistant.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(weather.router, prefix="/api/v1")
