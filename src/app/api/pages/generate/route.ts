import { NextResponse } from "next/server";
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

    // ⚡ SOVEREIGN ZERO-COST PROTOCOL ⚡
    // Hard-routing the Edge API back to the local Mac Ollama daemon
    // Bypassing Gemini 2.5 Pro compute costs entirely.

    const ollamaPayload = {
       model: "llama3",
       prompt: `You are an elite landing page designer and copywriter. Generate a complete, production-ready HTML landing page for ${businessName}. Offer: ${offer}. Style: ${style}. Output ONLY HTML.`,
       stream: false
    };

    const ollamaRes = await fetch("http://127.0.0.1:11434/api/generate", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(ollamaPayload)
    });

    if (!ollamaRes.ok) {
       throw new Error("Local Llama3 Engine offline. Ensure Ollama is running on port 11434.");
    }

    const ollamaData = await ollamaRes.json();
    const pageHtml = ollamaData.response;
    const imagePrompt = `Cinematic rendering for ${businessName}`;

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
