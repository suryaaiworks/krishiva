from sqlalchemy import Column, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base
import datetime
import uuid

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    benefit = Column(String, nullable=False)
    eligibility_score = Column(String, nullable=False)
    deadline = Column(String, nullable=False)
    approval_time = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    description = Column(String, nullable=False)
    required_documents = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

class SchemeApplication(Base):
    __tablename__ = "scheme_applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scheme_id = Column(UUID(as_uuid=True), ForeignKey("government_schemes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="Pending")
    submitted_documents = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="scheme_applications")
    scheme = relationship("GovernmentScheme")
