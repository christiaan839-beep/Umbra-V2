import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";

/**
 * Funnel Hijacker API
 * 
 * Takes a competitor URL, scrapes their value prop, pricing, and guarantees via Tavily,
 * and generates a lethal counter-campaign that positions them as obsolete.
 */
export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Competitor URL is required" }, { status: 400 });
    }

    // 1. Scrape the competitor's website
    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `What is the exact product, pricing, guarantee, and main value proposition offered on ${url}? Extract specific marketing copy and claims.`,
        search_depth: "advanced",
        include_raw_content: true,
        max_results: 3,
      }),
    });

    if (!tavilyRes.ok) {
      throw new Error(`Tavily API error: ${tavilyRes.statusText}`);
    }

    const searchData = await tavilyRes.json();
    
    // Extract the raw content from the best result, or combine snippets
    let competitorContext = "";
    if (searchData.results && searchData.results.length > 0) {
      competitorContext = searchData.results.map((r: any) => r.raw_content || r.content).join("\n\n");
    }

    if (!competitorContext) {
      return NextResponse.json({ error: "Could not extract substantial content from the competitor URL." }, { status: 400 });
    }

    const prompt = `You are UMBRA, a ruthless, elite AI marketing intelligence system trained on the direct-response frameworks of Dan Kennedy, Sabri Suby, and Eugene Schwartz.
Your goal is to destroy traditional marketing agencies and inferior SaaS products by exposing their flaws and offering an objectively superior, mathematically certain alternative.

I have scraped a competitor's website: ${url}
Here is the raw text from their site:
"""
${competitorContext.slice(0, 8000)}
"""

Analyze their exact positioning, pricing, and guarantees. Find the "Bleeding Neck" problem they are failing to solve.
Then, generate a "Lethal Counter-Campaign".

Return ONLY a valid JSON object with the following structure:
{
  "competitor_analysis": {
    "their_core_claim": "What they promise",
    "their_fatal_flaw": "Why their promise is outdated, expensive, or relies on human error (e.g., 'relying on manual labor', 'pricing based on retainers not output', 'slow turnaround')",
    "estimated_price": "What they likely charge (extract or estimate based on industry standard)"
  },
  "the_attack_vector": {
    "objection_handling": "How to handle a prospect who says 'I use ${url}' using Sabri Suby's 'Sell Like Crazy' methodology.",
    "the_wedge": "The exact sentence to say to make the prospect doubt them"
  },
  "counter_copy": {
    "ad_hook": "A short, brutal FB/IG ad hook that undercuts them without naming them directly.",
    "email_subject": "A cold email subject line to their clients (provocative, high open rate).",
    "email_body": "A 3-sentence cold email that exposes the flaw and pitches the autonomous/superior alternative. Use the 'Hook, Story, Offer' framework compressed into 3 sentences."
  }
}

Be extremely surgical, confident, and persuasive. Use a tone that is high-end ($100M enterprise) minus the corporate fluff.`;

    const hijackResult = await ai(prompt, {
      model: "gemini",
      system: "You are an elite AI direct-response copywriter. Return ONLY valid JSON. No markdown formatting, no code blocks.",
      maxTokens: 1500,
    });

    // Parse the JSON string from Gemini
    let parsedResult;
    try {
      parsedResult = JSON.parse(hijackResult);
    } catch (e) {
      // Fallback cleanup if Gemini returns markdown by mistake
      const cleaned = hijackResult.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedResult = JSON.parse(cleaned);
    }

    return NextResponse.json({
      success: true,
      target_url: url,
      hijack_data: parsedResult,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("[Funnel Hijacker Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to execute funnel hijack" }, { status: 500 });
  }
}
