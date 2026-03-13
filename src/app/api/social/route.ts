import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { publishPost, adaptAndPublish } from "@/lib/social";

export async function POST(req: Request) {
  try {
    const { action, content, platform, platforms, topic, count } = await req.json();

    if (action === "generate-and-post") {
      const generated = await ai(
        `Create a viral ${platform || "instagram"} post about: ${topic}. Include hashtags.`,
        { system: "You are a viral content creator. Create scroll-stopping posts with hooks, emojis, and CTAs." }
      );
      const result = await publishPost({ platform: platform || "instagram", content: generated });
      return NextResponse.json({ success: true, content: generated, result });
    }

    if (action === "multi-post") {
      if (!content || !platforms?.length) return NextResponse.json({ error: "Content and platforms required" }, { status: 400 });
      const { adaptations, results } = await adaptAndPublish(content, platforms);
      return NextResponse.json({ success: true, adaptations, results });
    }

    if (action === "calendar") {
      const calendar = await ai(
        `Create a ${count || 7}-day social media content calendar for: ${topic}.
For each day provide:
- Post content (ready to publish)
- Platform (instagram/x/linkedin)
- Best time to post
- Hashtags
- Content type (carousel, reel, story, thread)
Format as a structured list.`,
        { system: "You are a social media strategist. Create detailed, ready-to-use content calendars." }
      );
      return NextResponse.json({ success: true, calendar });
    }

    if (action === "publish") {
      if (!content || !platform) return NextResponse.json({ error: "Content and platform required" }, { status: 400 });
      const result = await publishPost({ platform, content });
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[Social API]:", error);
    return NextResponse.json({ error: "Social operation failed" }, { status: 500 });
  }
}
