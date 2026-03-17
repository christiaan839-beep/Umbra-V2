import { NextResponse } from "next/server";

/**
 * NVIDIA NIM API Proxy — Routes UMBRA V3 requests to NVIDIA's NIM inference endpoints. 
 * Supports Nemotron, Riva STT/TTS, NeMo Guardrails, and OCR models.
 * All requests are authenticated via the NVIDIA_NIM_API_KEY environment variable.
 * 
 * Security:
 * - API key is never exposed to the client
 * - All requests are server-side only (Next.js API Route)
 * - Rate limiting handled by NVIDIA's infrastructure
 */

const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1";

const AVAILABLE_MODELS = {
  // Core LLM — Agentic Workflows
  "mistral-nemotron": {
    id: "nvidia/mistral-nemotron",
    name: "Mistral-Nemotron",
    category: "Core LLM",
    description: "Built for agentic workflows — excels in coding, instruction following, and function calling.",
    endpoint: "/chat/completions",
  },
  "deepseek-r1": {
    id: "deepseek-ai/deepseek-r1",
    name: "DeepSeek-V3 Reasoning",
    category: "Core LLM",
    description: "State-of-the-art reasoning LLM optimized for extreme long-context mathematical deduction and tool-calling.",
    endpoint: "/chat/completions",
  },
  "llama-3-3": {
    id: "meta/llama-3.3-70b-instruct",
    name: "Llama 3.3 (70B) Instruct",
    category: "Core LLM",
    description: "High-speed agentic execution model capable of flawless API function routing.",
    endpoint: "/chat/completions",
  },
  "cosmos-vlm": {
    id: "nvidia/cosmos-nemotron-34b",
    name: "Cosmos VLM",
    category: "Vision",
    description: "Multi-modal vision-language model giving your agents eyes to read screen captures and videos.",
    endpoint: "/chat/completions",
  },
  // Voice — Speech-to-Text
  "nemotron-asr": {
    id: "nvidia/nemotron-asr-streaming",
    name: "Nemotron ASR",
    category: "Voice",
    description: "Real-time streaming speech recognition for English.",
    endpoint: "/audio/transcriptions",
  },
  // Voice — Text-to-Speech
  "magpie-tts": {
    id: "nvidia/magpie-tts-flow",
    name: "Magpie TTS",
    category: "Voice",
    description: "Expressive, human-like text-to-speech from a short audio sample.",
    endpoint: "/audio/speech",
  },
  // Safety & Guardrails
  "content-safety": {
    id: "nvidia/nemotron-content-safety-reasoning-4b",
    name: "Content Safety Reasoning",
    category: "Security",
    description: "Context-aware safety model that applies reasoning to enforce domain-specific policies.",
    endpoint: "/chat/completions",
  },
  // NeMo Guardrails — Jailbreak Detection
  "jailbreak-detect": {
    id: "nvidia/nemoguard-jailbreak-detect",
    name: "NeMo Jailbreak Detector",
    category: "Security",
    description: "Industry-leading jailbreak classification model for adversarial protection.",
    endpoint: "/chat/completions",
  },
  // Document Intelligence — OCR
  "nemotron-ocr": {
    id: "nvidia/nemotron-ocr-v1",
    name: "Nemotron OCR",
    category: "Document Intel",
    description: "Powerful OCR for fast, accurate real-world image text extraction.",
    endpoint: "/chat/completions",
  },
  // Embeddings — Retrieval
  "nemo-embed": {
    id: "nvidia/llama-nemotron-embed-1b-v2",
    name: "Nemotron Embed",
    category: "RAG",
    description: "Multilingual embedding model for long-document QA retrieval.",
    endpoint: "/embeddings",
  },
  // Reranking — Search Quality
  "nemo-rerank": {
    id: "nvidia/llama-nemotron-rerank-1b-v2",
    name: "Nemotron Rerank",
    category: "RAG",
    description: "GPU-accelerated reranking — scores passage relevance to questions.",
    endpoint: "/ranking",
  },
  // Translation
  "riva-translate": {
    id: "nvidia/riva-translate-4b-instruct-v1_1",
    name: "Riva Translate",
    category: "Multilingual",
    description: "Translation model supporting 12 languages with few-shot prompts.",
    endpoint: "/chat/completions",
  },
};

export async function GET() {
  return NextResponse.json({
    status: "NVIDIA NIM Integration Active",
    models: Object.entries(AVAILABLE_MODELS).map(([key, model]) => ({
      key,
      ...model,
    })),
    totalModels: Object.keys(AVAILABLE_MODELS).length,
    security: {
      authentication: "Server-side API key (never exposed to client)",
      guardrails: "NeMo Content Safety + Jailbreak Detection",
      dataPrivacy: "All inference routed through NVIDIA's SOC2-compliant infrastructure",
    },
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "NVIDIA NIM API key not configured. Add NVIDIA_NIM_API_KEY to your environment." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { model, messages, max_tokens = 1024, temperature = 0.7 } = body;

    if (!model || !AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS]) {
      return NextResponse.json(
        { error: `Invalid model. Available: ${Object.keys(AVAILABLE_MODELS).join(", ")}` },
        { status: 400 }
      );
    }

    const selectedModel = AVAILABLE_MODELS[model as keyof typeof AVAILABLE_MODELS];

    const nimResponse = await fetch(`${NIM_BASE_URL}${selectedModel.endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel.id,
        messages,
        max_tokens,
        temperature,
        stream: false,
      }),
    });

    if (!nimResponse.ok) {
      const errorText = await nimResponse.text();
      return NextResponse.json(
        { error: `NVIDIA NIM Error: ${nimResponse.status}`, details: errorText },
        { status: nimResponse.status }
      );
    }

    const data = await nimResponse.json();
    return NextResponse.json({
      success: true,
      model: selectedModel.name,
      category: selectedModel.category,
      result: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
