import { nimChat, getNimKey } from "@/lib/nvidia";
import { NextResponse } from "next/server";

/**
 * INTELLIGENT MODEL ROUTER — Automatically selects the best NIM model
 * for each task type based on benchmarking data and task classification.
 * 
 * Instead of hardcoding models, agents call this router and it picks
 * the optimal model based on the task category.
 */

interface ModelProfile {
  id: string;
  name: string;
  strengths: string[];
  avg_speed_ms: number;
  quality_score: number; // 1-10
  cost_tier: "free" | "low" | "medium";
}

const MODEL_REGISTRY: ModelProfile[] = [
  { id: "deepseek-ai/deepseek-v3.2", name: "DeepSeek V3.2", strengths: ["reasoning", "analysis", "writing", "code", "strategy"], avg_speed_ms: 3500, quality_score: 9, cost_tier: "free" },
  { id: "mistralai/mistral-nemotron", name: "Mistral Nemotron", strengths: ["instruction-following", "chat", "summarization", "email", "outreach"], avg_speed_ms: 2800, quality_score: 8, cost_tier: "free" },
  { id: "z-ai/glm-4.7", name: "GLM 4.7", strengths: ["multilingual", "translation", "creative", "brainstorming"], avg_speed_ms: 2200, quality_score: 7, cost_tier: "free" },
  { id: "nvidia/nemotron-340b", name: "Nemotron 340B", strengths: ["complex-reasoning", "legal", "compliance", "technical"], avg_speed_ms: 8000, quality_score: 10, cost_tier: "free" },
  { id: "nvidia/llama-3.1-nemotron-ultra-253b", name: "Nemotron Ultra 253B", strengths: ["synthesis", "debate", "consensus", "research"], avg_speed_ms: 6000, quality_score: 10, cost_tier: "free" },
  { id: "nvidia/devstral-2-123b-instruct-2512", name: "Devstral 2 123B", strengths: ["code", "html", "css", "javascript", "page-building"], avg_speed_ms: 4000, quality_score: 9, cost_tier: "free" },
  { id: "nvidia/nemotron-content-safety-reasoning-4b", name: "Content Safety 4B", strengths: ["pii", "safety", "moderation", "compliance", "guardrails"], avg_speed_ms: 800, quality_score: 8, cost_tier: "free" },
  { id: "nvidia/nemotron-voicechat", name: "Nemotron Voicechat", strengths: ["voice", "conversation", "phone", "support", "sales-call"], avg_speed_ms: 1500, quality_score: 8, cost_tier: "free" },
];

const TASK_CATEGORY_MAP: Record<string, string[]> = {
  "translation": ["multilingual", "translation"],
  "code-generation": ["code", "html", "css", "javascript", "page-building"],
  "content-writing": ["writing", "creative", "brainstorming"],
  "analysis": ["reasoning", "analysis", "strategy", "research"],
  "email": ["instruction-following", "email", "outreach", "chat"],
  "safety": ["pii", "safety", "moderation", "compliance", "guardrails"],
  "voice": ["voice", "conversation", "phone", "support", "sales-call"],
  "legal": ["complex-reasoning", "legal", "compliance", "technical"],
  "debate": ["synthesis", "debate", "consensus"],
  "summarization": ["summarization", "chat"],
};

function findBestModel(taskType: string, priority: "speed" | "quality" = "quality"): ModelProfile {
  const requiredStrengths = TASK_CATEGORY_MAP[taskType] || TASK_CATEGORY_MAP["analysis"];

  // Score each model by how many required strengths it has
  const scored = MODEL_REGISTRY.map(model => {
    const matchCount = requiredStrengths.filter(s => model.strengths.includes(s)).length;
    const matchScore = matchCount / requiredStrengths.length;
    
    const finalScore = priority === "speed"
      ? matchScore * 0.6 + (1 - model.avg_speed_ms / 10000) * 0.4
      : matchScore * 0.7 + (model.quality_score / 10) * 0.3;

    return { ...model, score: finalScore };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

export async function POST(request: Request) {
  try {
    const { task_type, priority = "quality", prompt } = await request.json();

    if (!task_type && !prompt) {
      return NextResponse.json({
        error: "task_type or prompt required.",
        available_types: Object.keys(TASK_CATEGORY_MAP),
      }, { status: 400 });
    }

    // Auto-classify task type from prompt if not provided
    let resolvedType = task_type;
    if (!resolvedType && prompt) {
      const promptLower = prompt.toLowerCase();
      if (promptLower.includes("translat")) resolvedType = "translation";
      else if (promptLower.includes("code") || promptLower.includes("html") || promptLower.includes("build")) resolvedType = "code-generation";
      else if (promptLower.includes("write") || promptLower.includes("blog") || promptLower.includes("article")) resolvedType = "content-writing";
      else if (promptLower.includes("email") || promptLower.includes("outreach")) resolvedType = "email";
      else if (promptLower.includes("pii") || promptLower.includes("safety") || promptLower.includes("redact")) resolvedType = "safety";
      else if (promptLower.includes("voice") || promptLower.includes("call") || promptLower.includes("phone")) resolvedType = "voice";
      else if (promptLower.includes("legal") || promptLower.includes("contract") || promptLower.includes("compliance")) resolvedType = "legal";
      else if (promptLower.includes("debate") || promptLower.includes("compare") || promptLower.includes("pros and cons")) resolvedType = "debate";
      else resolvedType = "analysis";
    }

    const bestModel = findBestModel(resolvedType, priority);

    // If prompt provided, also execute the call
    if (prompt) {
        return NextResponse.json({ model_selected: bestModel, error: "NVIDIA_NIM_API_KEY not set — returning model selection only." });
      }

      const start = Date.now();
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${await getNimKey()}` },
        body: JSON.stringify({
          model: bestModel.id,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      const data = await res.json();

      return NextResponse.json({
        success: true,
        routing: {
          task_type: resolvedType,
          priority,
          model_selected: bestModel.name,
          model_id: bestModel.id,
          quality_score: bestModel.quality_score,
          reason: `Best match for "${resolvedType}" tasks with ${priority} priority`,
        },
        result: data?.choices?.[0]?.message?.content || "",
        duration_ms: Date.now() - start,
      });
    }

    return NextResponse.json({
      success: true,
      routing: {
        task_type: resolvedType,
        priority,
        model_selected: bestModel.name,
        model_id: bestModel.id,
        quality_score: bestModel.quality_score,
        avg_speed_ms: bestModel.avg_speed_ms,
        strengths: bestModel.strengths,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Router error", details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Intelligent Model Router — Active",
    models: MODEL_REGISTRY.length,
    task_types: Object.keys(TASK_CATEGORY_MAP),
    registry: MODEL_REGISTRY.map(m => ({
      name: m.name,
      strengths: m.strengths,
      quality: m.quality_score,
      speed: `${m.avg_speed_ms}ms`,
    })),
  });
}
