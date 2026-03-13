import { NextResponse } from "next/server";
import { analyzeCompetitor, watchCompetitors, generateCounterStrategy } from "@/lib/competitor";
import { optimizePrompt, getOptimizationHistory } from "@/lib/optimizer";

export async function POST(req: Request) {
  const body = await req.json();
  const { tool } = body;

  try {
    switch (tool) {
      case "competitor": {
        const { competitor, business } = body;
        const analysis = await analyzeCompetitor(
          { name: competitor, website: body.website, socials: body.socials },
          business || "AI Marketing Automation Platform"
        );
        return NextResponse.json({ success: true, analysis });
      }

      case "watch": {
        const { competitors, business } = body;
        const result = await watchCompetitors(
          competitors.map((c: string) => ({ name: c })),
          business || "AI Marketing Automation Platform"
        );
        return NextResponse.json({ success: true, ...result });
      }

      case "counter-strategy": {
        const strategy = await generateCounterStrategy(body.analyses, body.business || "AI Marketing Automation Platform");
        return NextResponse.json({ success: true, strategy });
      }

      case "optimize": {
        const result = await optimizePrompt(body.prompt, body.objective);
        return NextResponse.json({ success: true, result });
      }

      case "optimize-history": {
        return NextResponse.json({ success: true, history: getOptimizationHistory() });
      }

      default:
        return NextResponse.json({ error: "Unknown tool. Use: competitor, watch, counter-strategy, optimize, optimize-history" }, { status: 400 });
    }
  } catch (error) {
    console.error("[Intelligence API]:", error);
    return NextResponse.json({ error: "Intelligence operation failed." }, { status: 500 });
  }
}
