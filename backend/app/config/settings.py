from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Kisan Alert AI Backend"
    APP_ENV: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # CORS Origins (Comma separated strings converted to list)
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Firebase settings
    FIREBASE_PROJECT_ID: str = "kisan-alert-ai-dev"
    FIREBASE_CREDENTIALS_PATH: str = "config/firebase-credentials.json"
    
    # API Keys
    GEMINI_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
