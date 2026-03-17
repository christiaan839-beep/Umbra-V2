import { ai } from "@/lib/ai";
import { requireAuth } from "@/lib/auth-guard";

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  const { prompt, systemInstruction, model } = await req.json();
  if (!prompt?.trim()) return new Response("Prompt required", { status: 400 });

  try {
    const useModel = model === "claude" ? "claude" : "gemini";
    const output = await ai(prompt, { model: useModel as "gemini" | "claude", system: systemInstruction });

    // Simulate streaming by chunking the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const words = output.split(" ");
        let i = 0;
        const interval = setInterval(() => {
          if (i >= words.length) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            controller.close();
            clearInterval(interval);
            return;
          }
          const chunk = words.slice(i, i + 3).join(" ") + " ";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          i += 3;
        }, 30);
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (error) {
    console.error("[AI Stream]:", error);
    return new Response("Stream failed", { status: 500 });
  }
}
