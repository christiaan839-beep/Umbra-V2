import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { requireAuth } from "@/lib/auth-guard";

/**
 * Landing Page Generator API
 * 
 * Uses Gemini 2.5 Pro to generate complete landing page HTML
 * with copy, structure, and styling based on a business description.
 */
export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const { businessName, industry, offer, targetAudience, style } = await req.json();

    if (!businessName || !offer) {
      return NextResponse.json({ error: "Missing businessName or offer" }, { status: 400 });
    }

    const { text: pageHtml } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `You are an elite landing page designer and copywriter. Generate a complete, production-ready HTML landing page.

BUSINESS: ${businessName}
INDUSTRY: ${industry || "General"}
OFFER: ${offer}
TARGET AUDIENCE: ${targetAudience || "Business professionals"}
STYLE: ${style || "Modern, dark, premium"}

REQUIREMENTS:
- Output a COMPLETE, self-contained HTML page with inline CSS
- Use a dark theme with emerald/teal accent colors
- Include: hero section with headline + subheadline, 3 benefit cards, social proof section, CTA button
- The headline must be psychologically compelling (curiosity + urgency)
- ALL copy must be written for high conversion
- Include a simple contact/lead capture form
- Make it mobile-responsive
- Add subtle CSS animations (fade-in on scroll illusion via animation-delay)
- Style should feel premium, like a $10k custom design
- Include meta tags for SEO

Output ONLY the HTML code, no explanation.`,
    });

    // Generate a hero image description via Imagen
    const { text: imagePrompt } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `Create a vivid 2-sentence image description for the hero section of a landing page for "${businessName}" in the "${industry}" industry. The image should convey: trust, innovation, and premium quality. Style: photorealistic, cinematic lighting, dark tones.`,
    });

    return NextResponse.json({
      success: true,
      html: pageHtml,
      imagePrompt,
      metadata: { businessName, industry, offer, generatedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("[Page Generator Error]:", error);
    return NextResponse.json({ error: "Page generation failed" }, { status: 500 });
  }
}
