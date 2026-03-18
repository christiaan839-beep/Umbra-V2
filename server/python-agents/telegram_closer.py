import asyncio
import ollama
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import os

# ⚡ SOVEREIGN MATRIX // $0 OLLAMA TELEGRAM CLOSER ⚡
# Replaces the Twilio WhatsApp API ($)
# Replaces the Google Gemini API ($)
# Uses local Llama3 and the Free Telegram API structurally.

SYSTEM_PROMPT = """
You are the elite Account Director for Sovereign Matrix. 
A client is messaging you on Telegram. 
Your goal is to confidently negotiate a $5,000/mo retainer without sounding like an AI.
Keep answers remarkably short (1-2 sentences). You are extremely busy and competent.
"""

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    username = update.message.from_user.username
    print(f"\n[INBOUND] Client @{username} asks: {user_text}")

    # Generate Response Locally via Ollama (Zero Cost)
    print("[*] Reasoning local strategy via llama3...")
    try:
        response = ollama.chat(model='llama3', messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': user_text}
        ])
        reply = response['message']['content']
        print(f"[OUTBOUND] Sending: {reply}")
        
        await update.message.reply_text(reply)
    except Exception as e:
        print(f"[!] OLLAMA OFFLINE ERROR: {e}")
        await update.message.reply_text("We are processing your request. Please hold.")

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Welcome to Sovereign Matrix. How can our Swarm architect your growth today?")

def main():
    # The Bot Token is retrieved from Telegram @BotFather (100% Free)
    TOKEN = os.getenv("TELEGRAM_CLOSER_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN_HERE")
    
    if TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        print("[!] CRITICAL: TELEGRAM_CLOSER_TOKEN environment variable is not set.")
        return

    print("[⚡] Booting Sovereign Local Telegram Closer...")
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("[✅] Agent Online. Intercepting Client Messages at $0.00/mo.")
    application.run_polling()

if __name__ == '__main__':
    main()
