from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.middleware.auth_middleware import get_current_user
from app.models.user import User
from app.schemas.market import (
    MarketPriceResponse, BuyerRequestResponse,
    NegotiationCreate, NegotiationResponse, ShipmentPlanUpdate
)
from app.schemas.auth import StandardResponse
from app.controllers.market_controller import MarketController
from typing import List

router = APIRouter(prefix="/market", tags=["Market intelligence & B2B"])

@router.get("/prices", response_model=List[MarketPriceResponse])
def get_spot_prices(db: Session = Depends(get_db)):
    return MarketController.get_spot_prices(db)

@router.get("/buyers", response_model=List[BuyerRequestResponse])
def get_marketplace_buyers(db: Session = Depends(get_db)):
    return MarketController.get_marketplace_buyers(db)

@router.post("/negotiate", response_model=NegotiationResponse)
async def submit_negotiation(
    payload: NegotiationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = await MarketController.submit_negotiation(
        db,
        current_user.id,
        payload.buyer_request_id,
        payload.offered_price,
        payload.counter_price,
        payload.message
    )
    # Fetch completed record
    from app.repositories.market_repo import MarketRepository
    neg = MarketRepository.get_negotiation_by_id(db, res["negotiation_id"])
    return neg

@router.post("/shipment", response_model=StandardResponse)
def book_shipment(
    payload: ShipmentPlanUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = MarketController.book_shipment(db, payload.negotiation_id, payload.vehicle, payload.pickup_date)
    return StandardResponse(success=res["success"], message=res["message"])
