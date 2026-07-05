from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class DailyTaskCreate(BaseModel):
    text: str

class DailyTaskResponse(BaseModel):
    id: UUID
    user_id: UUID
    text: str
    is_done: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    category: str
    title: str
    message: str
    is_read: bool
    date: str
    action_label: Optional[str]
    action_href: Optional[str]

    class Config:
        from_attributes = True
