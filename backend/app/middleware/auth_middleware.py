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

security_agent = HTTPBearer(auto_error=False)

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
        jwt_secret = settings.SUPABASE_JWT_SECRET or settings.SUPABASE_SECRET_KEY or settings.SUPABASE_SERVICE_ROLE_KEY or ""
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
    Overridden for Hackathon Demo Mode:
    Bypasses Supabase JWT check and returns a mock user according to the parsed role.
    """
    import uuid
    role = "Farmer"
    user_id_str = "11111111-1111-1111-1111-111111111111"
    
    if credentials and credentials.credentials:
        token = credentials.credentials
        if "buyer" in token.lower():
            role = "Buyer"
            user_id_str = "22222222-2222-2222-2222-222222222222"
        elif "owner" in token.lower():
            role = "Owner"
            user_id_str = "33333333-3333-3333-3333-333333333333"

    mock_id = uuid.UUID(user_id_str)
    user = UserRepository.get_by_id(db, mock_id)
    if not user:
        user = UserRepository.create_user(
            db, 
            user_id=mock_id, 
            email=f"{role.lower().replace(' ', '_')}@krishiva.com", 
            phone="9876543210", 
            role=role
        )
        UserRepository.create_or_update_profile(db, mock_id, f"Demo {role}")
    return user

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
