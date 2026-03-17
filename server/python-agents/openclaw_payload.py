from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
import subprocess
import shlex

app = FastAPI(title="UMBRA V4 - Nano 30B OpenClaw Edge Bridge")

# This script lives locally and acts as the bridge between the OpenClaw OS daemon
# and the primary God-Brain server. It processes lightweight logic locally via Nano 30B.

class EdgePayload(BaseModel):
    caller: str # e.g. "Terminal", "WhatsApp", "Telegram"
    command: str
    nano_30b_analysis: str
    requires_vision: bool = False

@app.post("/api/edge/receive")
async def receive_openclaw_payload(payload: EdgePayload):
    print(f"[EDGE BRIDGE] Incoming Command from {payload.caller}")
    print(f"[NANO 30B PRE-PROCESS] Analysis: {payload.nano_30b_analysis}")
    
    # -------------------------------------------------------------
    # PHASE 41 UPGRADE: PHYSICAL OS EXECUTION
    # -------------------------------------------------------------
    # Security: In production, check an ACCESS_TOKEN here.
    # We parse the command and genuinely execute it on the Mac shell.
    # Note: Complex commands or AppleScript must be safely handled.
    
    execution_result = ""
    try:
        # We assume the command is a safe shell command.
        print(f"[EXECUTING] {payload.command}")
        
        # Execute natively on Mac
        result = subprocess.run(
            payload.command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=10 # Prevent hanging
        )
        
        stdout = result.stdout.strip()
        stderr = result.stderr.strip()
        
        execution_result = stdout if stdout else (stderr if stderr else "Command executed silently.")
        print(f"[RESULT] {execution_result}")
    except subprocess.TimeoutExpired:
        execution_result = "[Timeout] Command took too long to execute locally."
    except Exception as e:
        execution_result = f"[Error executing locally] {e}"

    
    # -------------------------------------------------------------
    # PHASE 43 UPGRADE: COSMOS VLM (VISUAL TELEMETRY)
    # -------------------------------------------------------------
    vision_data = None
    if getattr(payload, 'requires_vision', False):
        print("[VISION] Capturing local macOS screen telemetry for Cosmos VLM...")
        try:
            # Requires `screencapture` on macOS
            vision_path = "/tmp/openclaw_vision_telemetry.png"
            subprocess.run(f"screencapture -x {vision_path}", shell=True)
            vision_data = f"[SCREENSHOT CAPTURED] Saved to {vision_path}. Ready for VLM routing."
            print(vision_data)
        except Exception as e:
            vision_data = f"[VISION ERROR] {e}"
            print(vision_data)

    # Optional: Still forward to the God-Brain for logging/telemetry
    god_brain_url = os.getenv("GOD_BRAIN_URL", "http://127.0.0.1:8000/api/v1/commander/execute")
    
    try:
        requests.post(
            god_brain_url, 
            json={
                "command": payload.command, 
                "target_vector": "LOCAL", 
                "result": execution_result[:500],
                "vision": vision_data
            },
            timeout=2
        )
    except:
        pass # Non-blocking if main server is offline
        
    return {
        "status": "success",
        "message": f"Edge execution via Nano 30B successful.",
        "local_execution_result": execution_result,
        "vision_telemetry": vision_data
    }

if __name__ == "__main__":
    import uvicorn
    # The Edge Bridge runs on port 8001 to pass payloads to main.py on 8000
    uvicorn.run(app, host="127.0.0.1", port=8001)
