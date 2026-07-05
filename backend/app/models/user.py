from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base
import datetime
import uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="Farmer")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    # Relationships
    profile = relationship("FarmerProfile", uselist=False, back_populates="user")
    settings = relationship("Settings", uselist=False, back_populates="user")
    farms = relationship("Farm", back_populates="owner")
    b2b_bids = relationship("Marketplace", back_populates="user")
    machinery_bookings = relationship("MachineryBooking", back_populates="user")
    scheme_applications = relationship("SchemeApplication", back_populates="user")
    office_bookings = relationship("OfficeBooking", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    tasks = relationship("DailyTask", back_populates="user")
    ai_recommendations = relationship("AIRecommendation", back_populates="user")
    conversation_history = relationship("ConversationHistory", back_populates="user")
    voice_sessions = relationship("VoiceSession", back_populates="user")
    uploaded_images = relationship("UploadedImage", back_populates="user")
    uploaded_documents = relationship("UploadedDocument", back_populates="user")
    activity_logs = relationship("ActivityLog", back_populates="user")

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"
    
    id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    name = Column(String, nullable=False)
    experience_years = Column(Integer, default=0)
    verified_id = Column(String, nullable=True)
    bank_account = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    certification_status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="profile")

class Settings(Base):
    __tablename__ = "settings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    language = Column(String, default="en")
    theme = Column(String, default="system")
    font_size = Column(String, default="medium")
    voice_enabled = Column(Boolean, default=True)
    offline_mode = Column(Boolean, default=False)
    biometrics_enabled = Column(Boolean, default=False)
    pin_lock_enabled = Column(Boolean, default=False)
    notifications_config = Column(JSON, default=dict, nullable=False)
    voice_language = Column(String, default="en")
    speech_speed = Column(Float, default=1.0)
    voice_name = Column(String, nullable=True)
    translator_enabled = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="settings")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    action = Column(String, nullable=False)
    details = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="activity_logs")
