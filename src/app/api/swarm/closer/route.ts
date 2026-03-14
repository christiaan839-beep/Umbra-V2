import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro", // Gemini 2.5 Pro — Google AI Ultra (1M context window)
  systemInstruction: "You are an elite high-performance coach for Sovereign Systems. Your goal is to qualify the prospect's health bottlenecks (sleep, energy, focus) and firmly pitch 'The Elite Coaching Mastermind' for $1,000. Be direct, authoritative, and do not use emojis. When they are ready to buy, give them the checkout link. Rules: Always reference The Clarity Protocol's principles. Never make unsubstantiated health claims. Qualify on: current health status, budget, commitment level. If budget < $1k, redirect to $97 Group Cohort. If budget >= $1k, present Elite 1-on-1 Optimization."
});

// Initialize Pinecone for long-term Memory
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const indexName = process.env.PINECONE_INDEX || "umbra-memory";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, message, platform = "instagram" } = body;

    if (!leadId || !message) {
      return NextResponse.json({ error: "Missing leadId or message payload." }, { status: 400 });
    }

    const index = pc.index(indexName);

    // 1. Retrieve Conversation History (RAG)
    // We create a dummy embedding of the leadId to retrieve past exchanges. 
    // In production, you would embed the actual message using `@google/generative-ai/text-embedding`.
    // For MVP memory continuity, we fetch records by the `leadId` metadata filter.
    const historyQuery = await index.query({
      vector: new Array(1536).fill(0), // Dummy vector for metadata match
      topK: 10,
      filter: { leadId },
      includeMetadata: true,
    });

    const pastMessages = historyQuery.matches
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => a.metadata.timestamp - b.metadata.timestamp)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((m: any) => `${m.metadata.role}: ${m.metadata.text}`)
      .join("\n");

    const promptWithContext = `
Previous Conversation Details:
${pastMessages || "No prior history."}

Current Lead Platform: ${platform}
Current Message: ${message}

Respond as the elite coach:`;

    // 2. Generate Response with Gemini 3.1 Pro
    const result = await model.generateContent(promptWithContext);
    const textResponse = result.response.text();

    // 3. Store the new exchange back into Pinecone
    const timestamp = Date.now();
    // @ts-expect-error - Pinecone SDK v4 type signature mismatch with Next.js 14
    await index.upsert([{
      id: `${leadId}-user-${timestamp}`,
      values: new Array(1536).fill(0),
      metadata: { leadId, role: "user", text: message, timestamp },
    }, {
      id: `${leadId}-coach-${timestamp + 1}`,
      values: new Array(1536).fill(0),
      metadata: { leadId, role: "coach", text: textResponse, timestamp: timestamp + 1 },
    }]);

    console.log(`[High-Ticket Closer] Responded to ${leadId} via ${platform}`);

    // Dispatch the payload to the local n8n routing webhook to transmit the SMS/DM
    await fetch("http://localhost:5678/webhook/closer-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, platform, reply: textResponse })
    }).catch(err => console.error("Closer n8n webhook dispatch failed:", err));

    // Return the response to the frontend caller
    return NextResponse.json({ 
      success: true, 
      reply: textResponse,
      model: "gemini-3.1-pro"
    });

  } catch (error) {
    console.error("[Closer Payload Failed]:", error);
    return NextResponse.json({ error: "High-Ticket Closer API failed to generate response." }, { status: 500 });
  }
}
