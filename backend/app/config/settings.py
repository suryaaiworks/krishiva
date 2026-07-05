from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Krishiva AI Backend"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8001
    HOST: str = "0.0.0.0"
    
    # CORS Origins (Comma separated strings converted to list)
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Supabase Settings
    SUPABASE_URL: str = "https://your-supabase-project-id.supabase.co"
    SUPABASE_KEY: str = "your-supabase-anon-key"
    SUPABASE_SECRET_KEY: str = ""
    SUPABASE_JWT_SECRET: str = "your-supabase-jwt-secret-placeholder-for-signing"
    
    # Direct PostgreSQL connection URL (e.g. Supabase Transaction Pooler)
    DATABASE_URL: str = "postgresql://postgres:postgres@127.0.0.1:5432/postgres"
    
    # Brevo Email Configuration
    BREVO_API_KEY: str = ""
    BREVO_SENDER_EMAIL: str = "noreply@krishiva.com"
    BREVO_SENDER_NAME: str = "Krishiva Team"
    
    # SMTP Settings (as automatic fallback)
    SMTP_HOST: str = "smtp-relay.brevo.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    
    # Google Maps & AI APIs
    GEMINI_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
