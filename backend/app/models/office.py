from sqlalchemy import Column, String, ForeignKey, DateTime, Double, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base
import datetime
import uuid

class SupportOffice(Base):
    __tablename__ = "support_offices"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    district = Column(String, nullable=False)
    block = Column(String, nullable=False)
    address = Column(String, nullable=False)
    distance = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    rating = Column(Double, nullable=False)
    status = Column(String, nullable=False)
    hours = Column(String, nullable=False)
    officer = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    coords = Column(JSON, default=dict, nullable=False)
    directions = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

class OfficeBooking(Base):
    __tablename__ = "office_bookings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    office_id = Column(UUID(as_uuid=True), ForeignKey("support_offices.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    purpose = Column(String, nullable=False)
    date = Column(String, nullable=False)
    slot = Column(String, nullable=False)
    token_number = Column(String, nullable=False)
    status = Column(String, default="confirmed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="office_bookings")
    office = relationship("SupportOffice")
