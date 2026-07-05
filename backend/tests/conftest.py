import pytest
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.main import app
from app.database.connection import Base, get_db
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Choose database engine based on .env config and server availability
is_placeholder = "your-project-ref" in settings.DATABASE_URL or "your-password" in settings.DATABASE_URL

TEST_DATABASE_URL = "sqlite:///./test_krishiva.db"
if not is_placeholder:
    pg_url = settings.DATABASE_URL
    if "pgbouncer=" in pg_url:
        if "?" in pg_url:
            base_url, query = pg_url.split("?", 1)
            params = [p for p in query.split("&") if not p.startswith("pgbouncer=")]
            pg_url = base_url + ("?" + "&".join(params) if params else "")
            
    # Try a quick connection test
    try:
        from sqlalchemy import text
        temp_engine = create_engine(pg_url, connect_args={"connect_timeout": 2})
        with temp_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        TEST_DATABASE_URL = pg_url
        logger.info("Successfully connected to Supabase Postgres. Running integration tests.")
    except Exception as e:
        logger.warning(f"Could not connect to Supabase Postgres ({e}). Falling back to SQLite for unit testing.")

@pytest.fixture(scope="session")
def db_engine():
    # Setup SQLite configuration or real Postgres engine
    if "sqlite" in TEST_DATABASE_URL:
        engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(TEST_DATABASE_URL)
        
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    
    # Cleanup local sqlite file if created
    if "sqlite" in TEST_DATABASE_URL and os.path.exists("./test_krishiva.db"):
        try:
            os.remove("./test_krishiva.db")
        except Exception:
            pass

@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    SessionLocal = sessionmaker(bind=connection, autoflush=False, autocommit=False)
    session = SessionLocal()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
