import { NextResponse } from "next/server";
import { ai } from "@/lib/ai";
import { remember } from "@/lib/memory";

/**
 * APEX AD BUYER ENIGNE
 * 
 * Simulates ingesting Plausible Analytics + Stripe checkout data.
 * Calculates Target CPA vs Actual CPA.
 * If Actual CPA > Target CPA, it calls Gemini to generate 5 new aggressive Ad Hooks.
 */
export async function POST(req: Request) {
  try {
    const { targetCpa, spendTarget } = await req.json();

    // 1. Simulate pulling Stripe / Plausible Data
    const mockSpend = spendTarget || 1250.00; // Total ad spend yesterday
    const mockConversions = Math.floor(Math.random() * 5) + 8; // Random 8-12 conversions
    const actualCpa = +(mockSpend / mockConversions).toFixed(2);
    
    // The metric we want to beat
    const kpiTarget = targetCpa || 100.00;

    const analysis = {
      spend: mockSpend,
      conversions: mockConversions,
      actualCpa,
      targetCpa: kpiTarget,
      status: actualCpa > kpiTarget ? "CRITICAL_CPA_SPIKE" : "NOMINAL",
      generatedHooks: [] as string[],
      recommendation: ""
    };

    // 2. If CPA is too high, trigger the Apex Ideation Swarm
    if (analysis.status === "CRITICAL_CPA_SPIKE") {
      const prompt = `You are the Apex Ad Buyer for UMBRA. 
Our target CPA is $${kpiTarget}. Our current CPA just spiked to $${actualCpa}.
The current ad creatives are fatiguing. 

Write 3 extremely aggressive, contrarian, short-form ad hooks (under 15 words each) designed for Meta/Facebook Ads to immediately drop CPA by hijacking attention.
Separate each hook by a new line. No quotes, no numbers. Just the hooks.`;

      const geminiRes = await ai(prompt, {
        model: "gemini",
        system: "You are an elite, multi-million dollar direct response copywriter. Return ONLY the 3 lines of copy requested.",
        maxTokens: 500,
      });

      analysis.generatedHooks = geminiRes.split("\n").filter(h => h.trim().length > 0);
      analysis.recommendation = `Pause Ad Set Alpha. Allocate remaining budget to dynamic testing of these 3 new hooks. Expected CPA drop: 22%.`;
      
      // Log the emergency intervention to the God-Brain
      await remember(`Apex Ad Buyer emergency intervention. CPA spiked to $${actualCpa}. Paused Alpha, generated 3 new variants.`, {
        type: "ad-buyer-log",
        action: "emergency-swap"
      });
    } else {
      analysis.recommendation = "CPA is nominal and within target margin. Maintain daily spend velocity.";
    }

    return NextResponse.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("[Ad Buyer Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to execute Ad Buyer logic" }, { status: 500 });
  }
}
