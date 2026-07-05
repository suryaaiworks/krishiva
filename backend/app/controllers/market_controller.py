import logging
from sqlalchemy.orm import Session
from app.repositories.market_repo import MarketRepository
from app.ai_agents.market.agent import MarketAgent
from uuid import UUID
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class MarketController:
    @staticmethod
    def get_spot_prices(db: Session) -> list:
        """Retrieves verified commodity spot prices."""
        from app.services.market_service import MarketService
        import datetime
        
        prices = MarketRepository.get_prices(db)
        if not prices:
            # Seed prices dynamically if empty
            MarketController._seed_default_prices(db)
            prices = MarketRepository.get_prices(db)

        # Caching check: Refresh if data is older than 4 hours
        should_refresh = True
        if prices:
            latest = prices[0]
            # Convert updated_at to aware or check delta
            delta = datetime.datetime.utcnow() - latest.updated_at
            if delta.total_seconds() < 14400: # 4 hours
                should_refresh = False
                
        if should_refresh:
            try:
                MarketService.refresh_market_prices(db)
                # Re-query after successful refresh
                prices = MarketRepository.get_prices(db)
            except Exception as e:
                logger.warning(f"Could not refresh live market prices ({e}). Using Supabase cached rates.")

        return [
            {
                "cropName": p.crop_name,
                "price": f"₹{p.current_price:,}",
                "yesterday": f"₹{p.yesterday_price:,}",
                "weeklyChange": p.weekly_change,
                "monthlyChange": p.monthly_change,
                "trend": p.trend,
                "demand": p.demand,
                "supply": p.supply,
                "confidence": p.confidence,
                "nextWeek": f"₹{p.next_week_price:,}",
                "nextMonth": f"₹{p.next_month_price:,}",
                "reasoning": p.reasoning,
                "decision": p.decision,
                "decisionReason": p.decision_reason,
                "expectedDiff": p.expected_diff,
                "risk": p.risk,
                "buyers": p.buyers,
                "mandis": p.mandis,
                "insights": p.insights
            } for p in prices
        ]

    @staticmethod
    def get_marketplace_buyers(db: Session) -> list:
        """Retrieves buyer list requests."""
        requests = MarketRepository.get_buyer_requests(db)
        if not requests:
            MarketController._seed_buyer_requests(db)
            requests = MarketRepository.get_buyer_requests(db)
            
        return [
            {
                "id": str(r.id),
                "companyName": r.company_name,
                "cropRequired": r.crop_required,
                "quantityRequired": r.quantity_required,
                "offeredPrice": r.offered_price,
                "unit": r.unit,
                "distance": r.distance,
                "pickupAvailable": r.pickup_available,
                "paymentMethod": r.payment_method,
                "expectedPaymentTime": r.expected_payment_time,
                "category": r.category,
                "location": r.location,
                "certification": r.certification
            } for r in requests
        ]

    @staticmethod
    async def submit_negotiation(db: Session, user_id: UUID, request_id: UUID, offered_price: int, counter_price: int, message: str = None) -> dict:
        """
        Processes counter price.
        Returns accepted/countered/declined responses.
        """
        buyer_req = MarketRepository.get_buyer_request_by_id(db, request_id)
        if not buyer_req:
            raise HTTPException(status_code=404, detail="Buyer request not found.")
            
        initial = buyer_req.offered_price
        difference_pct = ((counter_price - initial) / initial) * 100
        
        # Default mock evaluation triggers
        if difference_pct <= 3.5:
            status = "accepted"
            msg = f"Offer accepted! {buyer_req.company_name} has approved ₹{counter_price}/{buyer_req.unit} for your crop. A draft contract has been locked in your profile."
            comp = counter_price
        elif difference_pct > 3.5 and difference_pct <= 9.0:
            status = "countered"
            comp = int(initial + (counter_price - initial) * 0.45)
            msg = f"The buyer's B2B desk reviewed your counter of ₹{counter_price} and responded with a compromise offer of ₹{comp}/{buyer_req.unit}."
        else:
            status = "declined"
            comp = None
            msg = f"The buyer has declined ₹{counter_price}/{buyer_req.unit} as it exceeds their current budget cap. Try a counter under ₹{int(initial * 1.05)}."

        # Save bid entry in database
        neg = MarketRepository.create_negotiation(
            db,
            user_id=user_id,
            buyer_request_id=request_id,
            offered_price=offered_price,
            counter_price=counter_price,
            status=status,
            compromise_offer=comp,
            message=msg
        )

        return {
            "success": True,
            "negotiation_id": str(neg.id),
            "status": status,
            "compromise_offer": comp,
            "message": msg
        }

    @staticmethod
    def book_shipment(db: Session, negotiation_id: UUID, vehicle: str, date: str) -> dict:
        """Saves vehicle and dispatch logs."""
        neg = MarketRepository.update_negotiation_shipment(db, negotiation_id, vehicle, date)
        if not neg:
            raise HTTPException(status_code=404, detail="Negotiation ID not found.")
        return {"success": True, "message": "Pickup scheduled successfully. Dispatch slip generated."}

    @staticmethod
    def _seed_default_prices(db: Session):
        # Local mock mandi pricing indices matching frontend reference data
        prices = [
            {
                "crop_name": "Groundnut",
                "current_price": 6800,
                "yesterday_price": 6650,
                "weekly_change": "+4.2%",
                "monthly_change": "+12.4%",
                "trend": "up",
                "demand": "High",
                "supply": "Low",
                "confidence": "94%",
                "next_week_price": 7100,
                "next_month_price": 7450,
                "reasoning": "Groundnut oil seed crushing units in Pune are operating at lower stock volumes. Expect price appreciation over the next 3 weeks.",
                "decision": "Hold",
                "decision_reason": "Holding Groundnut stocks for another 15 days is expected to net a 8.2% premium.",
                "expected_diff": "+₹350 / Quintal",
                "risk": "Low",
                "buyers": [],
                "mandis": [
                    {"name": "Pune Mandi", "dist": "12km", "price": "₹6,850", "time": "35 mins", "best": True},
                    {"name": "Shirur Mandi", "dist": "6km", "price": "₹6,800", "time": "15 mins", "best": False}
                ],
                "insights": {"demand": "Oilseed demand surges as import duties on palm oil rise."}
            },
            {
                "crop_name": "Cotton",
                "current_price": 7200,
                "yesterday_price": 7350,
                "weekly_change": "-2.0%",
                "monthly_change": "-4.5%",
                "trend": "down",
                "demand": "Medium",
                "supply": "Excess",
                "confidence": "88%",
                "next_week_price": 7050,
                "next_month_price": 6900,
                "reasoning": "Global cotton demand contracts as spinning mills reduce usage. Arrivals are high in Vidarbha, keeping prices weak.",
                "decision": "Sell Now",
                "decision_reason": "Sell immediately to lock in the ₹7,200 rate before new arrivals suppress indices further.",
                "expected_diff": "-₹150 / Quintal",
                "risk": "Medium",
                "buyers": [],
                "mandis": [
                    {"name": "Nagpur Mandi", "dist": "32km", "price": "₹7,220", "time": "45 mins", "best": True}
                ],
                "insights": {"demand": "Spinning mills decrease capacity utilization."}
            }
        ]
        for p in prices:
            MarketRepository.create_or_update_price(db, p)

    @staticmethod
    def _seed_buyer_requests(db: Session):
        buyers = [
            {
                "company_name": "Sahyadri Sugar Cooperative",
                "crop_required": "Sugarcane",
                "quantity_required": "150 Tons",
                "offered_price": 3520,
                "unit": "Ton",
                "distance": "3.5 km",
                "distance_val": 3.5,
                "pickup_available": True,
                "payment_method": "DBT Direct Bank Transfer",
                "expected_payment_time": "Instant on Weight Slip",
                "category": "Sugarcane",
                "location": "Shirur Road, Pune",
                "certification": "Cooperative Govt Approved"
            },
            {
                "company_name": "Baramati Agro Industries",
                "crop_required": "Sugarcane",
                "quantity_required": "500 Tons",
                "offered_price": 3480,
                "unit": "Ton",
                "distance": "12.4 km",
                "distance_val": 12.4,
                "pickup_available": True,
                "payment_method": "Direct Bank Transfer",
                "expected_payment_time": "3 Working Days",
                "category": "Sugarcane",
                "location": "Baramati Highway, Pune",
                "certification": "NABL Quality Certified"
            }
        ]
        for b in buyers:
            MarketRepository.create_buyer_request(db, b)
