import asyncio
import ollama
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import os

# ⚡ SOVEREIGN MATRIX // MULTI-AGENT CARTEL ⚡
# Derived from NVIDIA DGX Spark "Multi-Agent Chatbot" Playbook.
# Instead of one AI answering Telegram, a routing node dispatches 
# inbound leads to specialized specialized AIs (The Tech Lead vs The Closer).

# Specialized Persona Prompts
ROUTER_PROMPT = """You are the Router. Analyze the user's message. 
If they ask about price, cost, or hiring us, output exactly: CLOSER
If they ask about tech, code, frameworks, or how it works, output exactly: TECH_LEAD
Otherwise, output exactly: CLOSER
"""

CLOSER_PROMPT = """
You are the elite Account Director for Sovereign Matrix. 
A client is messaging you on Telegram. Your goal is to negotiate a $5,000/mo retainer confidently. 
You are dealing with a business owner. Keep it short, arrogant, and highly competent.
"""

TECH_LEAD_PROMPT = """
You are the brilliant Lead Engineer for Sovereign Matrix. 
A client on Telegram is asking technical questions. Explain our usage of NVIDIA NIM, Next.js, 
and Vercel Edge functions. Be extremely precise, use technical jargon, but remain accessible. Keep it to 2 sentences.
"""

async def route_and_respond(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    username = update.message.from_user.username
    print(f"\n[INBOUND] Client @{username}: {user_text}")

    # Phase 1: The Router Agent
    print("[*] Agent 1 (Router) analyzing intent...")
    try:
        router_res = ollama.chat(model='llama3', messages=[
            {'role': 'system', 'content': ROUTER_PROMPT},
            {'role': 'user', 'content': user_text}
        ])
        intent = router_res['message']['content'].strip()
        print(f"[*] Routing Decision: {intent}")

        # Phase 2: The Specialized Agent Strike
        active_prompt = TECH_LEAD_PROMPT if "TECH_LEAD" in intent else CLOSER_PROMPT
        active_role = "Tech Lead" if "TECH" in intent else "Account Director"
        
        print(f"[*] Agent 2 ({active_role}) generating response...")
        response = ollama.chat(model='llama3', messages=[
            {'role': 'system', 'content': active_prompt},
            {'role': 'user', 'content': user_text}
        ])
        
        reply = response['message']['content']
        print(f"[OUTBOUND - {active_role}]: {reply}")
        await update.message.reply_text(reply)
        
    except Exception as e:
        print(f"[!] Cartel Communication Error: {e}")
        await update.message.reply_text("Matrix offline. Re-initializing Tensor Nodes.")

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Sovereign Matrix Cartel Online. What parameter do you wish to negotiate?")

def main():
    TOKEN = os.getenv("TELEGRAM_CLOSER_TOKEN", "YOUR_TELEGRAM_BOT_TOKEN_HERE")
    if TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        print("[!] CRITICAL: TELEGRAM_CLOSER_TOKEN environment variable not set.")
        return

    print("[⚡] Booting Sovereign Multi-Agent Cartel...")
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, route_and_respond))

    print("[✅] Agent Cartel Live. Waiting for inbound leads.")
    application.run_polling()

if __name__ == '__main__':
    main()
