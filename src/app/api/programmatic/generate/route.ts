import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { remember } from "@/lib/memory";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const { service, city } = await req.json();

    if (!service || !city) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    // 1. Generate the highly optimized page payload
    const prompt = `You are an elite programmatic SEO engine. Generate the structured data for a hyper-localized landing page.
    Service: ${service}
    Location: ${city}

    We need highly converting copy, a solid H1, meta properties, and a perfect LocalBusiness JSON-LD block. 

    Return STRICTLY JSON:
    {
      "title": "Exact page <title>",
      "description": "Meta description (max 160 chars)",
      "h1": "Main Headline / H1 text",
      "h2": "Subheadline / H2 text",
      "heroCopy": "2-3 sentences of highly persuasive, urgency-driven copy selling this service in this specific city.",
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "schema": "<script type=\\"application/ld+json\\">...LocalBusiness schema customized for ${city}</script>"
    }`;

    const text = await ai(prompt, { system: "Return raw JSON only." });
    
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) throw new Error("Invalid output format from AI");
    
    const pageData = JSON.parse(match[0]);

    // 2. Format the URL path
    const formattedService = service.toLowerCase().replace(/\s+/g, '-');
    const formattedCity = city.toLowerCase().replace(/\s+/g, '-');
    const urlPath = `/locations/${formattedService}/${formattedCity}`;

    // 3. Save to the UMBRA God-Brain (Pinecone integration)
    // We store the exact page configuration into Pinecone memory.
    // The dynamic route will query `recall()` to instantly fetch and render this payload.
    const memoryString = `PROGRAMMATIC_PAGE_DATA: Path: ${urlPath}. Payload: ${JSON.stringify(pageData)}`;
    
    await remember(memoryString, {
      type: "programmatic-page",
      path: urlPath, // Add explicit metadata for exact route matching
      service,
      city,
      ...pageData // inject the payload entirely into metadata for instant access
    });

    return NextResponse.json({ success: true, url: urlPath, data: pageData });

  } catch (error: any) {
    console.error("[Programmatic Generator Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
