from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Configure SQLAlchemy engine targeting Supabase PostgreSQL
from sqlalchemy import text

db_connected = False
engine = None
SessionLocal = None

db_url = settings.DATABASE_URL
if db_url and "pgbouncer=" in db_url:
    if "?" in db_url:
        base_url, query = db_url.split("?", 1)
        params = [p for p in query.split("&") if not p.startswith("pgbouncer=")]
        db_url = base_url + ("?" + "&".join(params) if params else "")
    else:
        db_url = db_url

if db_url and "your-project-ref" not in db_url:
    try:
        engine = create_engine(
            db_url,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 3}
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db_connected = True
        logger.info("SQLAlchemy engine successfully configured and verified for Supabase connection.")
    except Exception as e:
        logger.warning(f"Failed to connect to Supabase PostgreSQL: {e}. Falling back to SQLite.")
        db_connected = False

if not db_connected:
    logger.info("Initializing local SQLite database fallback: krishiva_fallback.db")
    engine = create_engine("sqlite:///./krishiva_fallback.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> Session:
    """Dependency for retrieving database session in controllers/routers."""
    if SessionLocal is None:
        raise Exception("Database session local maker is not configured.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
