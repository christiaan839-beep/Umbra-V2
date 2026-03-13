import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { remember } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const { topic, context } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing campaign topic" }, { status: 400 });
    }

    // 1. Generate the Master Content Brief
    const prompt = `You are UMBRA's Lead Content Strategist.
A new organic social media campaign has been requested.
Topic: "${topic}"
Context: "${context || 'No specific context provided. Assume a high-ticket B2B or elite consumer biohacking audience.'}"

Your job is to generate a master content brief that will be sent to the Instagram and YouTube autonomous publishing agents.
The brief must be hyper-optimized for attention retention and direct-response psychology. No generic AI fluff. Use polarizing hooks, high-value payloads, and strong CTAs.

Respond ONLY with a valid JSON object containing:
{
  "instagram": {
    "format": "carousel",
    "slide_count": 5,
    "script": "The step-by-step text for the 5 carousel slides. Bold the hooks.",
    "caption": "The Instagram caption, including 3 highly relevant hashtags."
  },
  "youtube": {
    "format": "shorts",
    "title": "A highly clickable title under 60 characters.",
    "script": "A 60-second punchy video script.",
    "description": "The video description with relevant keywords.",
    "tags": ["3", "to", "5", "tags"]
  }
}`;

    const rawPlan = await ai(prompt, {
      model: "gemini",
      system: "You are the Social Media Router Swarm. You write elite, high-converting organic content.",
      maxTokens: 1500,
    });

    const parsedPlan = JSON.parse(rawPlan.replace(/```json/g, "").replace(/```/g, "").trim());

    // 2. Route the Briefs to Sub-Agents
    // In production, these would trigger long-running background jobs/queues.
    // For this tier, we will execute them synchronously via internal fetch calls (simulated).
    
    // Simulate routing latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate Instagram Sub-Agent deployment
    const igResponse = await fetch(`${req.headers.get('origin') || 'http://localhost:3000'}/api/swarm/social/instagram`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(parsedPlan.instagram)
    }).catch(e => ({ ok: false, statusText: e.message }));

    // Simulate YouTube Sub-Agent deployment
    const ytResponse = await fetch(`${req.headers.get('origin') || 'http://localhost:3000'}/api/swarm/social/youtube`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPlan.youtube)
    }).catch(e => ({ ok: false, statusText: e.message }));

    // 3. Log to God-Brain
    const logId = `social_campaign_${Date.now()}`;
    await remember(`SOCIAL SWARM DEPLOYED: Campaign "${topic}". Formats: IG Carousel & YT Shorts. Sub-agent status: IG (${igResponse.ok}), YT (${ytResponse.ok})`, {
        type: "social-campaign",
        campaignId: logId,
        topic
    });

    return NextResponse.json({
        success: true,
        message: `Swarm deployed for organic domination on topic: ${topic}`,
        data: {
          campaignId: logId,
          contentPlan: parsedPlan,
          status: {
            instagram_subagent: igResponse.ok ? "published" : `failed: ${igResponse.statusText}`,
            youtube_subagent: ytResponse.ok ? "published" : `failed: ${ytResponse.statusText}`
          }
        }
    });

  } catch (error: any) {
    console.error("[Social Router Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to orchestrate social swarm" }, { status: 500 });
  }
}
