from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess
import requests

app = FastAPI(title="Sovereign Matrix - Air-Gapped Edge Daemon")

# -------------------------------------------------------------
# PHASE 42 UPGRADE: TOTAL AIR-GAP (LOCAL NANO 30B)
# -------------------------------------------------------------
# This daemon NEVER touches the internet. It explicitly routes 
# all reasoning to a local LM Studio or Ollama instance 
# running directly on your Mac's Metal GPU.
# 
# Requires: `ollama run mistral` or LM Studio server on 1234
# -------------------------------------------------------------

LOCAL_OLLAMA_URL = "http://localhost:11434/api/generate"
# LOCAL_LM_STUDIO_URL = "http://localhost:1234/v1/completions"

class LocalPayload(BaseModel):
    command: str

@app.post("/api/offline/execute")
async def execute_offline_command(payload: LocalPayload):
    print(f"[OFFLINE DAEMON] Received Command: {payload.command}")
    
    # Step 1: Route to Local LLM (Air-Gapped)
    print(f"[LOCAL INFERENCE] Routing to localhost:11434 (Nano 30B)...")
    
    nano_analysis = ""
    try:
        response = requests.post(
            LOCAL_OLLAMA_URL,
            json={
                "model": "mistral", # Replace with nemotron-3-8b if downloaded
                "prompt": f"Analyze this OS command for safety: {payload.command}. Is it safe to execute locally? Answer YES or NO.",
                "stream": False
            },
            timeout=10
        )
        nano_analysis = response.json().get("response", "").strip()
        print(f"[LOCAL INFERENCE RESULT] {nano_analysis}")
    except Exception as e:
        print(f"[WARNING] Local LLM offline. Bypassing analysis. Error: {e}")
        nano_analysis = "NO - LLM Offline"

    if "YES" not in nano_analysis.upper():
        return {
            "status": "blocked",
            "message": "Local Intelligence Matrix deemed command unsafe or is offline.",
            "analysis": nano_analysis
        }

    # Step 2: Physical Execution
    print(f"[EXECUTING] {payload.command}")
    execution_result = ""
    try:
        result = subprocess.run(
            payload.command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        
        stdout = result.stdout.strip()
        stderr = result.stderr.strip()
        
        execution_result = stdout if stdout else (stderr if stderr else "Command executed silently.")
        print(f"[RESULT] {execution_result[:200]}...")
    except Exception as e:
        execution_result = f"[Error executing locally] {e}"

    return {
        "status": "success",
        "message": "Air-Gapped execution complete.",
        "local_execution_result": execution_result
    }

if __name__ == "__main__":
    import uvicorn
    # The Air-Gapped Daemon runs on port 8002 to not conflict with the default 8001
    uvicorn.run(app, host="127.0.0.1", port=8002)
