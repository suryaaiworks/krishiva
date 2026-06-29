from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END

# Define Agent State
class AgentState(TypedDict):
    messages: List[Dict[str, Any]]
    active_scenario: str
    user_context: Dict[str, Any]
    next_node: str

def routing_node(state: AgentState) -> AgentState:
    """Evaluates query intent and routes to weather, market, or advisor node."""
    messages = state.get("messages", [])
    if not messages:
        state["next_node"] = "advisor"
        return state

    last_query = messages[-1].get("content", "").lower()
    
    if "weather" in last_query or "rain" in last_query:
        state["next_node"] = "weather"
    elif "price" in last_query or "market" in last_query or "sell" in last_query:
        state["next_node"] = "market"
    else:
        state["next_node"] = "advisor"
        
    return state

def advisor_node(state: AgentState) -> AgentState:
    """Core agronomist advisor node logic (mocked)."""
    state["messages"].append({
        "role": "assistant",
        "content": "Kisan AI Agronomist: Under review of your soil and crop status, we advise nitrogen boosts."
    })
    return state

def weather_node(state: AgentState) -> AgentState:
    """Farming weather advisory node logic (mocked)."""
    state["messages"].append({
        "role": "assistant",
        "content": "Kisan AI Weather Advisor: Light shower forecasts indicate optimal timing for weeding."
    })
    return state

def market_node(state: AgentState) -> AgentState:
    """Market price opportunity advisory node logic (mocked)."""
    state["messages"].append({
        "role": "assistant",
        "content": "Kisan AI Market Advisor: Sugarcane B2B buyer indices show standard demand levels."
    })
    return state

# Compile the placeholder LangGraph state machine
workflow = StateGraph(AgentState)

workflow.add_node("router", routing_node)
workflow.add_node("advisor", advisor_node)
workflow.add_node("weather", weather_node)
workflow.add_node("market", market_node)

workflow.set_entry_point("router")

# Define routing transitions
def route_decision(state: AgentState) -> str:
    return state.get("next_node", "advisor")

workflow.add_conditional_edges(
    "router",
    route_decision,
    {
        "advisor": "advisor",
        "weather": "weather",
        "market": "market"
    }
)

workflow.add_edge("advisor", END)
workflow.add_edge("weather", END)
workflow.add_edge("market", END)

agent_graph = workflow.compile()
