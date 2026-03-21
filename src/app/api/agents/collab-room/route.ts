import { NextResponse } from "next/server";

/**
 * AGENT COLLABORATION ROOMS — Multiple agents work on the same task,
 * debate each other, and reach consensus through structured deliberation.
 * 
 * Beyond simple swarm — this is parliamentary debate:
 * 1. Each agent independently proposes a solution
 * 2. Agents critique each other's proposals
 * 3. A chairperson synthesizes the final consensus
 */

export async function POST(request: Request) {
  try {
    const { task, room_type = "debate", participants } = await request.json();

    if (!task) {
      return NextResponse.json({ error: "task is required." }, { status: 400 });
    }

    const nimKey = process.env.NVIDIA_NIM_API_KEY;
    if (!nimKey) {
      return NextResponse.json({ error: "NVIDIA_NIM_API_KEY not configured." }, { status: 500 });
    }

    const agents = participants || [
      { model: "deepseek-ai/deepseek-v3.2", name: "Strategist", role: "You are a strategic thinker. Focus on long-term impact, market positioning, and competitive advantage." },
      { model: "mistralai/mistral-nemotron", name: "Operator", role: "You are a practical operator. Focus on execution feasibility, resource requirements, and implementation steps." },
      { model: "z-ai/glm-4.7", name: "Critic", role: "You are a devil's advocate. Challenge assumptions, identify risks, and find weaknesses in every proposal." },
    ];

    // ROUND 1: Independent proposals
    const proposals = await Promise.all(
      agents.map(async (agent: { model: string; name: string; role: string }) => {
        try {
          const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${nimKey}` },
            body: JSON.stringify({
              model: agent.model,
              messages: [
                { role: "system", content: `${agent.role} You are in a collaboration room with other AI agents. Present your proposal clearly and concisely.` },
                { role: "user", content: `Task: ${task}\n\nProvide your proposal (max 200 words).` },
              ],
              max_tokens: 400,
              temperature: 0.7,
            }),
          });
          const data = await res.json();
          return { agent: agent.name, model: agent.model, proposal: data?.choices?.[0]?.message?.content || "No response" };
        } catch (err) {
          return { agent: agent.name, model: agent.model, proposal: `Error: ${String(err)}` };
        }
      })
    );

    // ROUND 2: Cross-critique (each agent critiques the others)
    const critiquesPrompt = proposals
      .map((p, i) => `=== ${p.agent}'s Proposal ===\n${p.proposal}`)
      .join("\n\n");

    const critiques = await Promise.all(
      agents.map(async (agent: { model: string; name: string; role: string }, idx: number) => {
        try {
          const othersProposals = proposals
            .filter((_, i) => i !== idx)
            .map(p => `${p.agent}: ${p.proposal}`)
            .join("\n\n");

          const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${nimKey}` },
            body: JSON.stringify({
              model: agent.model,
              messages: [
                { role: "system", content: `${agent.role} Review the other agents' proposals and provide constructive critique. Identify strengths and weaknesses. Be specific.` },
                { role: "user", content: `Your proposal: ${proposals[idx].proposal}\n\nOther proposals:\n${othersProposals}\n\nProvide your critique (max 150 words).` },
              ],
              max_tokens: 300,
              temperature: 0.5,
            }),
          });
          const data = await res.json();
          return { agent: agent.name, critique: data?.choices?.[0]?.message?.content || "No critique" };
        } catch {
          return { agent: agent.name, critique: "Critique unavailable" };
        }
      })
    );

    // ROUND 3: Chairperson consensus
    const deliberationLog = proposals.map((p, i) => 
      `PROPOSAL by ${p.agent}:\n${p.proposal}\n\nCRITIQUE by ${critiques[i].agent}:\n${critiques[i].critique}`
    ).join("\n\n---\n\n");

    const consensusRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${nimKey}` },
      body: JSON.stringify({
        model: "deepseek-ai/deepseek-v3.2",
        messages: [
          {
            role: "system",
            content: "You are the chairperson of an AI collaboration room. Review all proposals and critiques below. Synthesize the BEST possible consensus that incorporates the strongest elements and addresses all valid criticisms. Output a clear, actionable consensus with specific next steps.",
          },
          { role: "user", content: `Task: ${task}\n\nDeliberation record:\n${deliberationLog}` },
        ],
        max_tokens: 800,
        temperature: 0.3,
      }),
    });

    const consensusData = await consensusRes.json();

    return NextResponse.json({
      success: true,
      mode: "COLLABORATION_ROOM",
      room_type,
      task,
      participants: agents.map((a: { name: string }) => a.name),
      rounds: {
        proposals: proposals.map(p => ({ agent: p.agent, proposal: p.proposal })),
        critiques: critiques.map(c => ({ agent: c.agent, critique: c.critique })),
        consensus: consensusData?.choices?.[0]?.message?.content || "Consensus unavailable",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Collaboration room error", details: String(error) }, { status: 500 });
  }
}
