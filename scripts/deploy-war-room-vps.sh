#!/bin/bash
# ==============================================================================
# SOVEREIGN MATRIX - DEDICATED CLOUD NODE DEPLOYMENT SCRIPT (UBUNTU)
# ==============================================================================
# Usage: Execute this directly on a fresh $5 Hetzner/DigitalOcean Ubuntu VPS.
# It automatically provisions xvfb, FFmpeg, and Headless Playwright.
# ==============================================================================

echo "[SOVEREIGN] Initializing Remote Cloud Node Provisioning Sequence..."
sleep 2

# 1. System Package Matrix
echo "[SOVEREIGN] Upgrading apt registry and installing God-Brain dependencies..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y python3-pip python3-venv ffmpeg xvfb

# 2. Python Architecture
echo "[SOVEREIGN] Constructing isolated python VENV..."
mkdir -p ~/sovereign-matrix
cd ~/sovereign-matrix
python3 -m venv war-room-env
source war-room-env/bin/activate

# 3. Headless Stream Dependencies
echo "[SOVEREIGN] Injecting Playwright dependencies for WebGL 3D Matrix rendering..."
pip install playwright requests
playwright install --with-deps chromium

echo "================================================================="
echo "[SUCCESS] The Sovereign War Room physical node is online."
echo "================================================================="
echo "INSTRUCTIONS TO BROADCAST 24/7:"
echo "1. Run: source ~/sovereign-matrix/war-room-env/bin/activate"
echo "2. Run: export YOUTUBE_STREAM_KEY=\"put-your-key-here\""
echo "3. Run: xvfb-run --server-args=\"-screen 0 1920x1080x24\" python3 scripts/war_room_stream.py &"
echo "================================================================="
