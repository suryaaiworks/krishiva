import os
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Global firestore client placeholder
db = None
_initialization_attempted = False

def init_firestore():
    global db, _initialization_attempted
    if _initialization_attempted:
        return db
        
    _initialization_attempted = True
    try:
        # Check if already initialized
        if firebase_admin._apps:
            db = firestore.client()
            logger.info("Firebase Admin already initialized. Firestore client linked.")
            return db
            
        cred_path = settings.FIREBASE_CREDENTIALS_PATH
        
        if os.path.exists(cred_path):
            logger.info(f"Loading Firebase credentials from: {cred_path}")
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'projectId': settings.FIREBASE_PROJECT_ID
            })
        elif os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
            logger.info("Firebase credential file not found, but GOOGLE_APPLICATION_CREDENTIALS is set. Attempting ADC.")
            try:
                firebase_admin.initialize_app(options={
                    'projectId': settings.FIREBASE_PROJECT_ID
                })
            except Exception as e:
                logger.error(f"Failed to initialize Firebase app with ADC: {e}. Running in Mock Database Mode.")
                db = None
                return None
        else:
            logger.warning(
                f"Firebase credential file not found at {cred_path} and GOOGLE_APPLICATION_CREDENTIALS is not set. "
                "Skipping slow ADC metadata check to boot instantly. Running in Mock Database Mode."
            )
            db = None
            return None
                
        db = firestore.client()
        logger.info("Successfully connected to Google Cloud Firestore.")
        return db
    except Exception as e:
        logger.error(f"Firestore Connection failed: {e}. Server running in Mock Database Mode.")
        db = None
        return None

def get_db():
    global db
    if db is None and not _initialization_attempted:
        init_firestore()
    return db
