import { ai } from "@/lib/ai";
import { recall } from "@/lib/memory";
import { adSwarm } from "@/lib/swarm";
import type { GhostAction, Campaign } from "@/types";

/** Simulated campaign database */
const campaigns: Campaign[] = [
  { id: "c1", name: "AI Suite - Pain Point", spend: 340, revenue: 2100, status: "ACTIVE" },
  { id: "c2", name: "Ghost Mode - FOMO", spend: 280, revenue: 190, status: "ACTIVE" },
  { id: "c3", name: "ROI Calculator - Logic", spend: 150, revenue: 890, status: "ACTIVE" },
];

const DAILY_BUDGET = 500;

function roas(c: Campaign): number {
  return c.spend > 0 ? c.revenue / c.spend : 0;
}

/** Execute a full autonomous Ghost Mode cycle */
export async function executeGhostCycle(): Promise<GhostAction[]> {
  const actions: GhostAction[] = [];

  // 1. Evaluate existing campaigns
  for (const c of campaigns) {
    if (c.status !== "ACTIVE") continue;
    const campaignROAS = roas(c);

    if (campaignROAS < 1.0 && c.spend > 100) {
      c.status = "KILLED";
      actions.push({
        id: `ga_${Date.now()}`,
        type: "KILL",
        platform: "meta",
        budget: 0,
        reasoning: `${c.name}: ROAS ${campaignROAS.toFixed(1)}x below 1.0 threshold after $${c.spend} spend. Killed.`,
        timestamp: new Date().toISOString(),
      });
    } else if (campaignROAS > 3.0) {
      actions.push({
        id: `ga_${Date.now()}`,
        type: "SCALE",
        platform: "meta",
        budget: Math.round(c.spend * 1.3),
        reasoning: `${c.name}: ROAS ${campaignROAS.toFixed(1)}x exceeds 3.0. Scaling budget 30%.`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // 2. Launch new campaign with Swarm-generated copy
  const memories = await recall("best performing ad copy high conversion");
  const context = memories.map(m => m.entry.text).join(" | ") || "No prior winning copy found.";
  const swarmResult = await adSwarm(
    `AI marketing automation platform. Context from winners: ${context}`,
    "Transformation + Exclusivity"
  );

  actions.push({
    id: `ga_${Date.now()}`,
    type: "LAUNCH",
    platform: "meta",
    budget: Math.min(DAILY_BUDGET, 200),
    reasoning: `Swarm generated new ad copy (${swarmResult.rounds} rounds, ${swarmResult.approved ? "approved" : "best effort"}).`,
    adCopy: swarmResult.finalOutput,
    timestamp: new Date().toISOString(),
  });

  return actions;
}

export function getCampaigns(): Campaign[] {
  return [...campaigns];
}
