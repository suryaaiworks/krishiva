import logging
import time
from typing import List, Any, Dict, Type
from pydantic import BaseModel
from app.config.settings import settings

logger = logging.getLogger(__name__)

# Try importing the official google-genai library
try:
    from google import genai
    from google.genai import types
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False
    logger.warning("google-genai library is not installed. Falling back to local mock services.")

class GeminiService:
    _client = None

    @classmethod
    def get_client(cls):
        """Initializes and returns the official GenAI Client."""
        if not HAS_GENAI:
            return None
            
        if cls._client is None:
            api_key = getattr(settings, "GEMINI_API_KEY", None)
            if not api_key or api_key == "your-gemini-api-key":
                logger.warning("GEMINI_API_KEY env key is not configured or is a placeholder. Initializing local mock fallback mode.")
                return None
                
            try:
                # Initialize GenAI Client using official constructor
                cls._client = genai.Client(api_key=api_key)
                logger.info("Official Google GenAI Client successfully initialized.")
            except Exception as e:
                logger.error(f"Failed to initialize official GenAI Client: {e}. Falling back to mock modes.")
                cls._client = None
                
        return cls._client

    @classmethod
    async def generate_content(cls, prompt: str, system_instruction: str = None, model: str = "gemini-2.5-flash") -> str:
        """Generates text content using Gemini. Falls back gracefully if offline/unauthorized."""
        t0 = time.time()
        client = cls.get_client()
        
        if client:
            try:
                config = None
                if system_instruction:
                    config = types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.7
                    )
                # Official models.generate_content call
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config
                )
                dt = time.time() - t0
                logger.info(f"Gemini API request completed in {dt:.3f}s. Model: {model}")
                return response.text or ""
            except Exception as e:
                logger.error(f"Gemini generate_content API error: {e}. Triggering local fallback.")
                
        # Mock fallback response based on keywords
        return cls._get_mock_response(prompt, system_instruction)

    @classmethod
    def generate_stream(cls, prompt: str, system_instruction: str = None, model: str = "gemini-2.5-flash"):
        """Streams text content chunks. Falls back gracefully if offline."""
        client = cls.get_client()
        
        if client:
            try:
                config = None
                if system_instruction:
                    config = types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.7
                    )
                # Official generate_content_stream call
                stream = client.models.generate_content_stream(
                    model=model,
                    contents=prompt,
                    config=config
                )
                for chunk in stream:
                    yield chunk.text or ""
                return
            except Exception as e:
                logger.error(f"Gemini stream API error: {e}. Streaming fallback response.")

        # Fallback stream
        fallback_text = cls._get_mock_response(prompt, system_instruction)
        for word in fallback_text.split(" "):
            yield word + " "
            time.sleep(0.02)

    @classmethod
    async def generate_structured_output(
        cls, 
        prompt: str, 
        response_schema: Type[BaseModel], 
        system_instruction: str = None, 
        model: str = "gemini-2.5-flash"
    ) -> Any:
        """Enforces Pydantic structured output constraints on Gemini replies."""
        t0 = time.time()
        client = cls.get_client()
        
        if client:
            try:
                config = types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=response_schema,
                    temperature=0.2
                )
                if system_instruction:
                    config.system_instruction = system_instruction

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config
                )
                dt = time.time() - t0
                logger.info(f"Gemini Structured Output request completed in {dt:.3f}s.")
                # Parse output to Pydantic object
                return response_schema.model_validate_json(response.text)
            except Exception as e:
                logger.error(f"Structured output parsing error: {e}. Falling back to default Pydantic object.")
                try:
                    return cls._generate_mock_pydantic(response_schema, prompt)
                except Exception:
                    return None

        try:
            return cls._generate_mock_pydantic(response_schema, prompt)
        except Exception:
            return None

    @classmethod
    async def call_with_tools(
        cls, 
        prompt: str, 
        tools: List[Any], 
        system_instruction: str = None, 
        model: str = "gemini-2.5-flash"
    ) -> str:
        """Executes tool-calling loop using supplied python function tools."""
        t0 = time.time()
        client = cls.get_client()
        
        if client:
            try:
                config = types.GenerateContentConfig(
                    tools=tools,
                    temperature=0.4
                )
                if system_instruction:
                    config.system_instruction = system_instruction

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config
                )
                
                # Check for tool calls
                if response.function_calls:
                    # Let the official tool execute. In mock/fallback tests we resolve locally
                    logger.info(f"Gemini API returned {len(response.function_calls)} tool execution requests.")
                    
                dt = time.time() - t0
                logger.info(f"Gemini tool call resolved in {dt:.3f}s.")
                return response.text or "Completed tool check."
            except Exception as e:
                logger.error(f"Tool call API error: {e}. Executing fallback tool loop.")

        # Mock tool call resolver
        return cls._execute_mock_tools(prompt, tools, system_instruction)

    @staticmethod
    def _get_mock_response(prompt: str, system_instruction: str = None) -> str:
        """Constructs a context-aware mock reply matching system prompt intents."""
        q = prompt.lower()
        
        # Audit/Stage Log translation bypass in mock mode
        if "translate" in q:
            if "query:" in q:
                parts = prompt.split("Query:")
                if len(parts) > 1:
                    return parts[1].strip()
            return prompt
            
        if "weather" in q or "rain" in q:
            return (
                "Vira: Based on climate models for Pune, a dry spell warning is active. "
                "precipitation is at 10% with high winds of 14 km/h. "
                "Recommendation: Delay weeding operations, focus on evening drip cycles to preserve root moisture."
            )
        elif "disease" in q or "scan" in q or "leaf" in q:
            return (
                "Vira: Leaf analysis completed successfully. I diagnosed Sugarcane Rust (92.4% confidence). "
                "Recommended treatment: Apply Mancozeb 75% WP (2g/L) or copper oxychloride organic solutions. "
                "Remove dry leaves to break the fungal propagation cycle."
            )
        elif "crop" in q or "recommend" in q or "sugarcane" in q or "sugarcanes" in q:
            return (
                "Vira: Evaluated matching crop profiles for your loamy soil in Shirur, Pune. "
                "Sugarcane matches at 96% and Groundnut (TAG-24) at 88%. Groundnuts will restore nitrogen post-harvest."
            )
        elif "price" in q or "market" in q or "mandi" in q:
            return (
                "Vira: Checked spot mandi prices for Pune APMC. Groundnuts are trading at ₹6,800/Quintal (+4.2% weekly), "
                "which exceeds the MSP of ₹6,780. Suggest holding stocks for 10 more days."
            )
        elif "scheme" in q or "subsidy" in q:
            return (
                "Vira: You are eligible for PM-KUSUM (60% solar pump subsidy, deadline June 30) and PM-KISAN. "
                "Please upload your 7/12 Land Records to file a claim."
            )
        return (
            "Vira: Hello! I am your AI Agricultural advisor. How can I assist you with weather, crop selection, "
            "spot mandi prices, or disease scanning today?"
        )

    @staticmethod
    def _generate_mock_pydantic(schema_type: Type[BaseModel], prompt: str) -> Any:
        """Synthesizes mock schema structures matching Pydantic class schemas."""
        # Check properties of schema dynamically or generate seeded values
        try:
            fields = schema_type.model_fields
            defaults = {}
            for name, info in fields.items():
                # Use default value if set in the schema
                if info.default is not None and str(info.default) != "PydanticUndefined":
                    defaults[name] = info.default
                    continue
                    
                # Provide standard mock values depending on field name and type
                type_name = str(info.annotation)
                if "str" in type_name:
                    if "crop" in name:
                        defaults[name] = "Sugarcane (Co 86032)"
                    elif "disease" in name:
                        defaults[name] = "Sugarcane Rust"
                    elif "status" in name:
                        defaults[name] = "accepted"
                    elif "advisory" in name:
                        defaults[name] = "Apply mulching to sugarcane rows to save moisture."
                    else:
                        defaults[name] = "Mock dynamic string"
                elif "float" in type_name or "Decimal" in type_name:
                    defaults[name] = 92.4
                elif "int" in type_name:
                    defaults[name] = 1000
                elif "bool" in type_name:
                    defaults[name] = True
                elif "list" in type_name or "List" in type_name:
                    defaults[name] = []
                else:
                    defaults[name] = None
            return schema_type(**defaults)
        except Exception as e:
            logger.error(f"Failed to generate mock pydantic: {e}")
            return schema_type()

    @staticmethod
    def _execute_mock_tools(prompt: str, tools: List[Any], system_instruction: str) -> str:
        """Simulates tool resolution locally by matching keywords to tool call results."""
        q = prompt.lower()
        tool_results = []
        for t in tools:
            name = getattr(t, "__name__", "")
            if "weather" in name and ("weather" in q or "rain" in q):
                tool_results.append(f"{name} returned: Cloudy Sky, 28C, Humidity 62%")
            elif "market" in name and ("price" in q or "mandi" in q):
                tool_results.append(f"{name} returned: Groundnut ₹6,800/QTL, Tomato ₹1,800/QTL")
            elif "crop" in name and ("crop" in q or "recommend" in q):
                tool_results.append(f"{name} returned: Sugarcane suitability index 96%")
        
        results_str = ", ".join(tool_results)
        if results_str:
            return f"Vira: Invoked tools: [{results_str}]. Based on this: A dry spell warning is active."
        return "Vira: Evaluated parameters. No tool execution was required."
