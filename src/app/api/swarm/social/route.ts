import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { topic, platform = "all" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing campaign topic" }, { status: 400 });
    }

    // This Next.js API route acts as the secure reverse-proxy for the n8n Social Media Swarm.
    // The actual orchestration (Gemini → Veo/Imagen → Meta API / YouTube API) 
    // occurs inside the internal n8n nodes, initiated by these webhook triggers.

    const logId = `soc_${crypto.randomUUID().slice(0, 8)}`;
    let igDispatched = false;
    let ytDispatched = false;

    // Generate a visual asset via Google Imagen before dispatching
    let generatedImage: string | null = null;
    try {
      const imagenRes = await fetch(new URL("/api/swarm/social/imagen", req.url).toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: topic }),
      });
      const imagenData = await imagenRes.json();
      if (imagenData.success && imagenData.image?.data) {
        generatedImage = imagenData.image.data;
      }
    } catch (err) {
      console.warn("[Imagen] Visual generation skipped:", err);
    }

    // 1. Dispatch Instagram Webhook
    if (platform === "all" || platform === "instagram") {
      await fetch("http://localhost:5678/webhook/ig-auto-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, logId, image: generatedImage })
      }).catch(err => console.error("Instagram n8n webhook dispatch failed:", err));
      igDispatched = true;
    }

    // 2. Dispatch YouTube Webhook
    if (platform === "all" || platform === "youtube") {
      await fetch("http://localhost:5678/webhook/yt-auto-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, logId })
      }).catch(err => console.error("YouTube n8n webhook dispatch failed:", err));
      ytDispatched = true;
    }

    // 3. Log into Neon Postgres for Swarm Dashboard Telemetry
    await db.insert(globalTelemetry).values({
      // Using a zero-UUID for system-level actions, or you could pass a specific tenantId
      tenantId: "00000000-0000-0000-0000-000000000000", 
      eventType: `social_media_deployed`,
      payload: JSON.stringify({ 
        campaignId: logId, 
        topic, 
        platforms: { instagram: igDispatched, youtube: ytDispatched },
        timestamp: Date.now() 
      }),
    });

    console.log(`[Social Media Swarm] Dispatched topic: "${topic}" to ${platform}`);

    return NextResponse.json({
        success: true,
        message: `Swarm deployed for organic domination on topic: ${topic}`,
        data: {
          campaignId: logId,
          status: {
            instagram_subagent: igDispatched ? "dispatched" : "skipped",
            youtube_subagent: ytDispatched ? "dispatched" : "skipped"
          }
        }
    });

  } catch (error: unknown) {
    console.error("[Social Router Error]:", error);
    const msg = error instanceof Error ? error.message : "Failed to orchestrate social swarm";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
