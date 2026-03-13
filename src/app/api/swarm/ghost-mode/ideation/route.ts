import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";

/**
 * GHOST MODE IDEATION SWARM
 * 
 * Takes a seed topic, uses Tavily to find trending angles on X/LinkedIn/Reddit,
 * and uses Gemini 1.5 Pro to architect a 30-day viral content blueprint.
 */
export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Seed topic is required" }, { status: 400 });
    }

    // 1. Tavily Market Intelligence Sweep
    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `What are the most controversial or highly debated subtopics trending right now regarding: ${topic}? Site:twitter.com OR site:linkedin.com OR site:reddit.com`,
        search_depth: "advanced",
        max_results: 5,
      }),
    });

    if (!tavilyRes.ok) throw new Error("Tavily Intelligence Sweep Failed");
    
    const searchData = await tavilyRes.json();
    const marketIntel = searchData.results.map((r: any) => r.content).join("\n\n");

    // 2. Gemini Viral Architect
    const prompt = `You are the Ghost Mode Viral Architect for a $100M Enterprise Intelligence system.
Your job is to generate a 30-Day Viral Content Blueprint based on a seed topic.

Seed Topic: ${topic}
Live Market Intelligence (Trending Debates):
"""
${marketIntel.slice(0, 4000)}
"""

Using the intelligence above, generate a structured, highly provocative, and mathematically optimized 30-day content calendar.
Do NOT write the actual full posts, but write the HOOK and the ANGLE for:
- 4 High-Ticket X Threads (1 per week)
- 8 Aggressive LinkedIn Posts (2 per week)

Return ONLY a valid JSON object with the following structure:
{
  "market_thesis": "A 2-sentence summary of the prevailing market sentiment and how we will hijack it.",
  "weekly_blueprints": [
    {
      "week_number": 1,
      "theme": "The core theme for this week",
      "x_thread_hook": "A highly controversial thread hook guaranteed to get bookmark/retweets.",
      "linkedin_post_1": "A hook for LinkedIn targeting founders/B2B.",
      "linkedin_post_2": "A contrarian take for LinkedIn."
    },
    {
      "week_number": 2,
      "theme": "...",
      "x_thread_hook": "...",
      "linkedin_post_1": "...",
      "linkedin_post_2": "..."
    },
    {
      "week_number": 3,
      "theme": "...",
      "x_thread_hook": "...",
      "linkedin_post_1": "...",
      "linkedin_post_2": "..."
    },
    {
      "week_number": 4,
      "theme": "...",
      "x_thread_hook": "...",
      "linkedin_post_1": "...",
      "linkedin_post_2": "..."
    }
  ]
}`;

    const blueprintResult = await ai(prompt, {
      model: "gemini",
      system: "You are an elite AI content architect. Return ONLY valid JSON. No markdown formatting outside of the JSON.",
      maxTokens: 2000,
    });

    // Parse the JSON string from Gemini
    let parsedResult;
    try {
      parsedResult = JSON.parse(blueprintResult);
    } catch (e) {
      const cleaned = blueprintResult.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedResult = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      blueprint: parsedResult,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("[Ghost Mode Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to generate viral blueprint" }, { status: 500 });
  }
}
