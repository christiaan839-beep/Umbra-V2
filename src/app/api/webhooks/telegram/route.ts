import { NextResponse } from "next/server";
import { executeGhostCycle } from "@/agents/ghost-mode";
import { prospectLeads } from "@/agents/prospector";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

/** helper to send messages back to telegram */
async function sendTelegramMessage(chatId: number | string, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate it's a telegram message
    if (!body?.message?.text || !body?.message?.chat?.id) {
      return NextResponse.json({ success: true }); // Always return 200 so TG doesn't retry
    }

    const chatId = body.message.chat.id;
    const text = body.message.text.trim().toLowerCase();

    // Security: Only allow the admin to use this
    if (TELEGRAM_ADMIN_CHAT_ID && String(chatId) !== String(TELEGRAM_ADMIN_CHAT_ID)) {
      await sendTelegramMessage(chatId, "⚠️ Unauthorized access attempt to UMBRA Control. Incident logged.");
      return NextResponse.json({ success: true });
    }

    // Acknowledge command receipt immediately for long-running tasks
    if (text.startsWith("/ghost")) {
      await sendTelegramMessage(chatId, "⚡ <b>UMBRA Ghost Mode</b>\n\nInitializing autonomous cycle. Evaluating campaigns and writing new copy. Stand by...");
      
      const actions = await executeGhostCycle();
      
      // Format response
      let response = "✅ <b>Ghost Cycle Complete</b>\n\n";
      response += `<b>Executed Actions: ${actions.length}</b>\n`;
      actions.forEach(a => {
        response += `• <b>${a.type}</b>: ${a.reasoning}\n`;
      });
      
      await sendTelegramMessage(chatId, response);
      return NextResponse.json({ success: true });
    }

    if (text.startsWith("/leads")) {
      const parts = body.message.text.trim().split(" ");
      const industry = parts.length > 1 ? parts.slice(1).join(" ") : "SaaS startups";
      
      await sendTelegramMessage(chatId, `🔍 <b>UMBRA Prospector</b>\n\nHunting leads in target: <i>${industry}</i>...`);
      
      const result = await prospectLeads(industry, "High-growth potential");
      
      let response = `✅ <b>Found ${result.leads.length} Qualified Leads</b>\n\n`;
      result.leads.slice(0, 3).forEach((l: any) => {
        response += `👤 <b>${l.name}</b> (${l.company})\n`;
        response += `🔥 Stage: ${l.stage.toUpperCase()} | Score: ${l.score}\n`;
        response += `✉️ ${l.email}\n\n`;
      });
      if (result.leads.length > 3) response += `<i>+ ${result.leads.length - 3} more saved to dashboard.</i>`;
      
      await sendTelegramMessage(chatId, response);
      return NextResponse.json({ success: true });
    }

    if (text === "/status") {
      await sendTelegramMessage(chatId, "🟢 <b>UMBRA Core Online</b>\n\nMemory: Nominal\nSwarm: Idle\nGhost: Standing by\n\nCommands:\n/ghost - Run ad cycle\n/leads [niche] - Hunt leads");
      return NextResponse.json({ success: true });
    }

    // Default fallback
    await sendTelegramMessage(chatId, "🔮 <b>UMBRA Awaiting Command</b>\n\nAvailable Directives:\n/ghost — Autonomous Media Buying\n/leads [industry] — AI Prospecting\n/status — System Check");
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Telegram Webhook] Error:", error);
    return NextResponse.json({ success: true }); // Always 200 so Telegram drops it
  }
}
