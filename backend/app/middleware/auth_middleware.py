import jwt
import logging
import time
import httpx
from fastapi import Request, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.config.settings import settings
from app.database.connection import get_db
from app.repositories.user_repo import UserRepository
from app.models.user import User
from jwt import PyJWK

logger = logging.getLogger(__name__)

security_agent = HTTPBearer()

# JWKS cache to minimize API calls
JWKS_CACHE = {
    "keys": [],
    "expiry": 0
}

def get_jwks_keys() -> list:
    """Retrieves public JWK keys from the Supabase project auth endpoint."""
    now = time.time()
    if JWKS_CACHE["keys"] and JWKS_CACHE["expiry"] > now:
        return JWKS_CACHE["keys"]
        
    jwks_url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"
    try:
        r = httpx.get(jwks_url, timeout=5)
        if r.status_code == 200:
            keys = r.json().get("keys", [])
            JWKS_CACHE["keys"] = keys
            JWKS_CACHE["expiry"] = now + 600  # Cache for 10 minutes
            logger.info("Successfully fetched and cached Supabase JWKS keys.")
            return keys
    except Exception as e:
        logger.error(f"Failed to fetch JWKS keys from {jwks_url}: {e}")
        
    return JWKS_CACHE["keys"]

def get_signing_key(kid: str) -> dict:
    """Matches the key identifier (kid) header from incoming token against cached keys."""
    keys = get_jwks_keys()
    for key in keys:
        if key.get("kid") == kid:
            return key
    return None

def decode_token(token: str) -> dict:
    """Decodes JWT token and returns payload, supporting RS256/ES256 JWKS and HS256 fallbacks."""
    header = jwt.get_unverified_header(token)
    alg = header.get("alg", "HS256")
    kid = header.get("kid")
    
    if alg in ["RS256", "ES256"] and kid:
        key_data = get_signing_key(kid)
        if not key_data:
            raise jwt.InvalidTokenError(f"JWK public key with kid '{kid}' not found in project JWKS.")
        jwk = PyJWK(key_data)
        public_key = jwk.key
        return jwt.decode(
            token,
            public_key,
            algorithms=[alg],
            audience="authenticated"
        )
    else:
        jwt_secret = settings.SUPABASE_JWT_SECRET or settings.SUPABASE_SECRET_KEY or "your-supabase-jwt-secret-placeholder-for-signing"
        return jwt.decode(
            token,
            jwt_secret,
            algorithms=["HS256"],
            audience="authenticated"
        )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_agent),
    db: Session = Depends(get_db)
) -> User:
    """
    Decodes Supabase JWT token and extracts public.users record.
    Supports asymmetric JWKS keys (RS256/ES256) and legacy HS256 secrets.
    Injects the active User object as a dependency context.
    """
    token = credentials.credentials
    try:
        payload = decode_token(token)
        user_uuid = payload.get("sub")
        if not user_uuid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload is missing user ID (sub)."
            )
            
        import uuid
        try:
            user_uuid = uuid.UUID(user_uuid)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID format in token."
            )
            
        # Get user from local cache / database
        user = UserRepository.get_by_id(db, user_uuid)
        if not user:
            # Sync user dynamically if they authenticated through Supabase Auth
            email = payload.get("email", "")
            phone = payload.get("phone", None)
            role = payload.get("user_metadata", {}).get("role", "Farmer")
            user = UserRepository.create_user(db, user_uuid, email, phone, role)
            # Seed default profile
            name = email.split("@")[0].capitalize()
            UserRepository.create_or_update_profile(db, user_uuid, name)
            
        return user
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token signature has expired."
        )
    except jwt.InvalidTokenError as e:
        logger.error(f"JWT Verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid security token."
        )

def require_role(allowed_roles: list):
    """Factory helper to enforce endpoint access constraints by role."""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden. Authorized roles: {allowed_roles}"
            )
        return current_user
    return role_checker
