import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { adSwarm } from "@/lib/swarm";

export async function POST(req: Request) {
  try {
    const { niche, product } = await req.json();
    if (!niche?.trim()) return NextResponse.json({ error: "Niche required" }, { status: 400 });

    const productDesc = product?.trim() || niche;

    // Generate 4 campaign components in parallel
    const [adCopyResult, calendar, videoBrief, competitive] = await Promise.all([
      adSwarm(productDesc, `High-converting awareness ads for ${niche}`),
      ai(`Create a 7-day social media content calendar for a ${niche} business selling ${productDesc}. For each day: post content (ready to publish), platform (instagram/x/linkedin), best time, content type (carousel/reel/story/thread), and hashtags.`, {
        system: "You are a social media strategist. Create detailed, ready-to-use content that drives engagement and sales.",
      }),
      ai(`Create a 30-second video production brief for a ${niche} business promoting ${productDesc}. Include: concept, 4 scenes with visual descriptions and voiceover, text overlays, music mood, and platform optimization notes.`, {
        system: "You are a video creative director. Create detailed briefs optimized for short-form video platforms.",
      }),
      ai(`Analyze the competitive landscape for a ${niche} business selling ${productDesc}. Include: top 3 competitors with strengths/weaknesses, market gaps, positioning strategy, and 3 specific differentiators to exploit.`, {
        system: "You are a competitive intelligence analyst. Provide actionable market insights that reveal opportunities.",
      }),
    ]);

    return NextResponse.json({
      success: true,
      campaign: { 
        adCopy: `${adCopyResult.finalOutput}\n\n---\n[Agentic Intelligence] Generated in ${adCopyResult.rounds} rounds resulting in Critic Approval.`, 
        calendar, 
        videoBrief, 
        competitive 
      },
      niche,
      product: productDesc,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Demo Generate]:", error);
    return NextResponse.json({ error: "Campaign generation failed" }, { status: 500 });
  }
}
