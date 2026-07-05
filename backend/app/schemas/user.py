from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from uuid import UUID

class FarmerProfileCreate(BaseModel):
    name: str
    experience_years: Optional[int] = 0
    verified_id: Optional[str] = None
    bank_account: Optional[str] = None
    bank_name: Optional[str] = None

class FarmerProfileResponse(BaseModel):
    id: UUID
    name: str
    experience_years: int
    verified_id: Optional[str]
    bank_account: Optional[str]
    bank_name: Optional[str]
    certification_status: str

    class Config:
        from_attributes = True

class SettingsUpdate(BaseModel):
    language: Optional[str] = None
    theme: Optional[str] = None
    font_size: Optional[str] = None
    voice_enabled: Optional[bool] = None
    offline_mode: Optional[bool] = None
    biometrics_enabled: Optional[bool] = None
    pin_lock_enabled: Optional[bool] = None
    notifications_config: Optional[Dict[str, bool]] = None

class SettingsResponse(BaseModel):
    language: str
    theme: str
    font_size: str
    voice_enabled: bool
    offline_mode: bool
    biometrics_enabled: bool
    pin_lock_enabled: bool
    notifications_config: Dict[str, Any]

    class Config:
        from_attributes = True

class ActivityLogResponse(BaseModel):
    id: UUID
    action: str
    details: Optional[str]
    created_at: Any

    class Config:
        from_attributes = True
