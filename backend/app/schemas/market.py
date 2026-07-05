from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class MarketPriceResponse(BaseModel):
    id: Optional[UUID] = None
    cropName: str
    price: str
    yesterday: str
    weeklyChange: str
    monthlyChange: str
    trend: str
    demand: str
    supply: str
    confidence: str
    nextWeek: str
    nextMonth: str
    reasoning: str
    decision: str
    decisionReason: str
    expectedDiff: str
    risk: str
    buyers: List[Dict[str, Any]]
    mandis: List[Dict[str, Any]]
    insights: Dict[str, Any]

    class Config:
        from_attributes = True

class BuyerRequestResponse(BaseModel):
    id: UUID
    companyName: str
    cropRequired: str
    quantityRequired: str
    offeredPrice: int
    unit: str
    distance: str
    pickupAvailable: bool
    paymentMethod: str
    expectedPaymentTime: str
    category: str
    location: str
    certification: str

    class Config:
        from_attributes = True

class NegotiationCreate(BaseModel):
    buyer_request_id: UUID
    offered_price: int
    counter_price: int
    message: Optional[str] = None

class ShipmentPlanUpdate(BaseModel):
    negotiation_id: UUID
    vehicle: str
    pickup_date: str

class NegotiationResponse(BaseModel):
    id: UUID
    user_id: UUID
    buyer_request_id: UUID
    offered_price: int
    counter_price: int
    status: str
    compromise_offer: Optional[int]
    message: Optional[str]
    vehicle: Optional[str]
    pickup_date: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
