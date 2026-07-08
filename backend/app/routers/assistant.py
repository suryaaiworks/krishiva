from fastapi import APIRouter, Depends, Body, Header, Request
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.conversation import ChatHistoryResponse, ChatMessage
from app.controllers.assistant_controller import AssistantController
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

router = APIRouter(prefix="/assistant", tags=["Vira AI Assistant Desk"])

class AskRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, Any]]] = None
    farmer: Optional[Dict[str, Any]] = None
    geminiApiKey: Optional[str] = None

async def get_optional_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Optional[User]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    
    if "mock_token" in token:
        try:
            from app.middleware.auth_middleware import get_current_user
            from fastapi.security import HTTPAuthorizationCredentials
            creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
            return get_current_user(credentials=creds, db=db)
        except Exception:
            pass
            
    try:
        from app.middleware.auth_middleware import decode_token
        payload = decode_token(token)
        if payload:
            from app.repositories.user_repo import UserRepository
            import uuid
            user_uuid = uuid.UUID(payload.get("sub"))
            return UserRepository.get_by_id(db, user_uuid)
    except Exception:
        pass
    return None

@router.get("/chat", response_model=List[ChatMessage])
def get_chat_history(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accept_language = request.headers.get("Accept-Language", "en")
    lang = accept_language.split(",")[0].strip()[:2]
    return AssistantController.get_history(db, current_user.id, lang=lang)

@router.post("/chat", response_model=ChatMessage)
async def chat_with_vira(
    message: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = await AssistantController.chat_with_vira(db, current_user.id, message)
    return res

@router.get("/config/{user_id}")
def get_assistant_config(
    user_id: str,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    # If authenticated, use the authenticated user's ID
    active_id = optional_user.id if optional_user else (None if user_id == "demo" else user_id)
    return AssistantController.get_config(db, active_id)

@router.post("/ask")
async def ask_assistant(
    payload: AskRequest,
    optional_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    # Use authenticated user ID if present, otherwise fallback to farmer ID passed in request
    active_id = optional_user.id if optional_user else None
    if not active_id and payload.farmer:
        active_id = payload.farmer.get("id")
        if active_id == "demo":
            active_id = None
            
    return await AssistantController.ask_assistant(db, active_id, payload)
