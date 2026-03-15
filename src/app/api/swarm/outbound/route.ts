import { NextResponse } from "next/server";
import { db } from "@/db";
import { globalTelemetry } from "@/db/schema";
import crypto from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini (using Google AI Ultra capability for classification)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  systemInstruction: "You are an elite B2B prospect qualifier for Sovereign Systems. Given raw scraped profile data (website copy, social bios, reviews), determine if this entity qualifies for 'The Clarity Protocol' (high-ticket coaching/optimization). Return ONLY a JSON object: { \"qualified\": boolean, \"rationale\": \"brief reason\", \"estimated_budget_tier\": \"high\" | \"medium\" | \"low\", \"personalization_angle\": \"specific hook based on their data\" }. Qualify if they show signs of burnout, need for systemization, or are high-performers (founders, agency owners, athletes)."
});

export async function POST(req: Request) {
  try {
    const { niche, location, maxLeads = 5 } = await req.json();

    if (!niche || !location) {
      return NextResponse.json({ error: "Missing niche or location parameters" }, { status: 400 });
    }

    const logId = `outbound_${crypto.randomUUID().slice(0, 8)}`;
    console.log(`[Outbound Swarm] Initiating hunt for: ${niche} in ${location}`);

    // 1. Trigger the Scraper (OpenClaw/Apify mock)
    // In production, this would hit your locally running OpenClaw instance or an API like Apify.
    // For now, we simulate the scraped return data based on the requested niche + location.
    const mockScrapedLeads = [
      {
        name: `${location} Apex Functional Fitness`,
        website: `apexfit-${location.toLowerCase().replace(/\s+/g, '')}.com`,
        bio: `Elite hybrid training facility in ${location}. We build unbroken athletes.`,
        metaDescription: `Premier functional fitness gym in ${location}. Struggling to scale our classes.`,
        contactEmail: `owner@apexfit-${location.toLowerCase().replace(/\s+/g, '')}.com`
      },
      {
        name: `Zenith Meal Prep - ${location}`,
        website: `zenithmeals-${location.toLowerCase().replace(/\s+/g, '')}.com`,
        bio: `${niche} organic, macros-tracked meals delivered.`,
        metaDescription: `Healthy eating made simple for ${niche} professionals.`,
        contactEmail: `hello@zenithmeals-${location.toLowerCase().replace(/\s+/g, '')}.com`
      }
    ].slice(0, maxLeads);

    const qualifiedLeads = [];

    // 2. Data Ingestion & Qualification via Gemini 2.5 Pro
    for (const lead of mockScrapedLeads) {
      try {
        const prompt = `Analyze this lead:\nName: ${lead.name}\nWebsite: ${lead.website}\nBio: ${lead.bio}\nMeta Description: ${lead.metaDescription}`;
        const result = await model.generateContent(prompt);
        let textResult = result.response.text();
        
        // Strip markdown blocks if present
        textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
        const analysis = JSON.parse(textResult);

        if (analysis.qualified) {
          qualifiedLeads.push({
            ...lead,
            qualificationData: analysis
          });
        }
      } catch (err) {
        console.warn(`[Outbound Swarm] Failed to qualify lead ${lead.name}:`, err);
      }
    }

    console.log(`[Outbound Swarm] Qualified ${qualifiedLeads.length} out of ${mockScrapedLeads.length} leads.`);

    // 3. N8N Handoff (Trigger the Drip Sequence)
    // Dispatch qualified leads to the N8N central hub to add to CRM and start email/WhatsApp sequences
    let crmDispatched = false;
    if (qualifiedLeads.length > 0) {
       await fetch("http://localhost:5678/webhook/outbound-lead-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: logId, leads: qualifiedLeads, niche, location })
      }).then(() => {
        crmDispatched = true;
        console.log(`[Outbound Swarm] Dispatched payload to N8N webhook.`);
      }).catch(err => console.error("N8N CRM webhook dispatch failed:", err));
    }

    // 4. Telemetry Logging
    await db.insert(globalTelemetry).values({
      tenantId: "00000000-0000-0000-0000-000000000000",
      eventType: "outbound_swarm_deployed",
      payload: JSON.stringify({ 
        batchId: logId,
        searchParams: { niche, location, maxLeads },
        results: { scraped: mockScrapedLeads.length, qualified: qualifiedLeads.length },
        crmDispatched,
        timestamp: Date.now() 
      }),
    });

    return NextResponse.json({
        success: true,
        message: `Outbound hunt complete. Gathered and qualified leads.`,
        data: {
          batchId: logId,
          metrics: { scraped: mockScrapedLeads.length, qualified: qualifiedLeads.length },
          dispatchedToCRM: crmDispatched,
          leads: qualifiedLeads
        }
    });

  } catch (error: unknown) {
    console.error("[Outbound Swarm Error]:", error);
    const msg = error instanceof Error ? error.message : "Failed to orchestrate outbound swarm";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
