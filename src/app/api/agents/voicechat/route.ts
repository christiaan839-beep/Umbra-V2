import { NextResponse } from "next/server";

/**
 * REAL-TIME VOICE AGENT — Uses NVIDIA Nemotron Voicechat for 
 * live bidirectional AI voice conversation.
 * 
 * Accepts text prompts and returns conversational responses
 * optimized for voice interaction (short, natural, empathetic).
 */

export async function POST(request: Request) {
  try {
    const { text, context = "customer-support", voice_style = "professional" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "text is required." }, { status: 400 });
    }

    const nimKey = process.env.NVIDIA_NIM_API_KEY;
    if (!nimKey) {
      return NextResponse.json({ error: "NVIDIA_NIM_API_KEY not configured." }, { status: 500 });
    }

    const contextPrompts: Record<string, string> = {
      "customer-support": "You are a warm, helpful customer support agent. Keep responses under 3 sentences. Be empathetic and solution-oriented. Never say 'I cannot help' — always offer an alternative.",
      "sales": "You are a confident sales professional. Keep responses conversational and under 3 sentences. Focus on understanding needs and directing toward a booking link.",
      "receptionist": "You are a professional receptionist. Greet callers warmly, gather their name and reason for calling, and offer to connect them or take a message.",
      "appointment": "You are a scheduling assistant. Help callers book, reschedule, or cancel appointments. Confirm all details before finalizing.",
    };

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${nimKey}`,
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-voicechat",
        messages: [
          { role: "system", content: `${contextPrompts[context] || contextPrompts["customer-support"]} Voice style: ${voice_style}. Respond as if speaking on a phone call — natural, concise, human.` },
          { role: "user", content: text },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    const response = data?.choices?.[0]?.message?.content || "I'm here to help. Could you repeat that?";

    return NextResponse.json({
      success: true,
      model: "nemotron-voicechat",
      context,
      voice_style,
      response,
      word_count: response.split(/\s+/).length,
      estimated_duration_seconds: Math.round(response.split(/\s+/).length / 2.5),
    });
  } catch (error) {
    return NextResponse.json({ error: "Voicechat error", details: String(error) }, { status: 500 });
  }
}
