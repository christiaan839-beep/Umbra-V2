"use client";

import React, { useState, useEffect } from "react";
import {
  Shield, Play, Plus, Trash2, RefreshCcw, Loader2,
  CheckCircle2, XCircle, AlertTriangle, ChevronRight, Lock,
  Terminal, Activity, Zap
} from "lucide-react";

interface AgentInstance {
  id: string;
  name: string;
  status: string;
  guardrails: string[];
  sandbox: string;
  tasks_completed: number;
  violations_blocked: number;
  created_at: string;
}

const GUARDRAIL_OPTIONS = [
  "no-pii-leakage", "no-financial-advice", "no-medical-advice",
  "topic-lock", "no-competitor-mention", "no-prompt-injection",
  "rate-limit-enforce", "no-code-execution", "data-retention-policy", "audit-trail-required",
];

export default function NemoClawDashboard() {
  const [agents, setAgents] = useState<AgentInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGuardrails, setSelectedGuardrails] = useState<string[]>(["no-pii-leakage", "no-prompt-injection", "topic-lock"]);
  const [agentName, setAgentName] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [execResult, setExecResult] = useState<Record<string, unknown> | null>(null);
  const [execLoading, setExecLoading] = useState(false);

  const fetchAgents = async () => {
    const res = await fetch("/api/agents/nemoclaw");
    const data = await res.json();
    setAgents(data.agents || []);
  };

  useEffect(() => { fetchAgents(); }, []);

  const deploy = async () => {
    setLoading(true);
    await fetch("/api/agents/nemoclaw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "deploy",
        config: { name: agentName || undefined, guardrails: selectedGuardrails },
      }),
    });
    setAgentName("");
    await fetchAgents();
    setLoading(false);
  };

  const execute = async (agentId: string) => {
    if (!taskInput.trim()) return;
    setExecLoading(true);
    setExecResult(null);
    const res = await fetch("/api/agents/nemoclaw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "execute", agentId, config: { task: taskInput } }),
    });
    const data = await res.json();
    setExecResult(data);
    setExecLoading(false);
    await fetchAgents();
  };

  const heal = async (agentId: string) => {
    await fetch("/api/agents/nemoclaw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "heal", agentId }),
    });
    await fetchAgents();
  };

  const terminate = async (agentId: string) => {
    await fetch("/api/agents/nemoclaw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "terminate", agentId }),
    });
    setActiveAgent(null);
    setExecResult(null);
    await fetchAgents();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="border-b border-red-500/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[0.2em]">NemoClaw Control Plane</h1>
              <p className="text-red-500/60 text-xs uppercase tracking-widest">Self-Healing Agent Sandbox · Policy Enforcement · Zero Trust</p>
            </div>
          </div>
        </header>

        {/* Architecture Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "OpenClaw", desc: "Agent Framework", icon: Terminal, color: "#00ff66" },
            { label: "NeMo Guardrails", desc: "Policy Engine", icon: Shield, color: "#FF0055" },
            { label: "OpenShell", desc: "Sandbox Layer", icon: Lock, color: "#00B7FF" },
            { label: "Self-Healing", desc: "Auto Recovery", icon: RefreshCcw, color: "#A855F7" },
          ].map(item => (
            <div key={item.label} className="bg-neutral-950 border border-neutral-800 p-4">
              <item.icon className="w-4 h-4 mb-2" style={{ color: item.color }} />
              <p className="text-xs font-bold text-white">{item.label}</p>
              <p className="text-[9px] text-neutral-600 uppercase tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Deploy Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-neutral-950 border border-neutral-800 p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00ff66]" /> Deploy Agent
              </h2>
              <input
                type="text"
                value={agentName}
                onChange={e => setAgentName(e.target.value)}
                placeholder="Agent name (optional)"
                className="w-full bg-black border border-neutral-800 px-3 py-2.5 text-xs text-white placeholder:text-neutral-700 focus:outline-none focus:border-neutral-600"
              />
              <div>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-2">Guardrails</p>
                <div className="flex flex-wrap gap-1.5">
                  {GUARDRAIL_OPTIONS.map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGuardrails(prev =>
                        prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
                      )}
                      className={`px-2 py-1 text-[8px] uppercase tracking-widest font-bold border transition-all ${
                        selectedGuardrails.includes(g)
                          ? "bg-red-500/20 border-red-500/50 text-red-400"
                          : "bg-transparent border-neutral-800 text-neutral-600 hover:text-neutral-400"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={deploy}
                disabled={loading}
                className="w-full py-3 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-bold uppercase tracking-widest hover:bg-[#00ff66]/20 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : "Deploy NemoClaw Agent"}
              </button>
            </div>

            {/* Stats */}
            <div className="bg-neutral-950 border border-neutral-800 p-4 space-y-3">
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Fleet Overview</p>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Active Agents</span>
                <span className="font-bold text-[#00ff66]">{agents.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Total Tasks</span>
                <span className="font-bold text-[#00B7FF]">{agents.reduce((s, a) => s + a.tasks_completed, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Violations Blocked</span>
                <span className="font-bold text-red-500">{agents.reduce((s, a) => s + a.violations_blocked, 0)}</span>
              </div>
            </div>
          </div>

          {/* Agent Fleet + Execution Panel */}
          <div className="lg:col-span-2 space-y-4">
            {agents.length === 0 ? (
              <div className="bg-neutral-950 border border-neutral-800 p-12 text-center">
                <Shield className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                <p className="text-sm text-neutral-500">No agents deployed. Deploy your first NemoClaw agent.</p>
              </div>
            ) : (
              agents.map(agent => (
                <div key={agent.id} className="bg-neutral-950 border border-neutral-800 overflow-hidden">
                  <div className="h-[2px] bg-red-500" />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">{agent.name}</h3>
                          <code className="text-[9px] text-neutral-600">{agent.id}</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-[#00ff66]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" /> {agent.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {agent.guardrails.map(g => (
                        <span key={g} className="px-2 py-0.5 text-[8px] bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-widest">
                          {g}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mb-3 text-[10px] text-neutral-500">
                      <span>Tasks: <strong className="text-white">{agent.tasks_completed}</strong></span>
                      <span>·</span>
                      <span>Blocked: <strong className="text-red-500">{agent.violations_blocked}</strong></span>
                      <span>·</span>
                      <span>Sandbox: <strong className="text-[#00B7FF]">{agent.sandbox}</strong></span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#00B7FF]/10 border border-[#00B7FF]/30 text-[#00B7FF] hover:bg-[#00B7FF]/20 transition-all flex items-center gap-1">
                        <Play className="w-3 h-3" /> Execute
                      </button>
                      <button onClick={() => heal(agent.id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] hover:bg-[#A855F7]/20 transition-all flex items-center gap-1">
                        <RefreshCcw className="w-3 h-3" /> Heal
                      </button>
                      <button onClick={() => terminate(agent.id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Kill
                      </button>
                    </div>

                    {activeAgent === agent.id && (
                      <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3">
                        <div className="flex gap-2">
                          <input
                            value={taskInput}
                            onChange={e => setTaskInput(e.target.value)}
                            placeholder="Describe the task for this agent..."
                            className="flex-1 bg-black border border-neutral-800 px-3 py-2.5 text-xs text-white placeholder:text-neutral-700 focus:outline-none"
                            onKeyDown={e => e.key === "Enter" && execute(agent.id)}
                          />
                          <button
                            onClick={() => execute(agent.id)}
                            disabled={execLoading}
                            className="px-4 py-2.5 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] disabled:opacity-50"
                          >
                            {execLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                          </button>
                        </div>
                        {execResult && (
                          <div className="bg-black border border-neutral-800 p-3 max-h-64 overflow-y-auto">
                            {execResult.success === false ? (
                              <div className="flex items-start gap-2 text-red-500">
                                <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs font-bold">BLOCKED BY GUARDRAILS</p>
                                  <p className="text-[10px] text-neutral-500 mt-1">{(execResult as Record<string, unknown>).reasoning as string}</p>
                                </div>
                              </div>
                            ) : (
                              <pre className="text-[10px] text-neutral-400 whitespace-pre-wrap">{JSON.stringify(execResult, null, 2)}</pre>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
