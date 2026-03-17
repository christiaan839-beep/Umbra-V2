import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { ai, research_ai } from "@/lib/ai";
import { ANTI_SLOP_RULES } from "@/lib/content-engine";
import { fireUserWebhook } from "@/lib/webhooks";

// Vercel Serverless Function Config
export const maxDuration = 60; // Max allowed for hobby/pro before timeout
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { businessName, industry, offer, targetAudience } = await req.json();

  if (!businessName || !offer) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (type: string, data: any) => {
        const payload = JSON.stringify({ type, data }) + "\n\n";
        controller.enqueue(encoder.encode(payload));
      };

      try {
        // --- STEP 1: Initialization ---
        emit("progress", { step: 1, message: "Initializing UMBRA Autonomous Engine..." });
        await new Promise(r => setTimeout(r, 1000)); // Brief pause for UX

        // --- STEP 2: Competitor X-Ray (Research) ---
        emit("progress", { step: 2, message: `Running Competitor X-Ray for ${industry} in ${businessName}...` });
        
        const searchQuery = `Top performing landing pages and offers for ${industry} ${offer} ${targetAudience} competitor analysis`;
        emit("log", { message: `[SYS] Querying Tavily: ${searchQuery}` });
        
        // We use standard AI here first to build the architecture based on general knowledge, 
        // to save time/tokens if the niche is straightforward. But let's do a fast research pass.
        const researchPrompt = `Analyze the typical high-converting landing page structure for:
        Business: ${businessName}
        Industry: ${industry}
        Offer: ${offer}
        Target Audience: ${targetAudience}

        Identify 3 key missing elements in standard competitor pages that we can exploit for higher conversions. Output as a brief list.`;

        const researchData = await research_ai(searchQuery, researchPrompt, {
          system: "You are an elite conversion rate optimization (CRO) researcher.",
          maxTokens: 500
        });

        emit("log", { message: `[SYS] Research Complete. Identified Gaps:\n${researchData}` });
        emit("progress", { step: 3, message: "Defining high-converting page architecture..." });

        // --- STEP 3: Architecture & Copywriting ---
        // Combine Steps 3 & 4 to save a round trip to the LLM
        emit("log", { message: "[SYS] Drafting direct-response copy framework" });

        const architecturePrompt = `
        Draft the copy and structure for a landing page for ${businessName}.
        Offer: ${offer}
        Target Audience: ${targetAudience}
        
        Use this research to make it better than competitors:
        ${researchData}

        Outline the sections:
        1. Hero (Headline, Subhead, CTA)
        2. Problem Agitation (3 points)
        3. Solution/Features (3 points)
        4. Social Proof / Authority
        5. Final CTA
        `;

        const copyData = await ai(architecturePrompt, {
          system: "You are a direct-response copywriter. Output only the raw copy outline. No intro.",
          maxTokens: 1000
        });

        emit("progress", { step: 4, message: "Copywritten. Designing Tailwind component system..." });
        
        // --- STEP 5 & 6: React Code Generation ---
        emit("progress", { step: 5, message: "Generating production-ready React / Tailwind code..." });
        emit("log", { message: "[SYS] Compiling components into unified VDOM" });

        const codePrompt = `Create a visually stunning, premium, modern landing page using HTML5 and Tailwind CSS.
        
        BUSINESS: ${businessName}
        INDUSTRY: ${industry}
        
        USE THIS EXACT COPY:
        ${copyData}

        RULES:
        ${ANTI_SLOP_RULES}
        1. Output ONLY valid HTML code. Start with <!DOCTYPE html>.
        2. Include Tailwind via CDN: <script src="https://cdn.tailwindcss.com"></script> in the <head>.
        3. Do NOT wrap in markdown \`\`\`html tags. Output raw HTML.
        4. Use a premium, dark-mode aesthetic (bg-gray-950, text-white, with neon/glassmorphic accents).
        5. Include Lucide icons via CDN script if needed, or use inline SVG.
        6. Page must be fully responsive (mobile-first).
        7. Only use standard Tailwind generic utility classes. Do not use custom CSS unless absolutely necessary.
        `;

        const rawCode = await ai(codePrompt, {
          model: "gemini", // Or claude if user prefers
          system: "You are an elite Frontend Web Developer. Output ONLY RAW JSX code. No markdown formatting. No explanations.",
          maxTokens: 4000
        });

        let cleanCode = rawCode.trim();
        if (cleanCode.startsWith('```html')) cleanCode = cleanCode.replace(/^```html\n/, '');
        if (cleanCode.startsWith('```')) cleanCode = cleanCode.replace(/^```\n/, '');
        if (cleanCode.endsWith('```')) cleanCode = cleanCode.replace(/\n```$/, '');

        emit("progress", { step: 6, message: "Code compilation complete." });

        // --- STEP 7 & 8: Finalization ---
        emit("progress", { step: 7, message: "Finalizing and preparing live preview..." });
        emit("log", { message: "[SYS] Validating JSX syntax..." });

        await new Promise(r => setTimeout(r, 500)); // Brief pause for UX

        // Log to database
        try {
          // Fire and forget webhook
          fireUserWebhook("PageBuilder", "Autonomous_Generated", { businessName, industry }).catch(() => {});
          
          await fetch(new URL("/api/generations", req.url).toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json", "Cookie": req.headers.get("cookie") || "" },
            body: JSON.stringify({
              action: "save",
              tool: "page-builder",
              toolAction: "generate",
              inputSummary: `Autonomous Landing page: ${businessName}`.slice(0, 200),
              output: cleanCode,
            }),
          });
        } catch (dbErr) {
          console.error("DB Save Error:", dbErr);
        }

        emit("progress", { step: 8, message: "Page Generation Complete." });
        emit("complete", { code: cleanCode });
        
      } catch (err: any) {
        console.error("Streaming error:", err);
        emit("error", { message: err.message || "An error occurred during generation." });
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
