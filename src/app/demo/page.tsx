"use client";

import React, { useState } from "react";
import { Shield, Zap, Languages, Lock, FileText, Paintbrush, Play, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

const DEMO_AGENTS = [
  {
    id: "translate",
    name: "12-Language Translator",
    icon: Languages,
    color: "#06B6D4",
    description: "Translate any text into 12 languages instantly using NVIDIA Riva.",
    endpoint: "/api/agents/translate",
    placeholder: "Enter text to translate (e.g. 'Hello, how can I help you?')",
    buildBody: (input: string) => ({ text: input, target_lang: "es" }),
    formatResult: (data: Record<string, unknown>) => {
      const target = data.target as { text?: string; name?: string } | undefined;
      return target?.text || JSON.stringify(data);
    },
  },
  {
    id: "pii",
    name: "PII Auto-Redactor",
    icon: Lock,
    color: "#EF4444",
    description: "Detect and redact personal data for GDPR/POPIA compliance.",
    endpoint: "/api/agents/pii-redactor",
    placeholder: "Paste text with personal data (e.g. 'John Smith, john@email.com, +1-555-0123')",
    buildBody: (input: string) => ({ text: input }),
    formatResult: (data: Record<string, unknown>) => `Found ${data.entities_found} PII entities. Risk: ${data.risk_level}\n\nRedacted: ${data.redacted_text}`,
  },
  {
    id: "page-builder",
    name: "AI Page Builder",
    icon: Paintbrush,
    color: "#A855F7",
    description: "Generate complete HTML websites from a text description.",
    endpoint: "/api/agents/page-builder",
    placeholder: "Describe a page (e.g. 'luxury real estate landing page with dark theme')",
    buildBody: (input: string) => ({ prompt: input }),
    formatResult: (data: Record<string, unknown>) => `✅ Generated via ${data.provider}\n\nHTML preview: ${String(data.html || "").substring(0, 300)}...`,
  },
  {
    id: "blog",
    name: "SEO Blog Generator",
    icon: FileText,
    color: "#10B981",
    description: "Research a topic and generate a 1500-word SEO blog post instantly.",
    endpoint: "/api/agents/blog-gen",
    placeholder: "Enter a blog topic (e.g. 'AI marketing automation trends 2026')",
    buildBody: (input: string) => ({ topic: input }),
    formatResult: (data: Record<string, unknown>) => `✅ Generated ${data.wordCount} words\nSlug: ${(data.seo as Record<string, unknown>)?.slug}\n\nPreview: ${String(data.html || "").substring(0, 300)}...`,
  },
];

export default function DemoPage() {
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, { loading: boolean; output?: string; error?: string }>>({});

  const executeDemo = async (agent: typeof DEMO_AGENTS[0]) => {
    const input = inputs[agent.id] || "";
    if (!input.trim()) return;

    setResults(prev => ({ ...prev, [agent.id]: { loading: true } }));

    try {
      const res = await fetch(agent.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agent.buildBody(input)),
      });
      const data = await res.json();
      setResults(prev => ({
        ...prev,
        [agent.id]: { loading: false, output: agent.formatResult(data) },
      }));
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [agent.id]: { loading: false, error: String(err) },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,183,255,0.08),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-[10px] font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" /> Live Demo — Try Our AI Agents Free
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.15em] mb-4">
            Test The <span className="text-[#00B7FF]">Arsenal</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-2xl mx-auto leading-relaxed">
            These are real, production-grade AI agents powered by 38 NVIDIA NIM models.
            No signup required. Try them now.
          </p>
        </div>
      </div>

      {/* Agent Demo Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-6">
        {DEMO_AGENTS.map(agent => {
          const Icon = agent.icon;
          const result = results[agent.id];
          const isActive = activeAgent === agent.id;

          return (
            <div key={agent.id} className="bg-neutral-950 border border-neutral-800 overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="h-[2px]" style={{ backgroundColor: agent.color }} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                      <Icon className="w-5 h-5" style={{ color: agent.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{agent.name}</h3>
                      <p className="text-xs text-neutral-500">{agent.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveAgent(isActive ? null : agent.id)}
                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all hover:opacity-80"
                    style={{ backgroundColor: `${agent.color}15`, color: agent.color, border: `1px solid ${agent.color}30` }}
                  >
                    Try It <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {isActive && (
                  <div className="mt-4 pt-4 border-t border-neutral-800 space-y-4 animate-in fade-in duration-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputs[agent.id] || ""}
                        onChange={e => setInputs(prev => ({ ...prev, [agent.id]: e.target.value }))}
                        placeholder={agent.placeholder}
                        onKeyDown={e => e.key === "Enter" && executeDemo(agent)}
                        className="flex-1 bg-black border border-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-neutral-600"
                      />
                      <button
                        onClick={() => executeDemo(agent)}
                        disabled={result?.loading}
                        className="px-6 py-3 font-bold text-sm transition-all disabled:opacity-50"
                        style={{ backgroundColor: agent.color, color: "#000" }}
                      >
                        {result?.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>

                    {result?.output && (
                      <div className="bg-black border border-neutral-800 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
                          <span className="text-[10px] text-[#00ff66] font-bold uppercase tracking-widest">Result</span>
                        </div>
                        <pre className="text-xs text-neutral-400 whitespace-pre-wrap font-mono">{result.output}</pre>
                      </div>
                    )}
                    {result?.error && (
                      <p className="text-xs text-red-500">{result.error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* CTA */}
        <div className="text-center pt-10 space-y-4">
          <p className="text-neutral-500 text-sm">Ready for the full arsenal? 14 agents, 38 NIM models, unlimited power.</p>
          <a href="/pricing" className="inline-block px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all">
            View Plans <ArrowRight className="w-4 h-4 inline ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
