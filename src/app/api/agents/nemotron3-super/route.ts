import { NextResponse } from "next/server";

/**
 * NEMOTRON 3 SUPER 120B — The newest hybrid Mamba-Transformer MoE.
 * 
 * Uses Nemotron 3 Super (120B total, 12B active) for:
 * - Ultra-long context analysis (up to 1M tokens)
 * - Complex multi-step reasoning
 * - Enterprise document understanding
 * - Strategic planning at scale
 * 
 * LICENSE: NVIDIA Open Model License — free for commercial use.
 */

export async function POST(request: Request) {
  try {
    const { prompt, mode = "reason", max_tokens = 2048 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required." }, { status: 400 });
    }

    const nimKey = process.env.NVIDIA_NIM_API_KEY;
    if (!nimKey) {
      return NextResponse.json({ error: "NVIDIA_NIM_API_KEY not configured." }, { status: 500 });
    }

    const systemPrompts: Record<string, string> = {
      reason: "You are an elite reasoning engine. Think step-by-step, consider multiple perspectives, and arrive at a well-supported conclusion. Show your chain of thought.",
      analyze: "You are a deep analyst. Extract key insights, identify patterns, assess risks, and provide actionable recommendations. Be thorough and specific.",
      strategize: "You are a world-class strategist. Consider competitive dynamics, market forces, and second-order effects. Propose bold but executable strategies.",
      summarize: "You are a precision summarizer. Distill complex information into clear, concise summaries. Preserve critical details while eliminating noise.",
    };

    const start = Date.now();
    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${nimKey}` },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b",
        messages: [
          { role: "system", content: systemPrompts[mode] || systemPrompts.reason },
          { role: "user", content: prompt },
        ],
        max_tokens,
        temperature: mode === "summarize" ? 0.2 : 0.6,
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      model: "Nemotron 3 Super 120B (Hybrid Mamba-Transformer MoE)",
      mode,
      result: data?.choices?.[0]?.message?.content || "",
      duration_ms: Date.now() - start,
      license: "NVIDIA Open Model License — commercial use permitted",
    });
  } catch (error) {
    return NextResponse.json({ error: "Nemotron 3 Super error", details: String(error) }, { status: 500 });
  }
}
