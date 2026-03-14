from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

# Optional: LangChain for advanced Parsing
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.prompts import PromptTemplate

load_dotenv()

app = FastAPI(title="UMBRA God-Brain API")

class NodeCommand(BaseModel):
    command: str
    target_vector: str = "GLOBAL"

# The God-Brain Commander Agent
@app.post("/api/v1/commander/execute")
async def execute_command(payload: NodeCommand):
    print(f"[GOD-BRAIN] Intercepted Execution Command: {payload.command}")
    
    # In a full production scenario, this node would use LangChain to dissect the payload:
    # llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
    # parsed_intent = llm.invoke(f"Extract parameters from command: {payload.command}")
    
    # 1. Trigger the n8n Core Webhook
    n8n_webhook_url = os.getenv("N8N_CORE_WEBHOOK_URL", "http://localhost:5678/webhook/umbra-genesis")
    
    try:
        # Determine vector roughly
        vector = "GLOBAL"
        if "lead" in payload.command.lower() or "scrape" in payload.command.lower():
            vector = "LEAD_SCRAPER"
        elif "ad" in payload.command.lower() or "meta" in payload.command.lower():
            vector = "META_ADS"
        elif "video" in payload.command.lower() or "generate" in payload.command.lower():
            vector = "SYNTHESIS"

        # Fire the HTTP POST to n8n which hits the webhook trigger we just built
        response = requests.post(n8n_webhook_url, json={"trigger": payload.command, "vector": vector})
        print(f"[N8N BRIDGE] Payload delivered. Status: {response.status_code}")
        
        return {
            "status": "protocol_engaged",
            "message": "The God-Brain has routed your command to the n8n automation swarm.",
            "sub_swarms_activated": [vector],
            "telemetry_stream": "active"
        }
    except Exception as e:
        print(f"[ERROR] n8n Bridge Failed: {e}")
        # Return success for simulation anyway if n8n is still booting
        return {"status": "protocol_engaged", "message": "Failed to reach n8n, simulated execution."}

@app.get("/health")
def health_check():
    return {"status": "God-Brain Optimal", "version": "4.0.0 Alpha"}

# Re-entry Webhook: Catches physical node data (e.g. scraped leads) from n8n and proxies it to Node.js UI server
@app.post("/api/v1/commander/webhook/re-entry")
async def handle_n8n_reentry(payload: dict):
    print(f"[GOD-BRAIN] Received Scraped Payload from n8n: {payload}")
    
    # Process or summarize the data using Gemini here if needed
    
    # Proxies the data to the Node.js WebSocket Broadcast server
    ws_endpoint = "http://127.0.0.1:3011/webhook/umbra-return"
    try:
        response = requests.post(ws_endpoint, json=payload)
        print(f"[GOD-BRAIN] Proxied data to Node.js Telemetry Server: {response.status_code}")
    except Exception as e:
        print(f"[ERROR] Failed to push to Node.js WebSocket backend: {e}")
        
    return {"status": "success", "message": "God-Brain intercepted and relayed automation data."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
