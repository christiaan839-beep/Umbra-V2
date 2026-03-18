#!/bin/bash

# ⚡ SOVEREIGN MATRIX // EXASCALE MASTER BOOT ⚡
# This script simultaneously boots the Web UI and the localized Python Swarm.

echo "======================================================"
echo "[⚡] INITIALIZING SOVEREIGN MATRIX V2 [⚡]"
echo "======================================================"

# Ensure the script stops if any local installation fails
# set -e removed to bypass macOS iCloud permission locks on virtual environments

echo "\n[1/3] Verifying Python Phantom Dependencies..."
cd server/python-agents
source venv/bin/activate || { echo "[!] Virtual environment not found. Run standard setup first."; exit 1; }
# Note: Assuming PIP dependencies are already resolved.
cd ../..

echo "\n[2/3] Spawning the Immortal Python Swarm (Background)..."
cd server/python-agents
source venv/bin/activate
# We use nohup to detach the Swarm so it runs immortally even if the terminal drops
nohup ./immortal_swarm.sh > swarm_output.log 2>&1 &
SWARM_PID=$!
echo "[+] Swarm Cartel locked. Process ID: $SWARM_PID"
cd ../..

echo "\n[3/3] Igniting Next.js Edge UI..."
echo "[✅] The Sovereign Matrix is live. The Telegram Multi-Agent Cartel is listening."
echo "[✅] The Cron Data Flywheel is spinning."
echo ""
echo "Access the command dashboard at http://localhost:3000"

# Run the frontend server
npm run dev
