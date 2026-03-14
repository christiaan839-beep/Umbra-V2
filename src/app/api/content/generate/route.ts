import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { db } from "@/db";
import { scheduledContent } from "@/db/schema";

/**
 * Content Auto-Generator API
 * 
 * Uses Gemini 2.5 Pro to generate a full week of social media content
 * and automatically schedules it in the Content Calendar.
 * This is the key automation gap — content creation is now zero-touch.
 */
export async function POST(req: Request) {
  try {
    const { tenantId, industry, topics, platforms } = await req.json();

    const targetPlatforms = platforms || ["instagram", "linkedin", "twitter"];
    const targetTopics = topics || ["AI marketing trends", "automation case studies", "growth hacking", "client results", "industry insights"];

    const { text: contentJson } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `Generate a 7-day social media content calendar for an AI marketing agency.

INDUSTRY FOCUS: ${industry || "Digital Marketing & AI"}
PLATFORMS: ${targetPlatforms.join(", ")}
TOPICS: ${targetTopics.join(", ")}

Generate EXACTLY 7 posts in this JSON format:
[
  {
    "day": 1,
    "platform": "instagram",
    "topic": "...",
    "caption": "...",
    "hashtags": "...",
    "imagePrompt": "...",
    "bestTime": "09:00"
  }
]

RULES:
- Each post should be for a different day (1-7)
- Rotate platforms across the week
- Captions under 150 words, engaging and value-driven
- Include 5-8 relevant hashtags
- imagePrompt should describe a visual that would perform well on that platform
- bestTime in 24h format, optimized for engagement
- Mix content types: educational, social proof, behind-the-scenes, tips, engagement

Output ONLY the JSON array.`,
    });

    let posts;
    try {
      const cleaned = contentJson.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      posts = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse content" }, { status: 500 });
    }

    // Schedule each post in the Content Calendar
    const now = new Date();
    const scheduled = [];

    for (const post of posts) {
      const scheduleDate = new Date(now);
      scheduleDate.setDate(now.getDate() + (post.day - 1));
      const [hours, minutes] = (post.bestTime || "09:00").split(":").map(Number);
      scheduleDate.setHours(hours, minutes, 0, 0);

      const entry = await db.insert(scheduledContent).values({
        topic: post.caption,
        platform: post.platform,
        scheduledAt: scheduleDate,
        status: "scheduled",
        imagePrompt: post.imagePrompt || null,
      }).returning();

      scheduled.push({ ...post, id: entry[0]?.id, scheduledFor: scheduleDate.toISOString() });
    }

    return NextResponse.json({
      success: true,
      postsGenerated: scheduled.length,
      posts: scheduled,
      message: `${scheduled.length} posts generated and scheduled for the next 7 days`,
    });
  } catch (error) {
    console.error("[Content Generator Error]:", error);
    return NextResponse.json({ error: "Content generation failed" }, { status: 500 });
  }
}
