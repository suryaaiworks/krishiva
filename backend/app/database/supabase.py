from supabase import create_client, Client
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

supabase_client: Client = None

try:
    supabase_key = settings.SUPABASE_SECRET_KEY or settings.SUPABASE_KEY
    if settings.SUPABASE_URL and supabase_key:
        supabase_client = create_client(settings.SUPABASE_URL, supabase_key)
        logger.info("Supabase client initialized successfully.")
    else:
        logger.warning("SUPABASE_URL or SUPABASE_SECRET_KEY missing. Supabase Client running in disabled/mock state.")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {e}")

def get_supabase() -> Client:
    """Dependency helper to retrieve the Supabase client instance."""
    return supabase_client
