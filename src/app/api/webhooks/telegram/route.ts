import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate Telegram Webhook Secret Token (if provided in URL or headers)
    // Telegram usually sends payload looking like:
    // { "update_id": 10000, "message": { "date": 1441645532, "chat": { "last_name": "Test Lastname", "id": 1111111, "first_name": "Test Firstname", "username": "Testusername" }, "message_id": 1365, "from": { "last_name": "Test Lastname", "id": 1111111, "first_name": "Test Firstname", "username": "Testusername" }, "text": "/start" } }
    
    const message = body.message;
    if (!message || !message.chat || !message.text) {
      return NextResponse.json({ success: true }); // Acknowledge to stop Telegram from retrying
    }

    const chatId = message.chat.id.toString();
    const authorizedChatId = process.env.TELEGRAM_OWNER_CHAT_ID;

    if (authorizedChatId && chatId !== authorizedChatId) {
      console.warn(`[Command Center] Unauthorized access attempt from Chat ID: ${chatId}`);
      return NextResponse.json({ success: true, message: "Unauthorized" });
    }

    const text = message.text.trim();
    console.log(`[Command Center] Received payload: "${text}"`);

    // Route command logic
    // We send this to the live n8n orchestrator or native Mistral pipeline
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n.your-agency.com/webhook/omnidirector";
    
    try {
      await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "telegram",
          chatId,
          command: text,
          timestamp: new Date().toISOString()
        })
      });
    } catch (err) {
      console.error("[Command Center] Failed to forward to n8n:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Command Center Error]:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
