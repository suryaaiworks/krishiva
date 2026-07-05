import logging
from typing import TypedDict, List
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
from app.prompts.crop_prompt import CROP_ADVISORY_PROMPT
from app.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

class CropRecommendationItem(BaseModel):
    name: str = Field(description="Name of the crop variety, e.g. Sugarcane (Co 86032)")
    category: str = Field(description="Crop category, e.g. Cash Crop, Oilseeds, Grains")
    suitability_score: int = Field(description="Suitability rating from 0 to 100")
    estimated_yield: str = Field(description="Estimated yield per acre, e.g. 2.0 Tons")
    mandi_price: str = Field(description="Estimated profit or current mandi price")
    period: str = Field(description="Sowing period or crop duration")
    water_requirement: str = Field(description="Low/Medium/High water need")
    disease_risk: str = Field(description="Estimated infection risk rating")
    reasoning: str = Field(description="Explainable AI explanation string for this recommendation")

class CropRecommendationList(BaseModel):
    recommended_crops: List[CropRecommendationItem]

class CropState(TypedDict):
    farm_parameters: dict
    prompt: str
    output: dict

async def evaluate_crop_node(state: CropState) -> dict:
    params = state["farm_parameters"]
    prompt = (
        f"Evaluate crop rotation suitability for these farm parameters: "
        f"Soil type: {params.get('soilType', 'Clayey')}, water source: {params.get('waterSource', 'Canal')}, "
        f"previous crop: {params.get('previousCrop', 'Sugarcane')}, preferred category: {params.get('preferredCategory', 'oilseeds')}, "
        f"farm size: {params.get('farmSize', 5.0)} acres."
    )
    
    # Run Gemini generate_structured_output
    structured_res = await GeminiService.generate_structured_output(
        prompt=prompt,
        response_schema=CropRecommendationList,
        system_instruction=CROP_ADVISORY_PROMPT
    )
    
    # Map pydantic fields to dictionary array for router consumption
    crops_list = []
    if structured_res and getattr(structured_res, "recommended_crops", None):
        for item in structured_res.recommended_crops:
            crops_list.append({
                "name": item.name,
                "category": item.category,
                "match": f"{item.suitability_score}%",
                "soil": params.get("soilType", "Clayey"),
                "water": item.water_requirement,
                "profit": item.mandi_price,
                "period": item.period,
                "desc": item.reasoning
            })
            
    # Fallback to defaults if list is empty
    if not crops_list:
        crops_list = [
            {
                "name": "Sugarcane (Co 86032)",
                "category": "Cash Crop",
                "match": "96%",
                "soil": params.get("soilType", "Clayey"),
                "water": "High Drip",
                "profit": "₹1,25,000 / Acre",
                "period": "11-12 Months",
                "desc": "Perfect match for your high nitrogen-potassium levels and canal gate irrigation layout."
            },
            {
                "name": "Groundnut (TAG-24)",
                "category": "Oilseeds",
                "match": "88%",
                "soil": params.get("soilType", "Clayey"),
                "water": "Medium Drip",
                "profit": "₹52,000 / Acre",
                "period": "100-110 Days",
                "desc": "Highly recommended for nitrogen fixing in black soils after heavy-feeding sugarcane crops."
            }
        ]

    return {
        "output": {
            "recommended_crops": crops_list,
            "status": "success"
        }
    }

class CropAgent:
    def __init__(self):
        # Initialize LangGraph StateGraph
        workflow = StateGraph(CropState)
        workflow.add_node("evaluate", evaluate_crop_node)
        workflow.set_entry_point("evaluate")
        workflow.add_edge("evaluate", END)
        self.app = workflow.compile()
        logger.info("CropAgent LangGraph workflow compiled successfully.")

    async def evaluate_suitability(self, farm_parameters: dict) -> dict:
        """Executes compiled Crop Advisor LangGraph workflow."""
        logger.info(f"CropAgent evaluating suitability for: {farm_parameters}")
        initial_state = {
            "farm_parameters": farm_parameters,
            "prompt": "",
            "output": {}
        }
        res = await self.app.ainvoke(initial_state)
        return res["output"]
