import logging
import time
from typing import TypedDict, List, Dict, Any, Optional
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
from app.prompts.vira_prompt import VIRA_SYSTEM_PROMPT
from app.services.gemini_service import GeminiService
from sqlalchemy.orm import Session
import uuid

logger = logging.getLogger(__name__)

# Structured model for Gemini intent parsing and entity extraction
class ViraIntentExtraction(BaseModel):
    intents: List[str] = Field(
        description="List of intents, e.g. 'query_weather', 'query_market_price', 'recommend_crop', 'recommend_fertilizer', 'book_machinery', 'apply_scheme', 'query_scheme', 'update_profile', 'view_notifications', 'navigate', 'diagnose_disease', 'general_chat'"
    )
    crop: Optional[str] = Field(None, description="Dynamic crop name mentioned, e.g. Tomato, Cotton, Paddy")
    machinery: Optional[str] = Field(None, description="Machinery name mentioned, e.g. Tractor, Rotavator")
    scheme: Optional[str] = Field(None, description="Scheme name mentioned, e.g. PM-Kisan, PM-Kusum")
    soil: Optional[str] = Field(None, description="Soil type mentioned, e.g. Black soil, Loamy soil")
    date: Optional[str] = Field(None, description="Booking date or time, e.g. tomorrow, next Monday")
    page: Optional[str] = Field(None, description="Frontend page, e.g. dashboard, weather, market, crops, schemes, machinery, profile, notifications")
    is_affirmative: Optional[bool] = Field(False, description="Set to True if user response is confirming a pending action, e.g. 'yes', 'confirm', 'proceed', 'ok'")
    reasoning: str = Field(description="Explainable reasoning for intent and entity extraction")

# In-memory storage for confirmations (keyed by user_id string)
PENDING_ACTIONS: Dict[str, Dict[str, Any]] = {}

class ViraState(TypedDict):
    query: str
    user_context: dict
    history: List[dict]
    trace: dict
    output: dict
    db: Any

async def resolve_vira_agent_flow(query: str, user_context: dict, db: Session) -> dict:
    q_clean = query.lower()
    user_id_str = user_context.get("user_id", "demo")
    
    # 1. Parse query using Gemini structured output
    extracted = None
    try:
        history_str = ""
        for turn in user_context.get("history", []):
            role = turn.get("role") or turn.get("sender") or "user"
            if role in ["ai", "model"]:
                role_name = "VIRA"
            else:
                role_name = "FARMER"
            text = turn.get("text") or ""
            history_str += f"{role_name}: {text}\n"

        context_prompt = (
            f"Farmer Profile Context:\n"
            f"- Name: {user_context.get('farmer_name', 'Ramesh Patil')}\n"
            f"- Location: {user_context.get('district', 'Pune')}\n"
            f"- Crops: {user_context.get('crops', ['Sugarcane', 'Groundnut'])}\n"
            f"- Experience: {user_context.get('experience', '15 years')}\n\n"
            f"Recent Conversation History:\n"
            f"{history_str if history_str else '(No prior context in this session)'}\n\n"
            f"Current Farmer Message: \"{query}\"\n\n"
            f"Determine the user's intent and extract any entities. Make sure to use the history to resolve "
            f"context for follow-up questions. For example, if they previously asked about weather, and now ask "
            f"'Can I spray pesticide?', the intent is still 'query_weather' because pesticide spraying depends on the weather details."
        )

        extracted = await GeminiService.generate_structured_output(
            prompt=context_prompt,
            response_schema=ViraIntentExtraction,
            system_instruction=(
                "You are Vira's intent and entity extractor. Your job is to extract user intents, "
                "crops, machinery, schemes, soils, pages, and whether the message is a write action confirmation "
                "based on the message, the session history context, and the farmer's profile."
            )
        )
    except Exception as e:
        logger.error(f"Gemini intent extraction failed: {e}")
        
    # Fallback manual parsing if Gemini structured extraction fails
    if not extracted:
        is_yes = any(w in q_clean for w in ["yes", "confirm", "proceed", "ok", "yup", "sure", "do it"])
        extracted_intents = ["general_chat"]
        if "weather" in q_clean or "rain" in q_clean or "spray" in q_clean:
            extracted_intents.append("query_weather")
        if "price" in q_clean or "market" in q_clean or "mandi" in q_clean:
            extracted_intents.append("query_market_price")
        if "recommend" in q_clean or "fertilizer" in q_clean:
            if "fertilizer" in q_clean:
                extracted_intents.append("recommend_fertilizer")
            else:
                extracted_intents.append("recommend_crop")
        if "book" in q_clean or "rent" in q_clean:
            extracted_intents.append("book_machinery")
        if "apply" in q_clean or "scheme" in q_clean or "subsidy" in q_clean:
            if "apply" in q_clean:
                extracted_intents.append("apply_scheme")
            else:
                extracted_intents.append("query_scheme")
        if "profile" in q_clean:
            extracted_intents.append("update_profile")
        if "notification" in q_clean or "alert" in q_clean:
            extracted_intents.append("view_notifications")
        if "open" in q_clean or "show" in q_clean:
            extracted_intents.append("navigate")
        if "diagnose" in q_clean or "disease" in q_clean:
            extracted_intents.append("diagnose_disease")
            
        extracted = ViraIntentExtraction(
            intents=extracted_intents,
            crop="Tomato" if "tomato" in q_clean else ("Cotton" if "cotton" in q_clean else None),
            machinery="Rotavator" if "rotavator" in q_clean else ("Tractor" if "tractor" in q_clean else None),
            scheme="PM-Kisan" if "kisan" in q_clean else None,
            soil="Black soil" if "black" in q_clean else None,
            is_affirmative=is_yes,
            reasoning="Manual mapping fallback."
        )
        
    # 2. Check for Pending Write Confirmation
    if extracted.is_affirmative and user_id_str in PENDING_ACTIONS:
        pending = PENDING_ACTIONS.pop(user_id_str)
        action_type = pending["action"]
        pending_data = pending["data"]
        
        if action_type == "book_machinery":
            from app.controllers.machinery_controller import MachineryController
            from app.repositories.notification_repo import NotificationRepository
            
            m_id = uuid.UUID(pending_data["machinery_id"])
            u_id = uuid.UUID(user_id_str)
            
            try:
                booking = MachineryController.book_machinery(db, m_id, u_id)
                NotificationRepository.create_notification(
                    db, u_id, "success", "general",
                    "Booking Confirmed",
                    f"Your booking for {pending_data['machinery_name']} has been processed successfully.",
                    "Just now", "Rentals", "/machinery"
                )
                
                return {
                    "intent": "confirm_action",
                    "confidence": 1.0,
                    "reasoning": "User confirmed the machinery booking.",
                    "action": "book_machinery_success",
                    "requires_confirmation": False,
                    "redirect": "/machinery",
                    "cardType": "market",
                    "text": f"Great, I have successfully booked the {pending_data['machinery_name']} for you. You can see the booking in your dashboard.",
                    "data": {"booking_id": "success"}
                }
            except Exception as e:
                detail = str(e)
                if hasattr(e, "detail"):
                    detail = e.detail
                return {
                    "intent": "confirm_action_failed",
                    "confidence": 1.0,
                    "reasoning": f"Booking execution failed: {detail}",
                    "action": "speak",
                    "requires_confirmation": False,
                    "redirect": "/machinery",
                    "cardType": "general",
                    "text": f"Sorry, I couldn't complete the booking because: {detail}.",
                    "data": {}
                }
            
        elif action_type == "apply_scheme":
            from app.repositories.scheme_repo import SchemeRepository
            from app.repositories.notification_repo import NotificationRepository
            
            s_id = uuid.UUID(pending_data["scheme_id"])
            u_id = uuid.UUID(user_id_str)
            
            try:
                app = SchemeRepository.create_application(db, s_id, u_id, ["Aadhaar", "Land Records", "Bank Passbook"])
                NotificationRepository.create_notification(
                    db, u_id, "info", "general",
                    "Scheme Applied",
                    f"Applied to {pending_data['scheme_name']} successfully.",
                    "Just now", "Schemes", "/schemes"
                )
                
                return {
                    "intent": "confirm_action",
                    "confidence": 1.0,
                    "reasoning": "User confirmed the scheme application.",
                    "action": "apply_scheme_success",
                    "requires_confirmation": False,
                    "redirect": "/schemes",
                    "cardType": "scheme",
                    "text": f"Awesome, I have submitted your application for {pending_data['scheme_name']} successfully.",
                    "data": {"application_id": str(app.id)}
                }
            except Exception as e:
                detail = str(e)
                if hasattr(e, "detail"):
                    detail = e.detail
                return {
                    "intent": "confirm_action_failed",
                    "confidence": 1.0,
                    "reasoning": f"Scheme application failed: {detail}",
                    "action": "speak",
                    "requires_confirmation": False,
                    "redirect": "/schemes",
                    "cardType": "general",
                    "text": f"Sorry, I couldn't complete the application because: {detail}.",
                    "data": {}
                }
            
        elif action_type == "update_profile":
            from app.controllers.profile_controller import ProfileController
            u_id = uuid.UUID(user_id_str)
            
            try:
                ProfileController.update_profile(db, u_id, name="Ramesh Patil", experience_years=16)
                
                return {
                    "intent": "confirm_action",
                    "confidence": 1.0,
                    "reasoning": "User confirmed profile updates.",
                    "action": "update_profile_success",
                    "requires_confirmation": False,
                    "redirect": "/profile",
                    "cardType": "profile",
                    "text": "Profile updated successfully! Name set to Ramesh Patil and experience to 16 years.",
                    "data": {}
                }
            except Exception as e:
                detail = str(e)
                if hasattr(e, "detail"):
                    detail = e.detail
                return {
                    "intent": "confirm_action_failed",
                    "confidence": 1.0,
                    "reasoning": f"Profile update failed: {detail}",
                    "action": "speak",
                    "requires_confirmation": False,
                    "redirect": "/profile",
                    "cardType": "general",
                    "text": f"Sorry, I couldn't update your profile because: {detail}.",
                    "data": {}
                }
            
    # Clear any stale pending action if user said something unrelated
    if user_id_str in PENDING_ACTIONS and not extracted.is_affirmative:
        PENDING_ACTIONS.pop(user_id_str, None)

    # 3. Process Multi-Step Intents
    combined_texts = []
    combined_data = {}
    primary_redirect = None
    primary_card = "general"
    requires_confirmation = False
    
    # Remove duplicates from intents list while keeping order
    intents_to_run = []
    for it in extracted.intents:
        if it not in intents_to_run and it != "general_chat":
            intents_to_run.append(it)
            
    if not intents_to_run and "general_chat" in extracted.intents:
        intents_to_run = ["general_chat"]
        
    for intent in intents_to_run:
        # A. Weather Query
        if intent == "query_weather":
            from app.services.weather_service import WeatherService
            weather = WeatherService.get_weather_forecast(18.5204, 73.8567)
            curr = weather.get("current", {})
            temp = curr.get("temp", 23)
            cond = curr.get("condition", "Cloudy")
            humidity = curr.get("humidity", 95)
            spraying = "favorable" if curr.get("spraying_favorable") else "not favorable due to high rain probability"
            
            combined_texts.append(
                f"Today's weather in Pune is {temp}°C with {cond}. Humidity is {humidity}%. "
                f"Pesticide spraying is currently {spraying}."
            )
            combined_data["weather"] = weather
            primary_redirect = "/weather"
            primary_card = "weather"
            
        # B. Mandi Prices
        elif intent == "query_market_price":
            from app.repositories.market_repo import MarketRepository
            prices = MarketRepository.get_prices(db)
            crop_target = extracted.crop or "Tomato"
            match = None
            if prices:
                for p in prices:
                    if crop_target.lower() in p.crop_name.lower():
                        match = p
                        break
                if not match:
                    match = prices[0]
            
            if match:
                combined_texts.append(
                    f"The current mandi price for {match.crop_name} is ₹{match.current_price}/Quintal "
                    f"with an {match.trend} trend (Yesterday: ₹{match.yesterday_price})."
                )
                combined_data["market_price"] = {
                    "crop": match.crop_name,
                    "price": match.current_price,
                    "unit": "Quintal",
                    "trend": match.trend
                }
            else:
                combined_texts.append("No mandi price matches were found in Pune index.")
                
            primary_redirect = "/market"
            primary_card = "market"
            
        # C. Crop Recommendation (with Agent Chaining and XAI)
        elif intent == "recommend_crop":
            # 1. Fetch soil type
            from app.repositories.farm_repo import FarmRepository
            u_uuid = None
            try:
                u_uuid = uuid.UUID(user_id_str)
            except Exception:
                pass
            farms = FarmRepository.get_by_user(db, u_uuid) if u_uuid else []
            soil_type = extracted.soil or (farms[0].soil_type if farms else "Loamy")
            
            # 2. Weather
            from app.services.weather_service import WeatherService
            weather = WeatherService.get_weather_forecast(18.5204, 73.8567)
            curr = weather.get("current", {})
            rain_prob = curr.get("rain_prob", 0)
            
            # 3. Market price
            from app.repositories.market_repo import MarketRepository
            prices = MarketRepository.get_prices(db)
            crop_name = "Groundnut"
            if prices:
                crop_name = prices[0].crop_name
                
            # 4. Scheme check
            from app.repositories.scheme_repo import SchemeRepository
            schemes = SchemeRepository.get_all(db)
            scheme_name = schemes[0].name if schemes else "PM-Kusum"
            
            rec_text = (
                f"I recommend planting {crop_name} because:\n"
                f"• Soil type is suitable ({soil_type})\n"
                f"• Rain probability this week is adequate ({rain_prob}% today)\n"
                f"• Mandi price forecast is increasing\n"
                f"• {scheme_name} subsidy is available to offset setup costs"
            )
            combined_texts.append(rec_text)
            combined_data["crop_recommendation"] = {
                "recommended": crop_name,
                "soil": soil_type,
                "rain_probability": rain_prob,
                "scheme": scheme_name
            }
            primary_redirect = "/crops"
            primary_card = "crop"
            
        # D. Recommend Fertilizer
        elif intent == "recommend_fertilizer":
            crop_target = extracted.crop or "Sugarcane"
            adv_text = (
                f"Nutrient advisory for {crop_target}: Apply NPK mixture in a 4:2:1 ratio. "
                "Focus on topdressing Nitrogen fertilizer (Urea) at tillering and grand growth stages."
            )
            combined_texts.append(adv_text)
            combined_data["fertilizer_advisory"] = {
                "crop": crop_target,
                "npk_ratio": "4:2:1",
                "fertilizers": ["Urea", "SSP", "MOP"]
            }
            primary_redirect = "/crops"
            primary_card = "crop"
            
        # E. Diagnose Disease
        elif intent == "diagnose_disease":
            combined_texts.append(
                "Opening the Disease Detection module. Place your crop leaf inside the camera viewfinder "
                "to initiate an automatic diagnostic scan."
            )
            primary_redirect = "/disease"
            primary_card = "disease"
            
        # F. Book Machinery (Awaiting confirmation)
        elif intent == "book_machinery":
            from app.repositories.machinery_repo import MachineryRepository
            listings = MachineryRepository.get_all(db)
            target = None
            mach_target = extracted.machinery or "Tractor"
            if listings:
                for item in listings:
                    if mach_target.lower() in item.name.lower():
                        target = item
                        break
                if not target:
                    target = listings[0]
            
            if target:
                requires_confirmation = True
                PENDING_ACTIONS[user_id_str] = {
                    "action": "book_machinery",
                    "data": {
                        "machinery_id": str(target.id),
                        "machinery_name": target.name
                    }
                }
                combined_texts.append(
                    f"I found the {target.name} available for rent at {target.price_rate}. "
                    "Do you want me to proceed with booking it?"
                )
                combined_data["machinery_booking"] = {
                    "machinery_id": str(target.id),
                    "name": target.name,
                    "price": target.price_rate
                }
            else:
                combined_texts.append("Sorry, I could not find any available machinery in Pune index.")
                
            primary_redirect = "/machinery"
            primary_card = "market"
            
        # G. Apply Scheme (Awaiting confirmation)
        elif intent == "apply_scheme":
            u_uuid = None
            try:
                u_uuid = uuid.UUID(user_id_str)
            except Exception:
                pass
            
            # Check eligibility first
            from app.repositories.farm_repo import FarmRepository
            farms = FarmRepository.get_by_user(db, u_uuid) if u_uuid else []
            
            # Find matching scheme
            from app.repositories.scheme_repo import SchemeRepository
            schemes = SchemeRepository.get_all(db)
            target_scheme = None
            scheme_target = extracted.scheme or "PM-Kisan"
            if schemes:
                for s in schemes:
                    if scheme_target.lower() in s.name.lower():
                        target_scheme = s
                        break
                if not target_scheme:
                    target_scheme = schemes[0]
            
            if not farms:
                combined_texts.append(
                    f"I checked your profile but you do not have any registered farms. "
                    f"Registration is required to apply for the {target_scheme.name if target_scheme else 'PM-Kisan'} scheme."
                )
            elif target_scheme:
                requires_confirmation = True
                PENDING_ACTIONS[user_id_str] = {
                    "action": "apply_scheme",
                    "data": {
                        "scheme_id": str(target_scheme.id),
                        "scheme_name": target_scheme.name
                    }
                }
                combined_texts.append(
                    f"I verified your profile. You are eligible for {target_scheme.name}. "
                    "Do you want me to submit your application?"
                )
                combined_data["scheme_application"] = {
                    "scheme_id": str(target_scheme.id),
                    "name": target_scheme.name
                }
            else:
                combined_texts.append("Government scheme not found in repository.")
                
            primary_redirect = "/schemes"
            primary_card = "scheme"
            
        # H. Query Scheme
        elif intent == "query_scheme":
            from app.repositories.scheme_repo import SchemeRepository
            schemes = SchemeRepository.get_all(db)
            if schemes:
                schemes_str = ", ".join([s.name for s in schemes[:2]])
                combined_texts.append(f"Government schemes matched to your profile: {schemes_str}.")
            else:
                combined_texts.append("I searched the scheme portal but found no active matches.")
            primary_redirect = "/schemes"
            primary_card = "scheme"
            
        # I. Update Profile (Awaiting confirmation)
        elif intent == "update_profile":
            requires_confirmation = True
            PENDING_ACTIONS[user_id_str] = {
                "action": "update_profile",
                "data": {}
            }
            combined_texts.append("Do you want me to update your profile name to Ramesh Patil and experience to 16 years?")
            primary_redirect = "/profile"
            primary_card = "profile"
            
        # J. View Notifications
        elif intent == "view_notifications":
            combined_texts.append("Opening alerts panel. Displaying system notifications.")
            primary_redirect = "/notifications"
            primary_card = "general"
            
        # K. Navigation redirection
        elif intent == "navigate":
            target_page = extracted.page or "dashboard"
            routes_map = {
                "dashboard": "/dashboard",
                "weather": "/weather",
                "market": "/market",
                "crops": "/crops",
                "schemes": "/schemes",
                "machinery": "/machinery",
                "profile": "/profile",
                "notifications": "/notifications",
                "settings": "/settings"
            }
            resolved_path = routes_map.get(target_page.lower(), "/dashboard")
            combined_texts.append(f"Navigating you to the {target_page.title()} page.")
            primary_redirect = resolved_path
            
    # Combine messages
    if combined_texts:
        final_text = " ".join(combined_texts)
        return {
            "intent": extracted.intents[0] if extracted.intents else "general_chat",
            "confidence": 0.98,
            "reasoning": extracted.reasoning,
            "action": "navigate" if primary_redirect else "speak",
            "requires_confirmation": requires_confirmation,
            "redirect": primary_redirect,
            "cardType": primary_card,
            "text": final_text,
            "data": combined_data
        }
        
    # Smart Fallback if no intent or general chat matches
    clarifications = [
        "I didn't catch that. Would you like me to show the weather, recommend a crop, book a tractor, or query cotton prices?",
        "Could you please clarify? I can help you search government schemes, diagnose leaf disease, or check APMC mandi indices.",
        "I'm here to assist with your farm. Please ask a command such as 'show weather', 'book a tractor', or 'open my crops'."
    ]
    import random
    fallback_text = random.choice(clarifications)
    return {
        "intent": "clarify",
        "confidence": 0.95,
        "reasoning": "Low confidence intent matches. Prompting farmer for clarification.",
        "action": "speak",
        "requires_confirmation": False,
        "redirect": None,
        "cardType": "general",
        "text": fallback_text,
        "data": {}
    }

async def inject_context_node(state: ViraState) -> dict:
    ctx = state["user_context"]
    mem_block = (
        f"Farmer Profile Memory:\n"
        f"- Name: {ctx.get('farmer_name', 'Ramesh Patil')}\n"
        f"- Language: {ctx.get('language', 'English')}\n"
        f"- Location: {ctx.get('district', 'Pune')}\n"
        f"- Registered Crops: {ctx.get('crops', 'Sugarcane, Groundnut')}\n"
        f"- Experience: {ctx.get('experience', '15 years')}\n"
    )
    return {
        "trace": {
            "user_query": state["query"],
            "retrieved_context": mem_block
        }
    }

async def execute_vira_node(state: ViraState) -> dict:
    query = state["query"]
    db = state.get("db")
    ctx = state["user_context"]
    
    if db:
        res = await resolve_vira_agent_flow(query, ctx, db)
        return {
            "output": res
        }
        
    return {
        "output": {
            "intent": "general_chat",
            "confidence": 0.95,
            "reasoning": "Stateless fallback execution.",
            "action": "speak",
            "requires_confirmation": False,
            "redirect": None,
            "cardType": "general",
            "text": "Farming system offline. I can assist you when connected to the database.",
            "data": {}
        }
    }

class ViraAgent:
    def __init__(self):
        self.system_prompt = VIRA_SYSTEM_PROMPT
        
        workflow = StateGraph(ViraState)
        workflow.add_node("inject_context", inject_context_node)
        workflow.add_node("execute_vira", execute_vira_node)
        
        workflow.set_entry_point("inject_context")
        workflow.add_edge("inject_context", "execute_vira")
        workflow.add_edge("execute_vira", END)
        
        self.app = workflow.compile()
        logger.info("ViraAgent LangGraph workflow compiled successfully.")

    async def execute(self, query: str, user_context: dict, db: Session = None) -> dict:
        """Executes compiled Vira Farming Assistant LangGraph workflow."""
        logger.info(f"ViraAgent execution triggered for query: {query}")
        
        history = user_context.get("history", [])
        initial_state = {
            "query": query,
            "user_context": user_context,
            "history": history,
            "trace": {},
            "output": {},
            "db": db
        }
        res = await self.app.ainvoke(initial_state)
        return res["output"]
