import pytest
from app.services.gemini_service import GeminiService
from app.config.settings import settings
settings.GEMINI_API_KEY = "" # Force mock fallback mode for unit testing
from app.services.ai_tools import (
    get_weather_forecast,
    get_mandi_prices,
    get_crop_profile,
    get_disease_report,
    get_farmer_profile,
    get_government_schemes,
    get_recent_notifications,
    get_daily_tasks,
    navigate_to
)
from app.ai_agents.weather.agent import WeatherAgent
from app.ai_agents.crop.agent import CropAgent
from app.ai_agents.disease.agent import DiseaseAgent
from app.ai_agents.market.agent import MarketAgent
from app.ai_agents.schemes.agent import SchemesAgent
from app.ai_agents.fertilizer.agent import FertilizerAgent
from app.ai_agents.recommendation.agent import RecommendationAgent
from app.ai_agents.vira.agent import ViraAgent
from pydantic import BaseModel, Field

# 1. Define dummy structured schema for testing
class DummySchema(BaseModel):
    crop: str = Field(default="Sugarcane")
    score: float = Field(default=96.4)

@pytest.mark.anyio
async def test_gemini_service_fallbacks():
    # Test text content generation under mock fallback
    res_text = await GeminiService.generate_content("What is the weather forecast today?")
    assert "vira" in res_text.lower() or "weather" in res_text.lower()

    # Test streaming generator
    chunks = list(GeminiService.generate_stream("What is the weather forecast today?"))
    assert len(chunks) > 0
    assert any("weather" in chunk.lower() or "vira" in chunk.lower() for chunk in chunks)

    # Test structured output Pydantic mappings
    res_struct = await GeminiService.generate_structured_output("Analyze crop metrics", DummySchema)
    assert res_struct.crop == "Sugarcane"
    assert res_struct.score == 96.4

@pytest.mark.anyio
async def test_ai_tools_functionality():
    # Test weather tool
    weather = get_weather_forecast("Pune")
    assert weather["district"] == "Pune"
    assert "dry spell" in weather["advisory"].lower()

    # Test market prices tool
    prices = get_mandi_prices("Groundnut")
    assert "groundnut" in prices["cropName"].lower()

    # Test crop profile tool
    profile = get_crop_profile("Sugarcane")
    assert profile["name"] == "Sugarcane"

    # Test disease report tool
    disease = get_disease_report("Rust")
    assert disease["disease_name"] == "Rust"

    # Test navigation resolver tool
    nav = navigate_to("Open My Crops")
    assert nav["route"] == "/crops"
    assert nav["action"] == "redirect"

@pytest.mark.anyio
async def test_langgraph_workflows():
    # 1. WeatherAgent workflow
    weather_agent = WeatherAgent()
    w_res = await weather_agent.generate_advisory({"district": "Pune"})
    assert "advisory" in w_res
    assert w_res["confidence_score"] == 92.0

    # 2. CropAgent workflow
    crop_agent = CropAgent()
    c_res = await crop_agent.evaluate_suitability({"soilType": "Clayey", "waterSource": "Canal"})
    assert "recommended_crops" in c_res
    assert len(c_res["recommended_crops"]) > 0

    # 3. DiseaseAgent workflow
    disease_agent = DiseaseAgent()
    d_res = await disease_agent.analyze_leaf(b"dummy_bytes")
    assert d_res["crop_name"] == "Sugarcane"
    assert d_res["disease_name"] == "Sugarcane Rust (Puccinia melanocephala)"

    # 4. MarketAgent workflow
    market_agent = MarketAgent()
    m_res = await market_agent.analyze_trends("Groundnut")
    assert m_res["crop"] == "Groundnut"
    assert m_res["status"] == "success"

    # 5. SchemesAgent workflow
    schemes_agent = SchemesAgent()
    s_res = await schemes_agent.evaluate_eligibility({"district": "Pune"})
    assert len(s_res["eligible_schemes"]) > 0

    # 6. FertilizerAgent workflow
    fertilizer_agent = FertilizerAgent()
    f_res = await fertilizer_agent.analyze_nutrients({"soil_type": "Loamy"})
    assert f_res["npk_ratio"] == "14-14-14"

    # 7. RecommendationAgent workflow
    rec_agent = RecommendationAgent()
    r_res = await rec_agent.generate_recommendation_feed("37829404-3347-4982-8370-4d1da75f0ace")
    assert len(r_res["feed"]) > 0

    # 8. ViraAgent coordinator workflow
    vira_agent = ViraAgent()
    v_res = await vira_agent.execute("Show weather warning for sugarcane", {"farmer_name": "Ramesh", "language": "Hindi"})
    assert "text" in v_res
    assert v_res["status"] == "success"
