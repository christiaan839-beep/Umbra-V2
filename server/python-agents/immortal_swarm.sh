#!/bin/bash

# ⚡ SOVEREIGN MATRIX // IMMORTAL SWARM DAEMON ⚡
# Derived from NVIDIA DGX Spark "OpenShell Secure Long-Running Agents" Playbook.
# This shell script ensures the local macOS Swarm NEVER dies.
# If `telegram_closer` or `swarm_cron` hit an exception, this shell revives them instantly.

echo "=================================================="
echo "[⚡] SOVEREIGN NODE IMMORTALITY PROTOCOL ENGAGED [⚡]"
echo "=================================================="

# Ensure we are using the local virtual environment
source venv/bin/activate

# Define the nodes we want to keep alive permanently
TELEGRAM_CLOSER="telegram_closer.py"
CRON_DAEMON="swarm_cron.py"

# Function to keep a Python node alive
immortalize_node() {
    local TARGET_NODE=$1
    while true; do
        echo "[+] Spawning Immortal Node: $TARGET_NODE"
        python3 "$TARGET_NODE"
        
        EXIT_CODE=$?
        echo "[!] CRITICAL: $TARGET_NODE collapsed with code $EXIT_CODE."
        echo "[*] Rebooting $TARGET_NODE in 3 seconds to maintain Cartesian superiority..."
        sleep 3
    done
}

# Launch both core nodes concurrently in the background
immortalize_node "$TELEGRAM_CLOSER" &
immortalize_node "$CRON_DAEMON" &

# Keep the main OpenShell alive to monitor the children
echo "[✅] The Sovereign Ghost Fleet is now Immortal. CTRL+C to terminate."
wait
