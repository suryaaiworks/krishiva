from sqlalchemy import Column, String, Integer, Double, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.connection import Base
import datetime
import uuid

class MarketPrice(Base):
    __tablename__ = "market_prices"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    crop_name = Column(String, unique=True, nullable=False)
    current_price = Column(Integer, nullable=False)
    yesterday_price = Column(Integer, nullable=False)
    weekly_change = Column(String, nullable=False)
    monthly_change = Column(String, nullable=False)
    trend = Column(String, nullable=False)
    demand = Column(String, nullable=False)
    supply = Column(String, nullable=False)
    confidence = Column(String, nullable=False)
    next_week_price = Column(Integer, nullable=False)
    next_month_price = Column(Integer, nullable=False)
    reasoning = Column(String, nullable=False)
    decision = Column(String, nullable=False)
    decision_reason = Column(String, nullable=False)
    expected_diff = Column(String, nullable=False)
    risk = Column(String, nullable=False)
    buyers = Column(JSON, default=list, nullable=False)
    mandis = Column(JSON, default=list, nullable=False)
    insights = Column(JSON, default=dict, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

class BuyerRequest(Base):
    __tablename__ = "buyer_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    company_name = Column(String, nullable=False)
    crop_required = Column(String, nullable=False)
    quantity_required = Column(String, nullable=False)
    offered_price = Column(Integer, nullable=False)
    unit = Column(String, nullable=False)
    distance = Column(String, nullable=False)
    distance_val = Column(Double, nullable=False)
    pickup_available = Column(Boolean, default=True, nullable=False)
    payment_method = Column(String, nullable=False)
    expected_payment_time = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    certification = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

class Marketplace(Base):
    __tablename__ = "marketplace"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    buyer_request_id = Column(UUID(as_uuid=True), ForeignKey("buyer_requests.id", ondelete="CASCADE"), nullable=False)
    offered_price = Column(Integer, nullable=False)
    counter_price = Column(Integer, nullable=False)
    status = Column(String, default="idle")
    compromise_offer = Column(Integer, nullable=True)
    message = Column(String, nullable=True)
    vehicle = Column(String, nullable=True)
    pickup_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="b2b_bids")
    buyer_request = relationship("BuyerRequest")
