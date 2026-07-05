from sqlalchemy.orm import Session
from app.models.market import MarketPrice, BuyerRequest, Marketplace
from uuid import UUID
from typing import Optional, List

class MarketRepository:
    @staticmethod
    def get_prices(db: Session) -> List[MarketPrice]:
        return db.query(MarketPrice).all()

    @staticmethod
    def get_price_by_crop(db: Session, crop_name: str) -> Optional[MarketPrice]:
        return db.query(MarketPrice).filter(MarketPrice.crop_name.ilike(crop_name)).first()

    @staticmethod
    def create_or_update_price(db: Session, price_data: dict) -> MarketPrice:
        crop_name = price_data.get("crop_name")
        mp = db.query(MarketPrice).filter(MarketPrice.crop_name.ilike(crop_name)).first()
        if not mp:
            mp = MarketPrice(**price_data)
            db.add(mp)
        else:
            for k, v in price_data.items():
                setattr(mp, k, v)
        db.commit()
        db.refresh(mp)
        return mp

    @staticmethod
    def get_buyer_requests(db: Session) -> List[BuyerRequest]:
        return db.query(BuyerRequest).all()

    @staticmethod
    def get_buyer_request_by_id(db: Session, req_id: UUID) -> Optional[BuyerRequest]:
        return db.query(BuyerRequest).filter(BuyerRequest.id == req_id).first()

    @staticmethod
    def create_buyer_request(db: Session, req_data: dict) -> BuyerRequest:
        br = BuyerRequest(**req_data)
        db.add(br)
        db.commit()
        db.refresh(br)
        return br

    @staticmethod
    def get_negotiations_by_user(db: Session, user_id: UUID) -> List[Marketplace]:
        return db.query(Marketplace).filter(Marketplace.user_id == user_id).all()

    @staticmethod
    def get_negotiation_by_id(db: Session, neg_id: Any) -> Optional[Marketplace]:
        import uuid
        if isinstance(neg_id, str):
            try:
                neg_id = uuid.UUID(neg_id)
            except ValueError:
                return None
        return db.query(Marketplace).filter(Marketplace.id == neg_id).first()

    @staticmethod
    def create_negotiation(db: Session, user_id: UUID, buyer_request_id: UUID, offered_price: int, counter_price: int, status: str = "idle", compromise_offer: int = None, message: str = None) -> Marketplace:
        neg = Marketplace(
            user_id=user_id,
            buyer_request_id=buyer_request_id,
            offered_price=offered_price,
            counter_price=counter_price,
            status=status,
            compromise_offer=compromise_offer,
            message=message
        )
        db.add(neg)
        db.commit()
        db.refresh(neg)
        return neg

    @staticmethod
    def update_negotiation_shipment(db: Session, neg_id: UUID, vehicle: str, pickup_date: str) -> Optional[Marketplace]:
        neg = MarketRepository.get_negotiation_by_id(db, neg_id)
        if neg:
            neg.vehicle = vehicle
            neg.pickup_date = pickup_date
            db.commit()
            db.refresh(neg)
        return neg
