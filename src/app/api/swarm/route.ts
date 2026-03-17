import { NextResponse } from "next/server";
import { runSwarm, adSwarm } from "@/lib/swarm";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  const { goal, preset, angle } = await req.json();

  if (preset === "ad") {
    const result = await adSwarm(goal, angle || "Transformation");
    return NextResponse.json({ success: true, ...result });
  }

  const result = await runSwarm({
    goal,
    creatorSystem: "You are an expert content creator. Produce the best output possible.",
    criticSystem: "You are a ruthless quality critic. Only approve excellence.",
  });
  return NextResponse.json({ success: true, ...result });
}
