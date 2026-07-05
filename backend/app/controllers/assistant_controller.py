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
        # 1. Log original user message in chat log
        timestamp = datetime.datetime.now().strftime("%I:%M %p")
        user_msg = {
            "id": str(uuid_generator()),
            "sender": "user",
            "text": user_message,
            "timestamp": timestamp
        }
        NotificationRepository.append_chat_message(db, user_id, user_msg)
        
        # 2. Retrieve settings and language
        language = "en"
        try:
            from app.models.user import Settings as UserSettings
            user_settings = db.query(UserSettings).filter(UserSettings.user_id == user_id).first()
            if user_settings:
                language = user_settings.language
        except Exception as e:
            logger.warning(f"Failed to load settings in chat_with_vira: {e}")

        # 3. Translate query to English if regional language
        from app.services.translation_service import TranslationService
        english_message = await TranslationService.translate_to_english(user_message)
        
        # 4. Fetch context memory for Vira Agent
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
                            
        lang_name = "Telugu" if language == "te" else "Hindi" if language == "hi" else "English"
        user_context = {
            "user_id": str(user_id),
            "farmer_name": farmer_profile.name if farmer_profile else "Ramesh Patil",
            "experience": f"{farmer_profile.experience_years} years" if farmer_profile else "15 years",
            "language": lang_name,
            "district": farmer_profile.verified_id.split("-")[0] if (farmer_profile and farmer_profile.verified_id) else "Pune",
            "crops": ", ".join(crops_list) if crops_list else "Sugarcane, Groundnut",
            "history": history
        }
        
        # 5. Execute Vira Agent on the English translated query
        agent = ViraAgent()
        agent_reply = await agent.execute(english_message, user_context, db=db)
        
        # 6. Translate response back to user preferred language
        reply_text = agent_reply.get("text") or agent_reply.get("speech") or ""
        translated_reply_text = await TranslationService.translate_to_language(reply_text, language)

        # 7. Log AI response
        ai_msg = {
            "id": str(uuid_generator()),
            "sender": "ai",
            "text": translated_reply_text,
            "timestamp": timestamp,
            "cardType": agent_reply.get("cardType") or "general",
            "redirect": agent_reply.get("redirect") or "",
            "intent": agent_reply.get("intent", "general_chat"),
            "confidence": agent_reply.get("confidence", 0.95),
            "reasoning": agent_reply.get("reasoning", ""),
            "action": agent_reply.get("action", "speak"),
            "requires_confirmation": agent_reply.get("requires_confirmation", False),
            "speech": translated_reply_text,
            "data": agent_reply.get("data") or {}
        }
        NotificationRepository.append_chat_message(db, user_id, ai_msg)
        
        return ai_msg

    @staticmethod
    def get_history(db: Session, user_id: UUID, lang: str = "en") -> list:
        """Retrieves conversational messages queue."""
        hist = NotificationRepository.get_chat_history(db, user_id)
        if not hist:
            # Seed initial Vira welcoming prompt
            welcome_text = "Hello! I am your Vira AI Advisor. How can I help your farm today? You can ask me for crop suggestions, weather forecasts, market prices, or upload crop leaf photos to diagnose diseases."
            if lang == "te":
                welcome_text = "నమస్కారం! నేను మీ వీర AI సలహాదారుని. ఈ రోజు మీ వ్యవసాయానికి నేను ఎలా సహాయపడగలను? మీరు నన్ను పంటల సిఫార్సులు, వాతావరణ అంచనాలు, మార్కెట్ ధరల గురించి అడగవచ్చు లేదా తెగుళ్లను గుర్తించడానికి పంట ఆకుల ఫోటోలను అప్‌లోడ్ చేయవచ్చు."
            elif lang == "hi":
                welcome_text = "नमस्ते! मैं आपका वीरा AI सलाहकार हूँ। आज मैं आपके खेत के लिए क्या मदद कर सकता हूँ? आप मुझसे फसल सुझाव, मौसम पूर्वानुमान, बाजार भाव पूछ सकते हैं, या बीमारी की पहचान के लिए पत्ती की फोटो अपलोड कर सकते हैं।"
                
            welcome_msg = {
                "id": "1",
                "sender": "ai",
                "text": welcome_text,
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

        logger.info("================ VIRA VOICE PIPELINE AUDIT START ================")
        logger.info(f"Stage 1: Speech input transcription received: '{user_message}'")

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

        logger.info(f"Stage 2: Language Preference detected: '{language}'")

        # Translate incoming regional query to English using TranslationService
        from app.services.translation_service import TranslationService
        try:
            english_message = await TranslationService.translate_to_english(user_message)
            logger.info(f"Stage 3: Query Translation to English success: '{english_message}'")
        except Exception as e:
            logger.error(f"Stage 3: Query Translation failed: {e}")
            english_message = user_message

        # Handle context location safely
        location = payload.farmer.get("location") if payload.farmer else None
        if not location:
            location = user_profile.verified_id.split("-")[0] if (user_profile and user_profile.verified_id) else "Pune"

        lang_name = "Telugu" if language == "te" else "Hindi" if language == "hi" else "English"
        user_context = {
            "user_id": str(user_id) if user_id else "demo",
            "farmer_name": user_profile.name if user_profile else (payload.farmer.get("name") if payload.farmer else "Ramesh Patil"),
            "experience": f"{user_profile.experience_years} years" if user_profile else "15 years",
            "language": lang_name,
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
                "text": user_message, # Log original language query
                "timestamp": timestamp
            }
            NotificationRepository.append_chat_message(db, user_id, user_msg)

        logger.info("Stage 4 & 5: Intent classification & Vira Agent LangGraph entry.")
        agent = ViraAgent()
        try:
            agent_reply = await agent.execute(english_message, user_context, db=db)
            logger.info(f"Stage 6: Gemini response generated. Intent: '{agent_reply.get('intent')}'")
        except Exception as e:
            logger.error(f"Stage 6: Vira Agent execution failed: {e}")
            agent_reply = {
                "intent": "general_chat",
                "text": "I'm sorry, I encountered an internal error. Please try again.",
                "speech": "I'm sorry, I encountered an internal error. Please try again."
            }

        # Translate reply text back to regional language using TranslationService
        reply_text = agent_reply.get("text") or agent_reply.get("speech") or ""
        try:
            translated_reply_text = await TranslationService.translate_to_language(reply_text, language)
            logger.info(f"Stage 7: Response translation success back to '{language}': '{translated_reply_text}'")
        except Exception as e:
            logger.error(f"Stage 7: Response translation failed: {e}")
            translated_reply_text = reply_text

        # Log AI response if authenticated
        if user_id and user_id != "demo":
            ai_msg = {
                "id": str(uuid_generator()),
                "sender": "ai",
                "text": translated_reply_text,
                "timestamp": timestamp,
                "cardType": agent_reply.get("cardType") or "general",
                "redirect": agent_reply.get("redirect") or "",
                "intent": agent_reply.get("intent", "general_chat"),
                "confidence": agent_reply.get("confidence", 0.95),
                "reasoning": agent_reply.get("reasoning", ""),
                "action": agent_reply.get("action", "speak"),
                "requires_confirmation": agent_reply.get("requires_confirmation", False),
                "speech": translated_reply_text,
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

        logger.info("Stage 8: Speech response packaged and dispatched to client.")
        logger.info("================ VIRA VOICE PIPELINE AUDIT END ================")

        return {
            "success": True,
            "intent": agent_reply.get("intent", "general_chat"),
            "confidence": agent_reply.get("confidence", 0.95),
            "reasoning": agent_reply.get("reasoning", ""),
            "action": agent_reply.get("action", "speak"),
            "requires_confirmation": agent_reply.get("requires_confirmation", False),
            "route": redirect_path or "",
            "speech": translated_reply_text,
            "data": agent_reply.get("data") or {},
            "aiResponse": translated_reply_text,
            "page": page_val,
            "pipeline": pipeline
        }

def uuid_generator() -> UUID:
    import uuid
    return uuid.uuid4()
