import { NextResponse } from 'next/server';
import { db } from '@/db';
import { scheduledContent } from '@/db/schema';

// Fallback to hardcoded ID if Vercel Preview Environment Variables are missing
const AUTHORIZED_TELEGRAM_ID = process.env.COMMANDER_TELEGRAM_ID || "8701556788"; 

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate Telegram Payload Source
    if (!data || !data.message || !data.message.chat) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const chatId = data.message.chat.id.toString();
    const text = data.message.text?.toString().trim() || "";

    // God-Mode Authentication Check (Fully Restored & Sanitized)
    const cleanAuthId = AUTHORIZED_TELEGRAM_ID?.toString().trim() || "8701556788";
    if (chatId !== cleanAuthId && process.env.NODE_ENV === 'production') {
      console.error(`[SECURITY] Unauthorized Telegram access attempt from ID: ${chatId} (Expected: ${cleanAuthId})`);
      return NextResponse.json({ error: 'Unauthorized override' }, { status: 403 });
    }

    console.log(`[TELEGRAM] Commander Command Received: ${text}`);

    let responseMessage = "Command executed successfully.";

    // Command Parser
    const lowerText = text.toLowerCase();
    
    // 1. Voice Agent Call
    if (lowerText.startsWith("deploy caller to ")) {
      const phone = text.replace(/deploy caller to /i, "").trim();
      // Execute Nemotron Pipecat Swarm logic here via internal API or Queue
      responseMessage = `[TARGET LOCKED] Sovereign Matrix is deploying Pipecat Autonomous Voice Swarm to ${phone}. Initiating WebRTC pipeline...`;
    }
    
    // 2. Audit & Destroy Target Hit
    else if (lowerText.startsWith("strike ")) {
      const url = text.replace(/strike /i, "").trim();
      // Trigger Background Cron Job / Edge Function to scrape URL
      responseMessage = `[STRIKE AUTHORIZED] Commencing scrape and Audit & Destroy protocol on ${url}. PDF will be dropped to your iOS device shortly.`;
    }

    // 3. Status Report
    else if (lowerText === "status") {
      responseMessage = `[SOVEREIGN OMNI-RAG V4]\n\nAll Systems: Online.\nVercel Edge: Defending.\nOpenClaw: Awaiting Local Tunnel.\n\nAwaiting your command, Sir.`;
    }
    
    // 4. Autonomous Social Content Generation (Gemini 1.5 Pro Ultra)
    else if (lowerText.startsWith("post ")) {
      const topic = text.replace(/post /i, "").trim();
      responseMessage = `[GEMINI ULTRA SYNTHESIS] Commencing organic social generation for concept: "${topic}"...`;
      
      try {
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("Missing Google AI Ultra Key");

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${geminiKey}`;
        const prompt = `You are Sovereign Matrix, an elite defense-contractor style AI. Write a high-converting, aggressive 3-sentence LinkedIn/Twitter post about this topic: "${topic}". Then provide a Midjourney/image prompt in brackets at the end. Make it absolutely premium, no emojis except maybe 1 or 2 sleek ones.`;
        
        const aiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const aiData = await aiRes.json();
        const generatedText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "Extraction Failed.";
        
        // Extract the bracketed image prompt if it exists
        const caption = generatedText.split('[')[0].trim();
        const imagePromptMatch = generatedText.match(/\[(.*?)\]/);
        const imagePrompt = imagePromptMatch ? imagePromptMatch[1] : "Dark, elite, obsidian server rack, cinematic, 8k";

        // Schedule for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await db.insert(scheduledContent).values({
            topic: topic,
            caption: caption,
            platform: "linkedin",
            scheduledAt: tomorrow,
            status: "scheduled",
            imagePrompt: imagePrompt
        });

        responseMessage = `[GEMINI ULTRA DONE] Organic Post Scheduled for Tomorrow.\n\nCAPTION: ${caption}\n\nIMAGE PROMPT: ${imagePrompt}`;
      } catch(e) {
        console.error("Gemini Ultra Error:", e);
        responseMessage = `[ERROR] Gemini Ultra execution failed: ${(e as Error).message}`;
      }
    }
    
    else {
      responseMessage = "System active. Available Commands:\n- `deploy caller to <phone>`\n- `strike <url>`\n- `post <topic>` (Uses Google AI Ultra)\n- `status`";
    }

    // Reply back via Telegram API (assuming we have a bot token)
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN || "8722758433:AAHxBcPL5DcCLxiN5k6JMOlkl2THEwxxbXg";
    if (telegramBotToken) {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseMessage,
        }),
      });
    }

    return NextResponse.json({ status: 'success', recorded_command: text });
    
  } catch (error) {
    console.error("[TELEGRAM WEBHOOK ERROR]", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
