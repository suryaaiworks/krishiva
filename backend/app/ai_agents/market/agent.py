import logging
from typing import TypedDict
from langgraph.graph import StateGraph, END
from app.prompts.market_prompt import MARKET_INTELLIGENCE_PROMPT
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class MarketState(TypedDict):
    crop_name: str
    prompt: str
    output: dict

async def evaluate_market_node(state: MarketState) -> dict:
    crop = state["crop_name"]
    prompt = (
        f"Perform agricultural market analysis for: {crop}. "
        f"Evaluate current wholesale APMC price averages, supply volumes, and weekly/monthly changes. "
        f"Output a Sell, Hold, or Wait decision with a clear explainable reasoning trace."
    )
    
    response_text = await GeminiService.generate_content(
        prompt=prompt,
        system_instruction=MARKET_INTELLIGENCE_PROMPT
    )
    
    # Simple parse for decision
    decision = "Hold"
    if "sell" in response_text.lower():
        decision = "Sell Now"
    elif "wait" in response_text.lower():
        decision = "Wait"

    return {
        "output": {
            "crop": crop,
            "decision": decision,
            "decision_reason": response_text,
            "expected_diff": "+₹250 / Quintal" if decision == "Hold" else "+₹0 / Quintal",
            "risk": "Low",
            "status": "success"
        }
    }

class MarketAgent:
    def __init__(self):
        self.system_prompt = MARKET_INTELLIGENCE_PROMPT
        
        # Initialize LangGraph StateGraph
        workflow = StateGraph(MarketState)
        workflow.add_node("analyze", evaluate_market_node)
        workflow.set_entry_point("analyze")
        workflow.add_edge("analyze", END)
        self.app = workflow.compile()
        logger.info("MarketAgent LangGraph workflow compiled successfully.")

    async def analyze_trends(self, crop_name: str) -> dict:
        """Executes compiled Market Advisor LangGraph workflow."""
        logger.info(f"MarketAgent executing graph workflow for crop: {crop_name}")
        initial_state = {
            "crop_name": crop_name,
            "prompt": "",
            "output": {}
        }
        res = await self.app.ainvoke(initial_state)
        return res["output"]
