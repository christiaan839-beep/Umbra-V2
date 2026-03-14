import { NextResponse } from "next/server";
import { remember } from "@/lib/memory";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Autonomous Prospecting API
 * 
 * Simulates sweeping a local directory (e.g., "Dentists in Dallas"), analyzing their 
 * marketing presence via Tavily, and generating a "Gap Killer" report for cold outreach.
 */
export async function POST(req: Request) {
  try {
    const { niche, location } = await req.json();

    if (!niche || !location) {
      return NextResponse.json({ error: "Niche and location are required (e.g., 'roofing', 'austin')" }, { status: 400 });
    }

    // 1. Search for local businesses in that niche
    const searchRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: `Top 3 independent ${niche} companies in ${location} local business website. Find businesses that likely need marketing help, not massive franchises.`,
        search_depth: "basic",
        max_results: 3,
      }),
    });

    if (!searchRes.ok) throw new Error("Failed to search for local businesses");
    
    const searchData = await searchRes.json();
    const businesses = searchData.results || [];

    if (businesses.length === 0) {
      return NextResponse.json({ error: "No businesses found" }, { status: 404 });
    }

    const prospectReports = [];

    // 2. Generate Gap Reports for each
    for (const business of businesses) {
      try {
        const { text: result } = await generateText({
          model: google("gemini-2.5-pro"),
          prompt: `You are UMBRA, an elite autonomous B2B AI.
Analyze this scraped local business:
Name/URL: ${business.title} / ${business.url}
Context: ${business.content}

Detect their likely marketing gaps (e.g., no SEO, bad offer, missing schema).
Write a hyper-personalized cold email designed to book a meeting. 

CRITICAL "ANTI-SLOP" RULES:
1. NEVER say "I hope this email finds you well."
2. NEVER use emojis.
3. Keep it under 4 sentences. Brutally concise.
4. Expose their gap and offer to fix it via a "Free Audit".

Return EXACTLY valid JSON, ensuring the keys match exactly:
{
  "business_name": "${business.title || 'Unknown Business'}",
  "website": "${business.url}",
  "detected_gap": "The specific marketing flaw",
  "cold_email_subject": "3 word aggressive subject",
  "cold_email_body": "The brutally concise email body"
}`,
        });

        const cleaned = result.replace(/```json/g, "").replace(/```/g, "").trim();
        const report = JSON.parse(cleaned);
        
        prospectReports.push(report);

        // 3. Save to God-Brain for the WhatsApp Closer to recall
        await remember(`PROSPECT_REPORT for ${report.business_name} in ${location}: Gap is ${report.detected_gap}.`, {
          type: "outbound-prospect",
          niche,
          location,
          url: business.url,
        });

      } catch (e) {
        console.error(`Failed to analyze prospect ${business.url}`, e);
      }
    }

    return NextResponse.json({
      success: true,
      sweep_target: `${niche} in ${location}`,
      prospects_analyzed: prospectReports.length,
      reports: prospectReports,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    console.error("[Autonomous Prospector Error]:", error);
    return NextResponse.json({ error: "Failed to run prospecting sweep" }, { status: 500 });
  }
}
