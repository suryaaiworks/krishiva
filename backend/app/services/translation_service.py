import logging
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class TranslationService:
    @staticmethod
    async def translate_to_english(text: str) -> str:
        """
        Translates regional/multilingual farmer query to English so intent matching 
        and database queries match accurately. Returns original text if translation fails.
        """
        if not text:
            return text
            
        # Clean query check
        text_strip = text.strip()
        if not text_strip:
            return text
            
        # If it looks like a pure English command, return directly
        # otherwise ask Gemini to translate
        prompt = (
            "Translate the following user farming query to clear, standard English. "
            "If the query is already in English, output it exactly as is without changes.\n\n"
            f"Query: {text_strip}"
        )
        
        try:
            logger.info("TranslationService: Translating user query to English via Gemini...")
            translated = await GeminiService.generate_content(
                prompt=prompt,
                system_instruction="You are a precise translator. Output ONLY the English translation, with no explanation or conversational filler."
            )
            if translated:
                clean_trans = translated.strip().strip('"').strip("'")
                logger.info(f"TranslationService: Translated to English: '{clean_trans}'")
                return clean_trans
        except Exception as e:
            logger.error(f"TranslationService: Query translation failed: {e}")
            
        return text

    @staticmethod
    async def translate_to_language(text: str, target_lang_code: str) -> str:
        """
        Translates Vira's English response into Hindi (hi) or Telugu (te).
        Returns original English if target is en/English or translation fails.
        """
        if not text or not target_lang_code:
            return text
            
        lang_code = target_lang_code.lower().strip()
        if lang_code in ["en", "english"]:
            return text
            
        lang_name = None
        if lang_code in ["te", "telugu"]:
            lang_name = "Telugu"
        elif lang_code in ["hi", "hindi"]:
            lang_name = "Hindi"
            
        if not lang_name:
            return text
            
        prompt = (
            f"You are a professional agricultural translator. Translate the following English text into warm, natural, and highly readable {lang_name} suitable for rural farmers.\n"
            "Keep technical metrics (like Celsius, humidity, APMC names, or chemical names in parenthesized English if helpful) but make the phrasing fluent.\n\n"
            f"Text:\n{text}"
        )
        
        try:
            logger.info(f"TranslationService: Translating Vira response to {lang_name} via Gemini...")
            translated = await GeminiService.generate_content(
                prompt=prompt,
                system_instruction=f"You are a warm agricultural translator. Translate the input text directly and cleanly into fluent {lang_name}."
            )
            if translated:
                clean_trans = translated.strip()
                logger.info(f"TranslationService: Successfully translated Vira response to {lang_name}")
                return clean_trans
        except Exception as e:
            logger.error(f"TranslationService: Response translation to {lang_name} failed: {e}")
            
        return text
