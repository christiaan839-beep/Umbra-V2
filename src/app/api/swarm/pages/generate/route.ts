import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { keyword, niche, location, style } = await req.json();

    if (!keyword || !niche) {
      return NextResponse.json({ error: "Missing keyword or niche." }, { status: 400 });
    }

    const systemPrompt = `You are the UMBRA AI Landing Page Factory. You generate complete, production-ready landing page code (HTML with inline Tailwind CSS via CDN) optimized for SEO and conversion.

OUTPUT FORMAT: Return ONLY a valid JSON object with these exact keys:
- "title": The SEO page title (under 60 chars)
- "metaDescription": SEO meta description (under 160 chars)  
- "slug": URL-friendly slug
- "html": Complete HTML document with Tailwind CDN, fully styled landing page
- "targetKeyword": The primary keyword being targeted
- "estimatedSearchVolume": Rough search volume estimate

RULES:
1. No markdown or backticks outside the JSON.
2. The HTML must be a COMPLETE standalone document with <!DOCTYPE html>.
3. Use Tailwind CSS via CDN (https://cdn.tailwindcss.com).
4. Include: hero section, benefits, social proof, FAQ, CTA.
5. Dark mode aesthetic with premium feel.
6. Include proper Open Graph meta tags.
7. All content must be hyper-relevant to "${keyword}" in "${niche}".`;

    const userPrompt = `Generate a high-converting landing page targeting the keyword "${keyword}" for a ${niche} business${location ? ` in ${location}` : ""}. Style: ${style || "premium dark mode with glassmorphism"}.`;

    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `${systemPrompt}\n\n${userPrompt}`,
    });

    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```[a-z]*\n/i, "").replace(/\n```$/i, "");
    const startIdx = cleanText.indexOf("{");
    const endIdx = cleanText.lastIndexOf("}") + 1;
    if (startIdx === -1 || endIdx === 0) throw new Error("Model did not return valid JSON.");
    cleanText = cleanText.substring(startIdx, endIdx);

    const landingPage = JSON.parse(cleanText);

    return NextResponse.json({ success: true, landingPage });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Landing Page Factory Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
