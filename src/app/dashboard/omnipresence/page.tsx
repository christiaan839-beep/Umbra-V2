"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Play, Pause, Trash2, Sparkles, Loader2, Workflow } from "lucide-react";

interface ScheduledTask {
  id: string;
  name: string;
  instruction: string;
  agent: string;
  schedule: string;
  status: "active" | "paused";
  lastRun?: string;
}

const AGENT_COLORS: Record<string, string> = {
  content: "#E1306C",
  research: "#00d4ff",
  closer: "#ffd700",
  social: "#1DA1F2",
  competitor: "#00ff88",
  ads: "#6c63ff",
  conductor: "#8888aa",
};

export default function OmnipresencePage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/omnipresence");
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } catch {}
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      await fetch("/api/omnipresence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", prompt: prompt.trim() }),
      });
      setPrompt("");
      await fetchTasks();
    } finally { setLoading(false); }
  };

  const handleToggle = async (id: string) => {
    await fetch("/api/omnipresence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", id }),
    });
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/omnipresence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    fetchTasks();
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Workflow className="w-3 h-3" /> Automation
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Omnipresence Engine</h1>
        <p className="text-sm text-text-secondary mt-1">Schedule 24/7 autonomous agents using natural language.</p>
      </div>

      {/* Natural Language Input */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5 mb-6">
        <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-emerald-400" /> What should your agents do, and when?
        </label>
        <div className="flex gap-3">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. Check competitor pricing every Tuesday morning and alert me if they drop"
            className="flex-1 bg-onyx border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 placeholder-text-secondary/40"
          />
          <button onClick={handleCreate} disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-emerald-500 text-midnight font-bold rounded-xl hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-2 shrink-0">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule"}
          </button>
        </div>
      </motion.div>

      {/* Task List */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary px-1">Active Schedules</h2>
        
        {tasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-glass-border rounded-xl text-text-secondary text-sm">
            No tasks scheduled yet. Tell your agents what to do above.
          </div>
        ) : (
          tasks.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`glass-card p-4 flex items-center gap-4 ${task.status === "paused" ? "opacity-50" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white truncate">{task.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0"
                    style={{ background: `${AGENT_COLORS[task.agent] || "#666"}15`, color: AGENT_COLORS[task.agent] || "#666" }}>
                    {task.agent}
                  </span>
                  {task.status === "paused" && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-500/10 text-red-400">Paused</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary truncate">{task.instruction}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-text-secondary bg-onyx px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-emerald-400" /> {task.schedule}
                  </span>
                  {task.lastRun && <span className="text-[10px] text-text-secondary">Last: {new Date(task.lastRun).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleToggle(task.id)} className="p-2 hover:bg-glass-bg rounded-lg transition-colors">
                  {task.status === "active" ? <Pause className="w-4 h-4 text-text-secondary" /> : <Play className="w-4 h-4 text-emerald-400" />}
                </button>
                <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-text-secondary hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
