import { NextResponse } from "next/server";
import { logRewardSignal } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const { agentId, action, score, context } = await req.json();

    if (!agentId || typeof score !== "number") {
      return NextResponse.json({ error: "Missing agentId or score" }, { status: 400 });
    }

    // In a full production system, promptVersion and outputHash would be passed from the client
    // For this prototype, we'll auto-generate them based on the text to simulate the learning loop
    const promptVersion = "v1.0"; 
    const outputHash = Buffer.from(action || Math.random().toString()).toString("base64").substring(0, 16);

    const result = await logRewardSignal(agentId, promptVersion, outputHash, score, context);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "RLHF Reward Signal logged to God-Brain successfully.",
        data: {
          id: result.id,
          agentId,
          score
        }
      });
    } else {
      throw new Error("Failed to log reward signal");
    }

  } catch (error: any) {
    console.error("[RLHF API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to log RLHF data" }, { status: 500 });
  }
}
