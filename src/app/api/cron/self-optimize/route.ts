import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { remember, recall } from "@/lib/memory";

/**
 * UMBRA Self-Optimization Engine
 * 
 * Runs nightly via Vercel CRON. This is the core self-improvement loop:
 * 1. Recalls all actions from the last 24 hours (WhatsApp, SEO, Skills)
 * 2. Evaluates what worked and what didn't
 * 3. Generates improved strategies and system directives
 * 4. Stores these optimizations back into the God-Brain
 * 5. All future AI calls automatically recall these optimizations
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // === PHASE 1: RECALL RECENT ACTIVITY ===
    const [whatsappLogs, seoLogs, skillLogs, previousOptimizations] = await Promise.all([
      recall("WhatsApp conversation last 24 hours", 10),
      recall("PROGRAMMATIC_PAGE_DATA deployed", 10),
      recall("Agentic skill execution result", 10),
      recall("SYSTEM_OPTIMIZATION directive", 3),
    ]);

    const whatsappSummary = whatsappLogs
      .map(m => `[${m.entry.metadata.type}] ${m.entry.text}`)
      .join("\n") || "No WhatsApp activity.";

    const seoSummary = seoLogs
      .filter(m => m.entry.metadata.type === "programmatic-page")
      .map(m => `Page: ${m.entry.metadata.path} | City: ${m.entry.metadata.city}`)
      .join("\n") || "No SEO pages deployed.";

    const skillSummary = skillLogs
      .map(m => m.entry.text)
      .join("\n") || "No skill executions.";

    const previousDirectives = previousOptimizations
      .map(m => m.entry.text)
      .join("\n") || "No previous optimizations.";

    // === PHASE 2: AI SELF-EVALUATION ===
    const evaluationPrompt = `You are UMBRA's Self-Optimization Engine. You are reviewing the last 24 hours of autonomous operations.

PREVIOUS OPTIMIZATION DIRECTIVES:
${previousDirectives}

WHATSAPP CONVERSATIONS (last 24h):
${whatsappSummary}

SEO PAGES DEPLOYED (last 24h):
${seoSummary}

SKILL EXECUTIONS (last 24h):
${skillSummary}

Based on this data, generate exactly 5 SYSTEM OPTIMIZATION DIRECTIVES. Each directive should be a specific, actionable improvement to how UMBRA operates. Focus on:
1. WhatsApp closing language that converts better
2. SEO copy patterns that should be reinforced or avoided
3. Skill execution strategies that need adjustment
4. New opportunities detected from the data
5. Any patterns that indicate a strategy is failing

Format each directive as:
DIRECTIVE [N]: [Clear, specific instruction for the AI system]

Be extremely specific. These directives will be injected into all future AI prompts.`;

    const optimizations = await ai(evaluationPrompt, {
      model: "gemini",
      system: "You are a senior marketing strategist analyzing AI system performance data. Be brutally honest and specific. No fluff.",
      maxTokens: 1500,
    });

    // === PHASE 3: STORE OPTIMIZATIONS IN GOD-BRAIN ===
    const optimization = await remember(
      `SYSTEM_OPTIMIZATION directive generated at ${new Date().toISOString()}:\n${optimizations}`,
      {
        type: "system_optimization",
        generatedAt: new Date().toISOString(),
        whatsappVolume: String(whatsappLogs.length),
        seoVolume: String(seoLogs.length),
        skillVolume: String(skillLogs.length),
      }
    );

    // === PHASE 4: GENERATE PERFORMANCE SCORE ===
    const scorePrompt = `Based on the following system activity, give a performance score from 0-100 and a one-line summary.

WhatsApp conversations: ${whatsappLogs.length}
SEO pages deployed: ${seoLogs.filter(m => m.entry.metadata.type === "programmatic-page").length}  
Skills executed: ${skillLogs.length}

Respond in JSON: { "score": number, "summary": "string" }`;

    let score = 50;
    let summary = "Baseline performance.";
    try {
      const scoreRaw = await ai(scorePrompt, { model: "gemini", maxTokens: 200 });
      const parsed = JSON.parse(scoreRaw.replace(/```json\n?/g, "").replace(/```/g, "").trim());
      score = parsed.score || 50;
      summary = parsed.summary || "Evaluated.";
    } catch {}

    // Store the score
    await remember(`PERFORMANCE_SCORE: ${score}/100 — ${summary}`, {
      type: "performance_score",
      score: String(score),
      summary,
      date: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      cycle: "self-optimize",
      score,
      summary,
      directivesGenerated: 5,
      dataAnalyzed: {
        whatsapp: whatsappLogs.length,
        seo: seoLogs.filter(m => m.entry.metadata.type === "programmatic-page").length,
        skills: skillLogs.length,
      },
      optimizationId: optimization.id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("[Self-Optimize] Error:", error);
    return NextResponse.json({ error: "Self-optimization cycle failed", details: String(error) }, { status: 500 });
  }
}
