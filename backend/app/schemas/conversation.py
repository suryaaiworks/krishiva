from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from uuid import UUID
from datetime import datetime

class ChatMessage(BaseModel):
    id: str
    sender: str
    text: Optional[str] = None
    timestamp: str
    cardType: Optional[str] = None
    redirect: Optional[str] = None
    intent: Optional[str] = None
    confidence: Optional[float] = None
    reasoning: Optional[str] = None
    action: Optional[str] = None
    requires_confirmation: Optional[bool] = None
    speech: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class ChatHistoryResponse(BaseModel):
    id: UUID
    user_id: UUID
    messages: List[Dict[str, Any]]
    updated_at: datetime

    class Config:
        from_attributes = True

class VoiceSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    language: str
    audio_url: Optional[str]
    transcript: Optional[str]
    ai_response: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    id: UUID
    file_url: str
    file_path: str
    bucket_name: str
    file_type: str

    class Config:
        from_attributes = True
