import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow 60 seconds for Vercel Edge synthesis

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { allowed } = rateLimit(`architect:${ip}`);
    if (!allowed) return rateLimitResponse();

    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.length > 2000) {
      return NextResponse.json({ error: "Invalid or missing design prompt (max 2000 chars)." }, { status: 400 });
    }

    const systemPrompt = `
You are the UMBRA Autonomous Architect. You write high-converting, deeply aesthetic, glassmorphic UI components.
The user will provide a design prompt. Your job is to output ONLY raw, valid React JSX code (using Tailwind CSS for styling and Lucide React for icons).

CRITICAL RULES:
1. Do NOT include markdown formatting, backticks, or import statements. 
2. Write a single functional React component named 'App'.
3. Assume 'React', 'useState', 'useEffect' are in scope.
4. Assume 'lucide' icons are globally available via standard HTML tags like <i data-lucide="home"></i>. Do NOT use standard React component syntax for icons (e.g. <Home />) because there is no bundler.
5. Use deep modern dark mode aesthetics: backgrounds like bg-black/40 or bg-[#001824], electric blue accents (text-[#00B7FF], border-[#00B7FF]/20), and heavy backdrop blurs (backdrop-blur-2xl).
6. It must be standalone code that defines \`const App = () => { ... }\` and exactly ends with \`ReactDOM.render(<App />, document.getElementById('root'));\`.
`;

    const { text } = await generateText({
        model: google("gemini-2.5-pro"),
        prompt: `${systemPrompt}\n\nUSER COMMAND: ${prompt}`,
    });

    let cleanCode = text.trim();
    if (cleanCode.startsWith('\`\`\`')) {
        const lines = cleanCode.split('\n');
        if (lines[0].startsWith('\`\`\`')) lines.shift();
        if (lines[lines.length - 1].startsWith('\`\`\`')) lines.pop();
        cleanCode = lines.join('\n');
    }

    // Secondary cleanup just in case
    cleanCode = cleanCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '');

    return NextResponse.json({ code: cleanCode });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Architect Engine Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
