import { NextResponse } from "next/server";
import { remember } from "@/lib/memory";

// Mathematical simulation constants for Apex Media Buying
const PLATFORMS = ["Meta (FB/IG)", "Google Search", "TikTok Ads", "YouTube TrueView"];

type AllocationMatrix = {
    platform: string;
    budgetPercentage: number;
    simulatedCPA: number;
    status: "SCALING" | "LEARNING" | "KILLING";
};

export async function POST(req: Request) {
  try {
    const { directive, dailyBudget } = await req.json();

    if (!directive || !dailyBudget) {
      return NextResponse.json({ error: "Missing Apex Directive or Capital limit." }, { status: 400 });
    }

    // 1. Algorithmic Budget Distribution
    // The Ad-Buyer parses the strategy and mathematically splits the bankroll.
    const allocationSeed = Math.random();
    let matrix: AllocationMatrix[] = [];
    
    // Distribute 100% of the budget using random weighting to simulate AI decisioning
    let remainingBudget = 100;
    PLATFORMS.forEach((platform, index) => {
        if (index === PLATFORMS.length - 1) {
            // Allocate the rest to the last platform
            matrix.push({
                platform,
                budgetPercentage: remainingBudget,
                simulatedCPA: parseFloat((Math.random() * 50 + 15).toFixed(2)),
                status: remainingBudget > 30 ? "SCALING" : "LEARNING"
            });
        } else {
             // Allocate a random chunk less than the remaining
             const randomChunk = Math.floor(Math.random() * remainingBudget * 0.7);
             remainingBudget -= randomChunk;
             matrix.push({
                 platform,
                 budgetPercentage: randomChunk,
                 simulatedCPA: parseFloat((Math.random() * 80 + 10).toFixed(2)),
                 status: randomChunk < 10 ? "KILLING" : "LEARNING"
             });
        }
    });
    
    // Sort by budget allocation (highest first)
    matrix.sort((a, b) => b.budgetPercentage - a.budgetPercentage);

    // 2. Performance Simulation (Calculating expected ROAS)
    const simulatedImpressions = Math.floor((dailyBudget / Math.random() / 0.05));
    const simulatedClicks = Math.floor(simulatedImpressions * (Math.random() * 0.08));
    const aggregateCPA = parseFloat((matrix.reduce((acc, curr) => acc + curr.simulatedCPA, 0) / matrix.length).toFixed(2));
    const projectedLeads = Math.floor(simulatedClicks * 0.12); // 12% opt-in
    
    const deploymentPayload = {
         timestamp: new Date().toISOString(),
         dailyCapitalDrawn: dailyBudget,
         matrix,
         projections: {
             impressions: simulatedImpressions,
             clicks: simulatedClicks,
             leadsV1: projectedLeads,
             blendedCPA: aggregateCPA
         }
    };

    // 3. Log Capital Deployment to God-Brain Memory
    const memoryString = `[APEX AD-BUYER] Generated algorithmic capital matrix. Daily Draw: $${dailyBudget}. Predicted CPL: $${aggregateCPA}.`;
    await remember(memoryString, { type: "capital-allocation", payload: JSON.stringify(deploymentPayload) });

    return NextResponse.json({
        success: true,
        data: deploymentPayload
    });

  } catch (error: any) {
    console.error("[Apex Ad-Buyer Error]:", error);
    return NextResponse.json({ error: "Capital Allocation failure." }, { status: 500 });
  }
}
