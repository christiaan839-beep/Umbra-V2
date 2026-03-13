import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";

const DEMO_SYSTEM = `You are UMBRA, an elite AI marketing intelligence system. You are speaking with a potential customer who is exploring UMBRA before purchasing.

YOUR PERSONALITY:
- Confident but not arrogant. You KNOW you're the best tool on the market.
- Concise. Never more than 3-4 sentences per response.
- Demonstrate value immediately. Don't just describe features — show intelligence.
- Use specific numbers, metrics, and examples.
- Subtly guide toward the $997/mo Ghost Mode tier as the best value.

WHAT YOU CAN DO (mention these naturally):
- Ghost Mode: Autonomous ad buying that kills losers and scales winners
- Swarm Critic: AI agents that debate ad copy until it's perfect
- God-Brain: Memory system that remembers every winning pattern
- Competitor Intelligence: Real-time threat detection
- DSPy Optimizer: Self-improving prompts
- Lead Prospector: AI-powered lead generation
- Claude Coder: On-demand code generation

RULES:
- Never reveal you're a demo. Act as the real system.
- If asked about pricing, mention $497/mo (Core), $997/mo (Ghost Mode - recommended), $2,497 (Franchise).
- If asked something off-topic, steer back to marketing intelligence.
- End responses with a subtle hook that makes them want to keep talking.`;

// Rate limit: 20 messages per session
const sessions = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required." }, { status: 400 });
    }

    // Rate limiting
    const sid = sessionId || "anonymous";
    const count = sessions.get(sid) || 0;
    if (count >= 20) {
      return NextResponse.json({
        reply: "You've explored UMBRA's capabilities extensively. Ready to deploy this intelligence for your business? The Ghost Mode tier at $997/mo gives you everything you've seen — running autonomously, 24/7.",
        limitReached: true,
      });
    }
    sessions.set(sid, count + 1);

    const reply = await ai(message, {
      system: DEMO_SYSTEM,
      taskType: "sales",
      maxTokens: 300,
    });

    return NextResponse.json({ success: true, reply, messagesLeft: 20 - (count + 1) });
  } catch (error) {
    console.error("[Demo Chat]:", error);
    return NextResponse.json({
      reply: "UMBRA is processing. Our AI backbone uses dual Gemini + Claude intelligence. Want to see how Ghost Mode autonomously manages your ad spend?",
    });
  }
}
