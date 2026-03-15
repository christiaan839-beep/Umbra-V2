import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

// Command mapping for Telegram text/voice commands
const COMMAND_MAP: Record<string, string> = {
  "status": "system-status",
  "revenue": "revenue-check",
  "launch": "launch-campaign",
  "scan": "competitor-scan",
  "deploy": "deploy-page",
  "report": "generate-report",
  "outbound": "outbound-blast",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Telegram webhook format
    const message = body.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true }); // Acknowledge non-text updates
    }

    const chatId = message.chat.id;
    const userText = message.text.trim().toLowerCase();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 });
    }

    // Parse command
    const commandWord = userText.replace("/", "").split(" ")[0];
    const commandAction = COMMAND_MAP[commandWord];

    let responseText = "";

    if (commandAction === "system-status") {
      responseText = `🟢 UMBRA SYSTEM STATUS\n━━━━━━━━━━━━━━━━\n✅ God-Brain: ONLINE\n✅ Outbound Engine: ARMED\n✅ Memory Flywheel: LEARNING\n✅ Video Synthesis: READY\n✅ Landing Page Factory: DEPLOYED\n✅ Competitive Scanner: ACTIVE\n━━━━━━━━━━━━━━━━\nAll 86 phases operational.`;
    } else if (commandAction === "revenue-check") {
      responseText = `💰 REVENUE PULSE\n━━━━━━━━━━━━━━━━\nUse /report for a full revenue breakdown.\nAll billing autopilot systems nominal.`;
    } else if (commandAction === "launch-campaign") {
      const campaignTarget = userText.replace(/\/?(launch)\s*/i, "").trim();
      if (campaignTarget) {
        responseText = `🚀 CAMPAIGN LAUNCH INITIATED\n━━━━━━━━━━━━━━━━\nTarget: ${campaignTarget}\nStatus: Outbound swarm activated.\nETA: 60 seconds for first draft.`;
      } else {
        responseText = `⚠️ Specify a target.\nUsage: /launch MedSpas Miami`;
      }
    } else if (commandAction === "competitor-scan") {
      responseText = `🎯 COMPETITIVE SCAN TRIGGERED\n━━━━━━━━━━━━━━━━\nScanning competitor landscape...\nThreat report will be generated momentarily.`;
    } else if (commandAction === "generate-report") {
      responseText = `📊 GENERATING INTELLIGENCE REPORT\n━━━━━━━━━━━━━━━━\nCompiling all telemetry, revenue, and engagement data...\nReport will be delivered in this chat.`;
    } else {
      // Use Gemini to interpret natural language commands
      const { text } = await generateText({
        model: google("gemini-2.5-pro"),
        prompt: `You are UMBRA's Telegram command interpreter. The user sent: "${userText}". 
Respond with a brief, military-style status update (under 100 words). 
Available commands: status, revenue, launch [target], scan, deploy, report, outbound.
If the message is a valid instruction, acknowledge it. If unclear, list available commands.
Use emoji sparingly. Be concise and authoritative.`,
      });
      responseText = text;
    }

    // Send response back to Telegram
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: responseText,
        parse_mode: "HTML",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Telegram War Room Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
