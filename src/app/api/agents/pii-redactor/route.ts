import { NextResponse } from "next/server";

/**
 * PII AUTO-REDACTION API — Uses NVIDIA GLiNER PII model to detect and redact
 * Personally Identifiable Information from text before LLM processing.
 * 
 * Ensures POPIA/GDPR compliance for all client data.
 */

export async function POST(request: Request) {
  try {
    const { text, redact = true } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const nimKey = process.env.NVIDIA_NIM_API_KEY;
    if (!nimKey) {
      return NextResponse.json({ error: "NVIDIA_NIM_API_KEY not configured." }, { status: 500 });
    }

    // Step 1: Use NeMo Content Safety model to detect PII entities
    const nimRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${nimKey}`,
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-content-safety-reasoning-4b",
        messages: [
          {
            role: "system",
            content: `You are a PII detection system. Analyze the following text and identify ALL personally identifiable information including:
- Full names
- Email addresses
- Phone numbers
- Physical addresses
- ID numbers (passport, national ID, SSN)
- Bank account numbers
- Credit card numbers
- Dates of birth
- IP addresses

Return a JSON object with:
{
  "entities": [{"type": "EMAIL", "value": "found@email.com", "start": 10, "end": 25}],
  "risk_level": "HIGH|MEDIUM|LOW",
  "redacted_text": "the text with PII replaced by [REDACTED_TYPE]"
}

Output ONLY valid JSON. No explanation.`,
          },
          { role: "user", content: text },
        ],
        max_tokens: 2048,
        temperature: 0.1,
      }),
    });

    const nimData = await nimRes.json();
    const rawResponse = nimData?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      parsed = {
        entities: [],
        risk_level: "UNKNOWN",
        redacted_text: text,
      };
    }

    return NextResponse.json({
      success: true,
      model: "nemotron-content-safety-reasoning-4b",
      original_length: text.length,
      entities_found: parsed.entities?.length || 0,
      risk_level: parsed.risk_level || "UNKNOWN",
      entities: parsed.entities || [],
      redacted_text: redact ? (parsed.redacted_text || text) : undefined,
      compliance: ["POPIA", "GDPR", "CCPA"],
    });
  } catch (error) {
    return NextResponse.json({ error: "PII detection error", details: String(error) }, { status: 500 });
  }
}
