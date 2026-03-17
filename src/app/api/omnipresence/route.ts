import { NextResponse } from "next/server";
import { getScheduledTasks, createScheduledTask, toggleTask, deleteTask, executeDueTasks } from "@/lib/omnipresence";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  return NextResponse.json({ tasks: getScheduledTasks() });
}

export async function POST(req: Request) {
  const auth = await requireAuth(); if (auth.error) return auth.error;
  try {
    const { action, prompt, id } = await req.json();

    switch (action) {
      case "create": {
        if (!prompt?.trim()) return NextResponse.json({ error: "Prompt required." }, { status: 400 });
        const task = await createScheduledTask(prompt);
        return NextResponse.json({ success: true, task });
      }
      case "toggle": {
        const task = toggleTask(id);
        if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
        return NextResponse.json({ success: true, task });
      }
      case "delete": {
        deleteTask(id);
        return NextResponse.json({ success: true });
      }
      case "execute": {
        const results = await executeDueTasks();
        return NextResponse.json({ success: true, results });
      }
      default:
        return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }
  } catch (error) {
    console.error("[Omnipresence API]:", error);
    return NextResponse.json({ error: "Omnipresence operation failed." }, { status: 500 });
  }
}
