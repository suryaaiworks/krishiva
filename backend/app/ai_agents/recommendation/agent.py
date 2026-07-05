import logging
from typing import TypedDict
from langgraph.graph import StateGraph, END
from app.prompts.farm_planning_prompt import FARM_PLANNING_PROMPT
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class RecommendationState(TypedDict):
    user_id: str
    prompt: str
    output: dict

async def evaluate_recommendation_node(state: RecommendationState) -> dict:
    uid = state["user_id"]
    prompt = (
        f"Generate a customized daily/weekly farm planning action schedule for farmer UUID: {uid}. "
        f"Check weather warnings, soil status, crop growth stages, and mandi price trends. "
        f"Provide explainable AI reasons and confidence percentages."
    )
    
    response_text = await GeminiService.generate_content(
        prompt=prompt,
        system_instruction=FARM_PLANNING_PROMPT
    )

    return {
        "output": {
            "feed": [
                {
                    "type": "weather",
                    "text": "Schedule evening micro-irrigation to conserve soil moisture. High evaporation expected.",
                    "explanation": "Recommended because rain probability is low (10%) and temperature is high (32°C).",
                    "confidence": 94.0
                },
                {
                    "type": "pest",
                    "text": "Sugarcane rust risk is moderate in Pune due to high morning humidity.",
                    "explanation": "Recommended because relative humidity levels exceed 85% during morning hours.",
                    "confidence": 88.0
                },
                {
                    "type": "market",
                    "text": "APMC Mandi prices for Groundnut (TAG-24) are up by 4.2%. Sell now or wait 10 days.",
                    "explanation": "Recommended because wholesale demand coefficient is high and MSP limits are cleared.",
                    "confidence": 90.0
                }
            ],
            "analysis_detail": response_text,
            "status": "success"
        }
    }

class RecommendationAgent:
    def __init__(self):
        self.system_prompt = FARM_PLANNING_PROMPT
        
        # Initialize LangGraph StateGraph
        workflow = StateGraph(RecommendationState)
        workflow.add_node("evaluate", evaluate_recommendation_node)
        workflow.set_entry_point("evaluate")
        workflow.add_edge("evaluate", END)
        self.app = workflow.compile()
        logger.info("RecommendationAgent LangGraph workflow compiled successfully.")

    async def generate_recommendation_feed(self, user_id: str) -> dict:
        """Executes compiled Recommendation Advisor LangGraph workflow."""
        logger.info(f"RecommendationAgent executing graph workflow for user: {user_id}")
        initial_state = {
            "user_id": user_id,
            "prompt": "",
            "output": {}
        }
        res = await self.app.ainvoke(initial_state)
        return res["output"]
