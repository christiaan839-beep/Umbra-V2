import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { input, variantA, variantB } = await req.json();

  console.log(`[Skill-Forge] Evaluating Variant A vs Variant B...`);
  
  // Simulate latency and return mock telemetry
  return NextResponse.json({
    success: true,
    results: {
      A: {
        latency: "1.2s",
        tokens: 142,
        output: "The primary objection identified in the transcript relates to implementation timelines.",
        bullets: [
          "Mentioned 'we don't have engineering bandwidth' (03:14)",
          "Expressed concern over 'integration complexity' (05:22)"
        ]
      },
      B: {
        latency: "2.1s",
        tokens: 384,
        systemLog: "> System: Analyzing psychological drivers behind objections...",
        coreObjection: "Core Objection: Resource Paralysis (not budget).",
        description: "The prospect isn't objecting to the price, but rather the internal political cost of allocating engineering resources. They fear the integration effort will stall other KPIs.",
        rebuttal: "I completely understand the engineering bottleneck. That's why our protocol requires ZERO integration on your end. We operate fully autonomously outside your stack."
      }
    }
  });
}
