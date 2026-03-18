#!/bin/bash

echo "=============================================="
echo " SOVEREIGN MATRIX: OPENCLAW MAC NODE INSTALLER"
echo "=============================================="
echo ""
echo "[1/4] Checking for actual physical GPU architecture..."
if [[ $(uname -m) == 'arm64' ]]; then
  echo "✅ Apple Silicon Detected. Neural Engine available."
else
  echo "⚠️ Intel Mac Detected. Performance will be degraded."
fi

echo ""
echo "[2/4] Installing Ollama (God-Brain Local Runner)..."
if ! command -v ollama &> /dev/null; then
  curl -L https://ollama.ai/download/Ollama-darwin.zip -o Ollama-darwin.zip
  unzip Ollama-darwin.zip
  mv Ollama.app /Applications
  rm Ollama-darwin.zip
  echo "✅ Ollama installed into /Applications. Please open it to start the daemon."
else
  echo "✅ Ollama is already installed."
fi

echo ""
echo "[3/4] Pulling NVIDIA Nemotron-Mini-4B Open Model..."
if command -v ollama &> /dev/null; then
  echo "Executing physical pull from God-Brain Hub..."
  ollama pull nemotron-mini || ollama pull llama3
else
  echo "⚠️ Skipping pull until Ollama is started manually."
fi

echo ""
echo "[4/4] Activating Local OS Dependencies (PyAutoGUI, Playwright, ChromaDB)..."
pip install fastapi uvicorn pyautogui playwright chromadb ollama
playwright install chromium

echo ""
echo "[5/5] Activating the Local Node Bridge..."
echo "Dependencies satisfied. To link Sovereign Matrix Vercel dashboard to this physical Mac:"
echo "1. cd server/python-agents"
2. source venv/bin/activate
3. python openclaw_payload.py"
echo ""
echo "NemoClaw is now capable of local OS-control, autonomous mouse movement, and zero-fee inference."
echo ""
echo "SYSTEM READY."
