from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class GovernmentSchemeResponse(BaseModel):
    id: UUID
    name: str
    benefit: str
    eligibility_score: str
    deadline: str
    approval_time: str
    priority: str
    description: str
    required_documents: List[str]

    class Config:
        from_attributes = True

class SchemeApplicationCreate(BaseModel):
    scheme_id: UUID
    submitted_documents: List[Dict[str, Any]]

class SchemeApplicationResponse(BaseModel):
    id: UUID
    scheme_id: UUID
    user_id: UUID
    status: str
    submitted_documents: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True
