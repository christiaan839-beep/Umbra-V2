import { NextResponse } from "next/server";
import { research_ai } from "@/lib/ai";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const body = await req.json();
    const { skill } = body;

    let resultJson = "";

    switch (skill) {
      case "gap-killer": {
        const { urls, niche } = body;
        if (!urls || urls.length === 0 || !niche) {
          return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }
        
        const query = urls.map((u: string) => `site:${u}`).join(" OR ") + ` ${niche} services pricing strategy content`;
        const prompt = `Analyze these competitors in the ${niche} space based on the provided web search context.
        We need to defeat them. Find what they are missing and give us 5 highly executable blog topics to steal their traffic.
        
        Return STRICTLY in this JSON format:
        {
          "vulnerabilities": {
            "content": ["gap 1 found", "gap 2 found"],
            "trust": ["missing trust signal 1", "missing trust signal 2"]
          },
          "topics": [
            {
              "title": "Exact Title to Use",
              "description": "Why this works to steal traffic",
              "intent": "High/Commercial/Informational"
            }
          ] // Exactly 5 topics
        }`;

        resultJson = await research_ai(query, prompt, { system: "You are an elite SEO hacker and growth marketer. Return only RAW JSON." });
        break;
      }

      case "gbp-hijack": {
        const { competitorUrl, city } = body;
        if (!competitorUrl || !city) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

        const query = `site:${competitorUrl} OR "${competitorUrl}" Google Business Profile Google Maps reviews local SEO ${city}`;
        const prompt = `Analyze this competitor's local presence in ${city}.
        Identify their fatal weakness in local SEO. Then generate 10 highly engaging, urgency-driven local Google Business Profile posts for OUR business to hijack the map pack in ${city}.

        Use local landmarks, strong CTAs, and keyword variations.
        
        Return STRICTLY in this JSON format:
        {
          "competitorWeakness": "1-2 sentences on what they fail at.",
          "ourAngle": "Our counter-attack strategy.",
          "posts": [
            {
              "content": "The actual 2-3 sentence post copy...",
              "ctaType": "Call Now | Learn More | Book Online",
              "landmark": "Local landmark or neighborhood in ${city}",
              "keyword": "Main keyword targeted"
            }
          ] // exactly 10 posts
        }`;

        resultJson = await research_ai(query, prompt, { system: "You are a local SEO dominance expert. Return only RAW JSON." });
        break;
      }

      case "schema-audit": {
        const { url } = body;
        if (!url) return NextResponse.json({ error: "Missing parameters" }, { status: 400 });

        const query = `site:${url} schema markup JSON-LD structured data LocalBusiness`;
        const prompt = `Audit the technical SEO and Schema markup for ${url} based on the search context.
        Assume they are a local business. Most businesses have weak or missing LocalBusiness JSON-LD schema.
        We need an audit verdict and the EXACT missing JSON-LD code block that they need to inject into their <head>.

        Make the generated code an accurate LocalBusiness schema template filled with whatever info you could find about them or placeholder text (e.g., [Insert Phone Number]).

        Return STRICTLY in this JSON format:
        {
          "verdict": "useful | weak | critical",
          "summary": "1 sentence verdict explanation",
          "missing": [
            { "element": "e.g., telephone", "priority": "HIGH" },
            { "element": "e.g., geo coordinates", "priority": "MEDIUM" }
          ],
          "generatedCode": "<script type=\\"application/ld+json\\">\\n{ \\n  \\"@context\\": \\"https://schema.org\\",\\n...\\n}\\n</script>"
        }`;

        resultJson = await research_ai(query, prompt, { system: "You are a top-tier technical SEO developer. Return only RAW JSON." });
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown skill" }, { status: 400 });
    }

    // Attempt to extract JSON if LLM wrapped it in markdown code blocks
    const match = resultJson.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) {
        throw new Error("Invalid output format from AI");
    }

    const parsedData = JSON.parse(match[0]);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("[Skill Execution Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
