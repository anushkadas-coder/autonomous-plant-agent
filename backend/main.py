import os
from dotenv import load_dotenv

load_dotenv()

import os
import joblib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Modern 2026 LangChain Imports
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from langchain.agents import create_agent  # The new 2026 standard
from langchain_core.messages import HumanMessage

load_dotenv() 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the brain we trained
model = joblib.load("failure_model.pkl")

# --- AI TOOLS ---
@tool
def predict_maintenance(vibration: float, heat: float, pressure: float):
    """Predicts if the machine needs maintenance based on sensor data."""
    prediction = model.predict([[vibration, heat, pressure]])[0]
    prob = model.predict_proba([[vibration, heat, pressure]])[0][1]
    return {"failure": bool(prediction), "probability": round(float(prob), 2)}

@tool
def get_repair_instructions(component: str):
    """Returns step-by-step repair steps for a specific part."""
    manuals = {
        "motor": "1. Cut power. 2. Tighten bolts. 3. Apply lubricant Type-B.",
        "pump": "1. Check seal integrity. 2. Clean intake valve. 3. Restart."
    }
    return manuals.get(component.lower(), "Refer to the general safety manual.")

# --- MODERN AGENT SETUP ---
# In v1.2.17, create_agent handles the loop and prompt logic internally
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
tools = [predict_maintenance, get_repair_instructions]

# The agent is now the runner itself!
agent = create_agent(
    llm, 
    tools=tools,
    system_prompt="You are an expert Autonomous Plant Engineer. Check health first, then decide repairs."
)

class SensorData(BaseModel):
    vibration: float
    heat: float
    pressure: float

@app.post("/analyze")
async def analyze_machine(data: SensorData):
    # We tell the Agent EXACTLY what machine it is looking at ("motor")
    query = f"Machine Type: 'motor'. Sensors: Vibration={data.vibration}, Heat={data.heat}, Pressure={data.pressure}. Check health using the prediction tool. If failure is predicted, use the repair tool to find the exact steps for a 'motor'."
    
    try:
        result = agent.invoke({"messages": [HumanMessage(content=query)]})
        return {"response": result["messages"][-1].content}
    except Exception as e:
        return {"response": f"Agent encountered an error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)