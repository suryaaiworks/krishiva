import logging
import time
from sqlalchemy.orm import Session
from app.repositories.notification_repo import NotificationRepository
from app.repositories.user_repo import UserRepository
from app.repositories.farm_repo import FarmRepository
from app.ai_agents.vira.agent import ViraAgent
from uuid import UUID
import datetime

logger = logging.getLogger(__name__)

class AssistantController:
    @staticmethod
    async def chat_with_vira(db: Session, user_id: UUID, user_message: str) -> dict:
        """
        Processes chat interaction.
        Appends user query to database log, invokes Vira agent,
        appends AI reply, and returns reply packet.
        """
        # 1. Log user message
        timestamp = datetime.datetime.now().strftime("%I:%M %p")
        user_msg = {
            "id": str(uuid_generator()),
            "sender": "user",
            "text": user_message,
            "timestamp": timestamp
        }
        NotificationRepository.append_chat_message(db, user_id, user_msg)
        
        # 2. Fetch context memory for Vira Agent
        farmer_profile = UserRepository.get_profile(db, user_id)
        farms = FarmRepository.get_by_user(db, user_id)
        history_record = NotificationRepository.get_chat_history(db, user_id)
        history = history_record.messages if history_record else []
        
        crops_list = []
        if farms:
            for f in farms:
                health_log = FarmRepository.get_crop_health(db, f.id)
                if health_log:
                    if health_log.growth_stage and health_log.growth_stage not in crops_list:
                        crops_list.append(health_log.growth_stage)
                            
        user_context = {
            "user_id": str(user_id),
            "farmer_name": farmer_profile.name if farmer_profile else "Ramesh Patil",
            "experience": f"{farmer_profile.experience_years} years" if farmer_profile else "15 years",
            "language": "English",
            "district": farmer_profile.verified_id.split("-")[0] if (farmer_profile and farmer_profile.verified_id) else "Pune",
            "crops": ", ".join(crops_list) if crops_list else "Sugarcane, Groundnut",
            "history": history
        }
        
        # 3. Execute Vira Agent
        agent = ViraAgent()
        agent_reply = await agent.execute(user_message, user_context, db=db)
        
        # 4. Log AI response
        ai_msg = {
            "id": str(uuid_generator()),
            "sender": "ai",
            "text": agent_reply.get("text") or agent_reply.get("speech") or "",
            "timestamp": timestamp,
            "cardType": agent_reply.get("cardType") or "general",
            "redirect": agent_reply.get("redirect") or "",
            "intent": agent_reply.get("intent", "general_chat"),
            "confidence": agent_reply.get("confidence", 0.95),
            "reasoning": agent_reply.get("reasoning", ""),
            "action": agent_reply.get("action", "speak"),
            "requires_confirmation": agent_reply.get("requires_confirmation", False),
            "speech": agent_reply.get("speech") or agent_reply.get("text") or "",
            "data": agent_reply.get("data") or {}
        }
        NotificationRepository.append_chat_message(db, user_id, ai_msg)
        
        return ai_msg

    @staticmethod
    def get_history(db: Session, user_id: UUID) -> list:
        """Retrieves conversational messages queue."""
        hist = NotificationRepository.get_chat_history(db, user_id)
        if not hist:
            # Seed initial Vira welcoming prompt
            welcome_msg = {
                "id": "1",
                "sender": "ai",
                "text": "Hello! I am your Vira AI Advisor. How can I help your farm today? You can ask me for crop suggestions, weather forecasts, market prices, or upload crop leaf photos to diagnose diseases.",
                "timestamp": "10:15 AM"
            }
            hist = NotificationRepository.append_chat_message(db, user_id, welcome_msg)
            
        return hist.messages

    @staticmethod
    def get_config(db: Session, user_id: Any) -> dict:
        """Loads customized farmer profile details for Vira client setup."""
        profile = None
        farms = []
        try:
            if user_id and user_id != "demo":
                profile = UserRepository.get_profile(db, user_id)
                farms = FarmRepository.get_by_user(db, user_id)
        except Exception as e:
            logger.warning(f"Failed to fetch profile in get_config: {e}")

        crops = [f.current_crop for f in farms if f.current_crop] if farms else ["Sugarcane", "Groundnut"]
        if not crops:
            crops = ["Sugarcane", "Groundnut"]

        language = "te"
        if user_id and user_id != "demo":
            try:
                from app.models.user import Settings as UserSettings
                user_settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
                if user_settings:
                    language = user_settings.language
            except Exception:
                pass

        return {
            "success": True,
            "message": "Assistant Config data",
            "user": {
                "assistantName": "Vira",
                "theme": "earth",
                "tone": "advisory",
                "farmer": {
                    "id": str(user_id) if user_id else "demo",
                    "name": profile.name if profile else "Ramesh Patil",
                    "language": language,
                    "location": profile.verified_id.split("-")[0] if (profile and profile.verified_id) else "Pune",
                    "crops": crops
                }
            }
        }

    @staticmethod
    async def ask_assistant(db: Session, user_id: Any, payload: Any) -> dict:
        """
        Executes real Vira Agent LangGraph loop with Supabase, Gemini, and live context.
        """
        start_time = time.time()
        user_message = payload.message

        user_profile = None
        user_settings = None
        farms = []
        history = []
        if payload.history:
            history = payload.history

        if user_id and user_id != "demo":
            try:
                user_profile = UserRepository.get_profile(db, user_id)
                farms = FarmRepository.get_by_user(db, user_id)
                if not history:
                    history_record = NotificationRepository.get_chat_history(db, user_id)
                    if history_record:
                        history = history_record.messages
                
                from app.models.user import Settings as UserSettings
                user_settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
            except Exception as e:
                logger.warning(f"Failed to load details in ask_assistant: {e}")

        crops_list = []
        if farms:
            for f in farms:
                if f.current_crop and f.current_crop not in crops_list:
                    crops_list.append(f.current_crop)

        language = payload.farmer.get("language") if payload.farmer else None
        if not language:
            language = user_settings.language if user_settings else "te"

        location = payload.farmer.get("location") if payload.farmer else None
        if not location:
            location = user_profile.verified_id.split("-")[0] if (user_profile and user_profile.verified_id) else "Pune"

        farmer_name = user_profile.name if user_profile else (payload.farmer.get("name") if payload.farmer else "Ramesh Patil")

        user_context = {
            "user_id": str(user_id) if user_id else "demo",
            "farmer_name": farmer_name,
            "experience": f"{user_profile.experience_years} years" if user_profile else "15 years",
            "language": language,
            "district": location,
            "crops": crops_list if crops_list else ["Sugarcane", "Groundnut"],
            "history": history
        }

        # Log user query if authenticated
        timestamp = datetime.datetime.now().strftime("%I:%M %p")
        if user_id and user_id != "demo":
            user_msg = {
                "id": str(uuid_generator()),
                "sender": "user",
                "text": user_message,
                "timestamp": timestamp
            }
            NotificationRepository.append_chat_message(db, user_id, user_msg)

        # Execute Vira LangGraph agent
        agent = ViraAgent()
        agent_reply = await agent.execute(user_message, user_context, db=db)

        # Log AI response if authenticated
        if user_id and user_id != "demo":
            ai_msg = {
                "id": str(uuid_generator()),
                "sender": "ai",
                "text": agent_reply.get("text") or agent_reply.get("speech") or "",
                "timestamp": timestamp,
                "cardType": agent_reply.get("cardType") or "general",
                "redirect": agent_reply.get("redirect") or "",
                "intent": agent_reply.get("intent", "general_chat"),
                "confidence": agent_reply.get("confidence", 0.95),
                "reasoning": agent_reply.get("reasoning", ""),
                "action": agent_reply.get("action", "speak"),
                "requires_confirmation": agent_reply.get("requires_confirmation", False),
                "speech": agent_reply.get("speech") or agent_reply.get("text") or "",
                "data": agent_reply.get("data") or {}
            }
            NotificationRepository.append_chat_message(db, user_id, ai_msg)

        # Build pipeline diagnostics
        trace = agent_reply.get("reasoning_trace", {})
        execution_time_ms = int((time.time() - start_time) * 1000)

        pipeline = {
            "language": language,
            "intent": agent_reply.get("intent", "general_chat"),
            "selectedTool": "none",
            "pluginCalled": "none",
            "executionTimeMs": execution_time_ms,
            "confidence": int(agent_reply.get("confidence", 0.95) * 100),
            "rawJson": agent_reply
        }

        redirect_path = agent_reply.get("redirect")
        page_val = redirect_path.lstrip("/") if redirect_path else ""

        return {
            "success": True,
            "intent": agent_reply.get("intent", "general_chat"),
            "confidence": agent_reply.get("confidence", 0.95),
            "reasoning": agent_reply.get("reasoning", ""),
            "action": agent_reply.get("action", "speak"),
            "requires_confirmation": agent_reply.get("requires_confirmation", False),
            "route": redirect_path or "",
            "speech": agent_reply.get("speech") or agent_reply.get("text") or "",
            "data": agent_reply.get("data") or {},
            "aiResponse": agent_reply.get("speech") or agent_reply.get("text") or "",
            "page": page_val,
            "pipeline": pipeline
        }

def uuid_generator() -> UUID:
    import uuid
    return uuid.uuid4()
