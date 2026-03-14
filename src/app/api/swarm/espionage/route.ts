import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";

/**
 * Competitor Espionage API
 * 
 * Uses Tavily Search API to scrape a competitor's website or recent news,
 * then uses Gemini 2.5 Pro to analyze the data for pricing changes, 
 * new feature launches, or strategic shifts.
 */
export async function POST(req: Request) {
  try {
    const { tenantId, competitorUrl, competitorName, focusArea } = await req.json();

    if (!competitorName || !competitorUrl) {
      return NextResponse.json({ error: "Missing competitorName or competitorUrl" }, { status: 400 });
    }

    if (!process.env.TAVILY_API_KEY) {
      return NextResponse.json({ error: "Tavily API key missing" }, { status: 500 });
    }

    // 1. Scrape competitor data using Tavily
    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `What are the latest feature updates, pricing changes, or news for ${competitorName} (${competitorUrl}) in the last month? Focus on: ${focusArea || 'general updates'}`,
        search_depth: "advanced",
        include_answer: true,
        max_results: 3
      }),
    });

    const searchData = await tavilyRes.json();
    const contextStr = searchData.results?.map((r: any) => `${r.title}\n${r.content}`).join("\n\n") || searchData.answer;

    // 2. Gemini Analysis
    const { text: analysisJson } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `You are an elite competitive intelligence agent. Analyze these recent search results about a competitor.

COMPETITOR: ${competitorName}
DATA:
${contextStr}

Analyze for:
1. Pricing changes (did they raise/lower prices?)
2. New feature launches
3. Vulnerabilities (negative reviews, outages)
4. Strategic counters (what should our agency do to beat them?)

Output EXACTLY as JSON:
{
  "pricingChanges": "...",
  "newFeatures": "...",
  "vulnerabilities": "...",
  "suggestedCounterStrike": "..."
}

Output ONLY valid JSON. Keep it punchy, cynical, and highly actionable. No fluff.`,
    });

    let analysis;
    try {
      const cleaned = analysisJson.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse analysis" }, { status: 500 });
    }

    // 3. Log to telemetry
    await db.insert(globalTelemetry).values({
      tenantId: tenantId || "system",
      eventType: "espionage_report",
      payload: JSON.stringify({ competitor: competitorName, analysis }),
    });

    // 4. Auto-Notify Telegram if a vulnerability or pricing change is found
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_OWNER_CHAT_ID) {
      const msg = `🕵️ ESPIONAGE ALERT: ${competitorName}\n\n⚠️ Vulnerabilities: ${analysis.vulnerabilities}\n⚔️ Counter-Strike: ${analysis.suggestedCounterStrike}`;
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: process.env.TELEGRAM_OWNER_CHAT_ID, text: msg }),
      });
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("[Espionage Error]:", error);
    return NextResponse.json({ error: "Espionage operation failed" }, { status: 500 });
  }
}
