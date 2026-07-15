from sqlalchemy import Column, String, ForeignKey, DateTime, UUID
from sqlalchemy.orm import relationship
from app.database.connection import Base
import datetime
import uuid

class Machinery(Base):
    __tablename__ = "machinery"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    price_rate = Column(String, nullable=False)
    distance = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    status = Column(String, default="available")
    rating = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

class MachineryBooking(Base):
    __tablename__ = "machinery_bookings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machinery_id = Column(UUID(as_uuid=True), ForeignKey("machinery.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="booked")
    booked_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    booking_date = Column(String, nullable=True)
    booking_time = Column(String, nullable=True)
    
    user = relationship("User", back_populates="machinery_bookings")
    machinery = relationship("Machinery")
