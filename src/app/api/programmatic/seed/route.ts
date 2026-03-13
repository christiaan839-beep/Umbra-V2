import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { remember } from "@/lib/memory";

/**
 * Pre-Seed SEO Content API
 * 
 * Generates programmatic SEO pages for multiple city-service combinations
 * and stores them in the God-Brain for instant rendering.
 */

const SERVICES = [
  "dental-marketing",
  "roofing-leads",
  "hvac-marketing",
  "plumber-seo",
  "chiropractor-marketing",
];

const CITIES = [
  "dallas", "houston", "austin", "san-antonio", "miami",
  "orlando", "tampa", "atlanta", "phoenix", "las-vegas",
];

export async function POST(req: Request) {
  try {
    const { count = 10 } = await req.json().catch(() => ({ count: 10 }));
    const limit = Math.min(count, 50);
    const results: { service: string; city: string; path: string }[] = [];

    // Generate pages
    for (let i = 0; i < limit; i++) {
      const service = SERVICES[i % SERVICES.length];
      const city = CITIES[i % CITIES.length];
      const path = `/locations/${service}/${city}`;

      const prompt = `Generate a JSON object for a local SEO landing page. The service is "${service.replace(/-/g, " ")}" and the city is "${city}".

Return ONLY valid JSON with these fields:
{
  "title": "SEO-optimized page title",
  "description": "Meta description (155 chars max)",
  "h1": "Main heading",
  "intro": "2-paragraph compelling intro (200 words)",
  "benefits": ["benefit1", "benefit2", "benefit3", "benefit4"],
  "cta": "Call to action text",
  "schema": { "@type": "LocalBusiness", "name": "...", "address": { "addressLocality": "${city}", "addressRegion": "..." } }
}`;

      try {
        const content = await ai(prompt, {
          model: "gemini",
          system: "You are an elite SEO copywriter. Return only valid JSON, no markdown.",
          maxTokens: 800,
        });

        // Store in God-Brain
        await remember(`PROGRAMMATIC_PAGE_DATA for ${service} in ${city}: ${content}`, {
          type: "programmatic-page",
          service,
          city,
          path,
          content,
        });

        results.push({ service, city, path });
      } catch (e) {
        console.error(`[SEO Seed] Failed for ${service}/${city}:`, e);
      }
    }

    return NextResponse.json({
      success: true,
      pagesGenerated: results.length,
      pages: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[SEO Seed] Error:", error);
    return NextResponse.json({ error: "SEO seeding failed" }, { status: 500 });
  }
}
