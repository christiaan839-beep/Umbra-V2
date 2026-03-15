import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow 60 seconds for Vercel Edge synthesis

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { allowed } = rateLimit(`vectors:${ip}`);
    if (!allowed) return rateLimitResponse();

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
      return NextResponse.json({ error: "Invalid or missing prompt (max 1000 chars)." }, { status: 400 });
    }

    const systemPrompt = `
You are the UMBRA Autonomous Graphic Designer. Your objective is to generate beautiful, modern, complex SVG vectors based on user prompts.
You output ONLY a raw, fully valid <svg> tag string.

CRITICAL RULES:
1. Do NOT include markdown formatting, backticks, or any conversational text.
2. The output must start exactly with <svg> and end exactly with </svg>.
3. SVGs must be responsive (use viewBox instead of fixed width/height).
4. Use modern aesthetics: sleek gradients, glowing neon colors, and isometric 3D shapes where appropriate.
5. All IDs for gradients/masks must be globally unique (e.g., prefix with a randomized or highly specific string) to prevent conflicts if multiple SVGs are used on one page.
`;

    const { text } = await generateText({
        model: google("gemini-2.5-pro"),
        prompt: `${systemPrompt}\n\nUSER COMMAND: ${prompt}`,
    });

    let cleanSvg = text.trim();
    
    // Strip markdown code blocks if the model hallucinates them
    if (cleanSvg.startsWith('\`\`\`')) {
        const lines = cleanSvg.split('\n');
        if (lines[0].startsWith('\`\`\`')) lines.shift();
        if (lines[lines.length - 1].startsWith('\`\`\`')) lines.pop();
        cleanSvg = lines.join('\n');
    }

    // Secondary cleanup
    cleanSvg = cleanSvg.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '');
    
    // Validate SVG start/end
    if (!cleanSvg.includes('<svg') || !cleanSvg.includes('</svg>')) {
        throw new Error("Model failed to output a valid SVG tag.");
    }

    // Extract just the SVG part in case there's surrounding text
    const startIndex = cleanSvg.indexOf('<svg');
    const endIndex = cleanSvg.lastIndexOf('</svg>') + 6;
    cleanSvg = cleanSvg.substring(startIndex, endIndex);

    return NextResponse.json({ svg: cleanSvg });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Vector Synthesis Engine Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
