import os
import logging
from logging.handlers import RotatingFileHandler

# Define absolute paths for log files
LOG_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "logs"))
os.makedirs(LOG_DIR, exist_ok=True)

API_LOG_PATH = os.path.join(LOG_DIR, "api.log")
AI_LOG_PATH = os.path.join(LOG_DIR, "ai.log")
ERROR_LOG_PATH = os.path.join(LOG_DIR, "error.log")
AUDIT_LOG_PATH = os.path.join(LOG_DIR, "audit.log")

# Create empty log files if they do not exist
for path in [API_LOG_PATH, AI_LOG_PATH, ERROR_LOG_PATH, AUDIT_LOG_PATH]:
    if not os.path.exists(path):
        with open(path, "a") as f:
            pass

# Log format definition
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"

def setup_logger(name: str, log_file: str, level=logging.INFO) -> logging.Logger:
    """Configures a custom logger that outputs to console and a rotating log file."""
    formatter = logging.Formatter(LOG_FORMAT)
    
    # Rotating file handler (10MB limit per file, keeping 5 backups)
    file_handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5)
    file_handler.setFormatter(formatter)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    # Avoid duplicate logging if parents are configured
    logger.propagate = False
    
    return logger

# Initialize standard loggers
api_logger = setup_logger("api_logger", API_LOG_PATH)
ai_logger = setup_logger("ai_logger", AI_LOG_PATH)
error_logger = setup_logger("error_logger", ERROR_LOG_PATH, level=logging.ERROR)
audit_logger = setup_logger("audit_logger", AUDIT_LOG_PATH)
