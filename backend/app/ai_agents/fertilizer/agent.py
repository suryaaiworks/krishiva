import logging
from typing import TypedDict
from langgraph.graph import StateGraph, END
from app.prompts.fertilizer_prompt import FERTILIZER_ADVISOR_PROMPT
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class FertilizerState(TypedDict):
    soil_report: dict
    prompt: str
    output: dict

async def evaluate_fertilizer_node(state: FertilizerState) -> dict:
    report = state["soil_report"]
    prompt = (
        f"Suggest optimal fertilizer mixture for these parameters: "
        f"Soil type: {report.get('soil_type', 'Clayey')}, NPK values: {report.get('npk', 'N:40, P:25, K:30')}, "
        f"pH: {report.get('pH', '6.8')}, active crop growth stage: {report.get('growth_stage', 'Vegetative')}."
    )
    
    response_text = await GeminiService.generate_content(
        prompt=prompt,
        system_instruction=FERTILIZER_ADVISOR_PROMPT
    )

    return {
        "output": {
            "npk_ratio": "14-14-14",
            "recommended_fertilizer": response_text,
            "status": "success"
        }
    }

class FertilizerAgent:
    def __init__(self):
        self.system_prompt = FERTILIZER_ADVISOR_PROMPT
        
        # Initialize LangGraph StateGraph
        workflow = StateGraph(FertilizerState)
        workflow.add_node("analyze", evaluate_fertilizer_node)
        workflow.set_entry_point("analyze")
        workflow.add_edge("analyze", END)
        self.app = workflow.compile()
        logger.info("FertilizerAgent LangGraph workflow compiled successfully.")

    async def analyze_nutrients(self, soil_report: dict) -> dict:
        """Executes compiled Fertilizer Advisor LangGraph workflow."""
        logger.info(f"FertilizerAgent executing graph workflow for report: {soil_report}")
        initial_state = {
            "soil_report": soil_report,
            "prompt": "",
            "output": {}
        }
        res = await self.app.ainvoke(initial_state)
        return res["output"]
