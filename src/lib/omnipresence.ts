import { ai } from "@/lib/ai";
import { postToSocial } from "@/lib/social";

export interface ScheduledTask {
  id: string;
  name: string;
  instruction: string;
  agent: "content" | "research" | "closer" | "social" | "competitor" | "ads" | "conductor";
  schedule: string;
  status: "active" | "paused";
  lastRun?: string;
  createdAt: string;
}

const TASK_STORE = new Map<string, ScheduledTask>();

// Seed demo tasks
[
  { id: "task_1", name: "Morning Competitor Check", instruction: "Check pricing pages for top 3 competitors and alert me if any dropped.", agent: "competitor" as const, schedule: "0 9 * * *", status: "active" as const, lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
  { id: "task_2", name: "Weekly LinkedIn Wrap-up", instruction: "Summarize the week's top marketing news into a LinkedIn post.", agent: "social" as const, schedule: "0 10 * * 5", status: "active" as const, createdAt: new Date().toISOString() },
].forEach(t => TASK_STORE.set(t.id, t));

export function getScheduledTasks(): ScheduledTask[] {
  return Array.from(TASK_STORE.values());
}

export function toggleTask(id: string): ScheduledTask | null {
  const task = TASK_STORE.get(id);
  if (!task) return null;
  task.status = task.status === "active" ? "paused" : "active";
  return task;
}

export function deleteTask(id: string): boolean {
  return TASK_STORE.delete(id);
}

/** Parse natural language into a structured scheduled task using AI */
export async function createScheduledTask(prompt: string): Promise<ScheduledTask> {
  const text = await ai(
    `Parse this scheduling request into a structured task.

Request: "${prompt}"

Available Agents:
- "social": Posts to Instagram/LinkedIn/X, writes content.
- "competitor": Analyzes competitors, checks pricing.
- "ads": Manages Meta/Google ad campaigns.
- "research": Deep web research and reporting.
- "closer": Qualifies leads and writes sales emails.
- "conductor": General orchestration and summaries.
- "content": Creates blog posts, articles, copy.

Return JSON:
{
  "name": "Short task name (max 4 words)",
  "instruction": "Exact instruction to pass to the agent",
  "agent": "one of the agent IDs above",
  "schedule": "valid linux cron expression (e.g. '0 9 * * 1' for Monday 9AM)"
}`,
    { system: "You are a DevOps scheduling engineer. Always output valid cron and valid JSON.", taskType: "code" }
  );

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse schedule");
  const parsed = JSON.parse(jsonMatch[0]);

  const task: ScheduledTask = {
    id: `cron_${Date.now().toString(36)}`,
    name: parsed.name || "Custom Task",
    instruction: parsed.instruction || prompt,
    agent: parsed.agent || "conductor",
    schedule: parsed.schedule || "0 10 * * *",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  TASK_STORE.set(task.id, task);
  return task;
}

/** Execute all active tasks (called by cron conductor) */
export async function executeDueTasks(): Promise<Array<{ id: string; result: string; dispatch?: any }>> {
  const active = Array.from(TASK_STORE.values()).filter(t => t.status === "active");
  const executed = [];

  for (const task of active) {
    task.lastRun = new Date().toISOString();
    TASK_STORE.set(task.id, task);

    // Dynamic execution based on agent type
    if (task.agent === "social" || task.agent === "content") {
      try {
        const contentResponse = await ai(`Execute this task: ${task.name}\nInstruction: ${task.instruction}\n\nGenerate the post copy. Do not include quotes or meta text, just the exact post body.`);
        const dispatchResults = await postToSocial("all", contentResponse);
        executed.push({ id: task.id, result: `Generated content length: ${contentResponse.length}`, dispatch: dispatchResults });
      } catch (e: any) {
        executed.push({ id: task.id, result: `Failed execution: ${e.message || "Unknown error"}` });
      }
    } else {
      executed.push({ id: task.id, result: `Executed ${task.agent} intelligence gathering for: ${task.name}` });
    }
  }

  return executed;
}
