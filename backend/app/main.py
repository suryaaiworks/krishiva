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
        except Exception as e:
            error_logger.error(f"Database connection or table sync failed on startup: {e}")
    else:
        error_logger.warning("Database engine not configured. Skipping schema creation.")

# Root endpoint
@app.get("/")
def read_root():
    return {
        "success": True,
        "message": f"Welcome to {settings.APP_NAME} APIs",
        "docs": "/docs" if settings.DEBUG else "disabled"
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
