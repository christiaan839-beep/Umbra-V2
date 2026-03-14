#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# UMBRA TELEGRAM COMMAND CENTER — ACTIVATION SCRIPT
# ═══════════════════════════════════════════════════════════════
#
# This script activates the Telegram Command Center for UMBRA.
# You need two things from Telegram:
#
# 1. BOT TOKEN:
#    - Open Telegram and message @BotFather
#    - Send /newbot
#    - Choose a name (e.g., "UMBRA Command Center")
#    - Choose a username (e.g., "umbra_sovereign_bot")
#    - Copy the API token BotFather gives you
#
# 2. YOUR CHAT ID:
#    - Message @userinfobot on Telegram
#    - It will reply with your Chat ID (a number like 123456789)
#
# ═══════════════════════════════════════════════════════════════

set -e

ENV_FILE=".env.local"
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m' # No Color

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "   UMBRA TELEGRAM COMMAND CENTER — ACTIVATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Prompt for Bot Token
read -p "$(echo -e "${YELLOW}Enter your Telegram Bot Token: ${NC}")" BOT_TOKEN
if [ -z "$BOT_TOKEN" ]; then
  echo -e "${RED}Error: Bot Token is required.${NC}"
  exit 1
fi

# Prompt for Chat ID
read -p "$(echo -e "${YELLOW}Enter your Telegram Chat ID: ${NC}")" CHAT_ID
if [ -z "$CHAT_ID" ]; then
  echo -e "${RED}Error: Chat ID is required.${NC}"
  exit 1
fi

# Update .env.local
if [ -f "$ENV_FILE" ]; then
  # Replace existing placeholders or add new entries
  if grep -q "TELEGRAM_BOT_TOKEN" "$ENV_FILE"; then
    sed -i.bak "s|TELEGRAM_BOT_TOKEN=.*|TELEGRAM_BOT_TOKEN=${BOT_TOKEN}|" "$ENV_FILE"
    echo -e "${GREEN}✅ Updated TELEGRAM_BOT_TOKEN in ${ENV_FILE}${NC}"
  else
    echo "TELEGRAM_BOT_TOKEN=${BOT_TOKEN}" >> "$ENV_FILE"
    echo -e "${GREEN}✅ Added TELEGRAM_BOT_TOKEN to ${ENV_FILE}${NC}"
  fi

  if grep -q "TELEGRAM_OWNER_CHAT_ID" "$ENV_FILE"; then
    sed -i.bak "s|TELEGRAM_OWNER_CHAT_ID=.*|TELEGRAM_OWNER_CHAT_ID=${CHAT_ID}|" "$ENV_FILE"
    echo -e "${GREEN}✅ Updated TELEGRAM_OWNER_CHAT_ID in ${ENV_FILE}${NC}"
  else
    echo "TELEGRAM_OWNER_CHAT_ID=${CHAT_ID}" >> "$ENV_FILE"
    echo -e "${GREEN}✅ Added TELEGRAM_OWNER_CHAT_ID to ${ENV_FILE}${NC}"
  fi

  # Clean up backup
  rm -f "${ENV_FILE}.bak"
else
  echo "TELEGRAM_BOT_TOKEN=${BOT_TOKEN}" > "$ENV_FILE"
  echo "TELEGRAM_OWNER_CHAT_ID=${CHAT_ID}" >> "$ENV_FILE"
  echo -e "${GREEN}✅ Created ${ENV_FILE} with Telegram credentials${NC}"
fi

# Verify the bot token works
echo ""
echo "Verifying bot token..."
RESPONSE=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe")
if echo "$RESPONSE" | grep -q '"ok":true'; then
  BOT_NAME=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['username'])" 2>/dev/null || echo "Unknown")
  echo -e "${GREEN}✅ Bot verified: @${BOT_NAME}${NC}"
else
  echo -e "${RED}⚠️  Bot token verification failed. Check the token and try again.${NC}"
fi

# Restart n8n if running
if docker ps --format '{{.Names}}' | grep -q "umbra-n8n"; then
  echo ""
  echo "Restarting n8n orchestrator..."
  docker restart umbra-n8n-orchestrator
  echo -e "${GREEN}✅ n8n restarted with new Telegram credentials${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}   TELEGRAM COMMAND CENTER ACTIVATED${NC}"
echo "   Send /help to your bot to test the connection."
echo "═══════════════════════════════════════════════════════════"
echo ""
