from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os

app = FastAPI(title="UMBRA V4 - Nano 30B OpenClaw Edge Bridge")

# This script lives locally and acts as the bridge between the OpenClaw OS daemon
# and the primary God-Brain server. It processes lightweight logic locally via Nano 30B.

class EdgePayload(BaseModel):
    caller: str # e.g. "Terminal", "WhatsApp", "Telegram"
    command: str
    nano_30b_analysis: str

@app.post("/api/edge/receive")
async def receive_openclaw_payload(payload: EdgePayload):
    print(f"[EDGE BRIDGE] Incoming Command from {payload.caller}")
    print(f"[NANO 30B PRE-PROCESS] Analysis: {payload.nano_30b_analysis}")
    
    # Forward to the God-Brain for heavy routing (Super 120B)
    god_brain_url = os.getenv("GOD_BRAIN_URL", "http://127.0.0.1:8000/api/v1/commander/execute")
    
    try:
        response = requests.post(
            god_brain_url, 
            json={"command": payload.command, "target_vector": "GLOBAL"}
        )
        data = response.json()
        
        return {
            "status": "success",
            "message": f"Edge execution via Nano 30B successful. Relayed to God-Brain. Status: {data.get('status')}"
        }
    except Exception as e:
        print(f"[ERROR] Connection to God-Brain Failed: {e}")
        raise HTTPException(status_code=500, detail="God-Brain uplink offline.")

if __name__ == "__main__":
    import uvicorn
    # The Edge Bridge runs on port 8001 to pass payloads to main.py on 8000
    uvicorn.run(app, host="127.0.0.1", port=8001)
