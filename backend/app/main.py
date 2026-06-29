import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.database.firestore import init_firestore
from app.api.base import router as base_router

# Setup Logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered Agricultural platform B2B APIs.",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url=None
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global server error on {request.url.path}: {exc}", exc_info=True)
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
    logger.info("Starting up Kisan Alert AI Backend Server...")
    # Initialize Firestore database connection
    init_firestore()

# Root endpoints
@app.get("/")
def read_root():
    return {
        "success": True,
        "message": f"Welcome to {settings.APP_NAME} APIs",
        "docs": "/docs" if settings.DEBUG else "disabled"
    }

# Register Routers
app.include_router(base_router, prefix="/api/v1")
