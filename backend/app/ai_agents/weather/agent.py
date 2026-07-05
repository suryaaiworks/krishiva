import logging
from typing import TypedDict
from langgraph.graph import StateGraph, END
from app.prompts.weather_prompt import WEATHER_ADVISORY_PROMPT
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class WeatherState(TypedDict):
    location_data: dict
    prompt: str
    output: dict

async def generate_weather_node(state: WeatherState) -> dict:
    loc = state["location_data"]
    district = loc.get("district", "Pune")
    prompt = (
        f"Generate a customized agricultural weather advisory for the farmer's location: {district}. "
        f"Soil moisture parameters: {loc.get('soil_moisture', '22%')}, humidity: {loc.get('humidity', '62%')}. "
        f"Determine best irrigation windows, spraying safety thresholds, and pest warnings."
    )
    
    response_text = await GeminiService.generate_content(
        prompt=prompt,
        system_instruction=WEATHER_ADVISORY_PROMPT
    )
    
    # Check for keywords to set structured values
    favorable = "unfavorable" not in response_text.lower() and "high wind" not in response_text.lower()
    
    return {
        "output": {
            "advisory": response_text,
            "irrigation_window": "Evening (6:00 PM - 8:00 PM)",
            "spraying_favorable": favorable,
            "status": "success",
            "confidence_score": 92.0
        }
    }

class WeatherAgent:
    def __init__(self):
        self.system_prompt = WEATHER_ADVISORY_PROMPT
        
        # Initialize LangGraph StateGraph
        workflow = StateGraph(WeatherState)
        workflow.add_node("analyze", generate_weather_node)
        workflow.set_entry_point("analyze")
        workflow.add_edge("analyze", END)
        self.app = workflow.compile()
        logger.info("WeatherAgent LangGraph workflow compiled successfully.")

    async def generate_advisory(self, location_data: dict) -> dict:
        """Executes compiled Weather Advisor LangGraph workflow."""
        logger.info(f"WeatherAgent executing graph workflow for telemetry: {location_data}")
        initial_state = {
            "location_data": location_data,
            "prompt": "",
            "output": {}
        }
        res = await self.app.ainvoke(initial_state)
        return res["output"]
