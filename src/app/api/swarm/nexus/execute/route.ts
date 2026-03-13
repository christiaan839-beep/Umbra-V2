import { NextResponse } from "next/server";
import { remember } from "@/lib/memory";

export async function POST(req: Request) {
  try {
    const { workflowName, nodes } = await req.json();

    if (!nodes || nodes.length === 0) {
      return NextResponse.json({ error: "Invalid workflow configuration: No nodes provided." }, { status: 400 });
    }

    // Simulate Execution Cascade
    let executionLog = [];
    let currentPayload = { context: "Initial Trigger Event" };

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Simulate processing time per node
        await new Promise(resolve => setTimeout(resolve, 800));

        let nodeResult = "Success";
        
        if (node.type === "trigger") {
            currentPayload = { ...currentPayload, [node.id]: "Trigger Activated" };
        } else if (node.type === "action") {
            currentPayload = { ...currentPayload, [node.id]: `Action '${node.label}' Executed` };
        } else if (node.type === "condition") {
             // 90% chance condition passes
            if (Math.random() > 0.1) {
                nodeResult = "Condition Met -> Routing TRUE";
            } else {
                nodeResult = "Condition Failed -> Routing FALSE -> Terminating Cascade";
                executionLog.push({ nodeId: node.id, label: node.label, status: "Terminated", details: nodeResult });
                break; // Stop cascade
            }
        }

        executionLog.push({
            nodeId: node.id,
            label: node.label,
            status: "Completed",
            details: nodeResult,
            timestamp: new Date().toISOString()
        });
    }

    // Log the entire workflow execution to the God-Brain
    const memoryPayload = `[NEXUS ORCHESTRATOR] Executed Workflow: '${workflowName || 'Unnamed Workflow'}'. Nodes Traversed: ${executionLog.length}. Final State: ${executionLog[executionLog.length - 1]?.status || 'Unknown'}`;
    await remember(memoryPayload, { type: "workflow-execution", logs: JSON.stringify(executionLog) });

    return NextResponse.json({
        success: true,
        data: {
            workflow: workflowName,
            cascadeLog: executionLog,
            finalPayload: currentPayload
        }
    });

  } catch (error: any) {
    console.error("[Nexus Execution Error]:", error);
    return NextResponse.json({ error: "Failed to cascade workflow execution" }, { status: 500 });
  }
}
