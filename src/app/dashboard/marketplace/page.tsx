"use client";

import React, { useState, useEffect } from "react";
import { Store, Play, Plus, Star, Loader2, Zap, Shield, Code, FileText, Headphones } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  author: string;
  model: string;
  guardrails: string[];
  category: string;
  uses: number;
  rating: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Sales: Zap, Content: FileText, Compliance: Shield, Support: Headphones, Engineering: Code, Custom: Plus,
};

export default function MarketplacePage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filter, setFilter] = useState("All");
  const [deployResult, setDeployResult] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/agents/marketplace").then(r => r.json()).then(d => setTemplates(d.templates || []));
  }, []);

  const categories = ["All", ...new Set(templates.map(t => t.category))];

  const deployTemplate = async (id: string) => {
    setDeployResult(prev => ({ ...prev, [id]: "loading" }));
    const res = await fetch("/api/agents/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deploy", template: { id } }),
    });
    const data = await res.json();
    setDeployResult(prev => ({ ...prev, [id]: data.success ? "deployed" : "error" }));
    // Refresh
    const r = await fetch("/api/agents/marketplace");
    const d = await r.json();
    setTemplates(d.templates || []);
  };

  const filtered = filter === "All" ? templates : templates.filter(t => t.category === filter);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="border-b border-[#A855F7]/20 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center">
              <Store className="w-6 h-6 text-[#A855F7]" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[0.2em]">Agent Marketplace</h1>
              <p className="text-[#A855F7]/60 text-xs uppercase tracking-widest">{templates.length} Templates · Deploy in One Click</p>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${filter === cat ? "bg-[#A855F7] text-white border-[#A855F7]" : "bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => {
            const Icon = CATEGORY_ICONS[t.category] || Plus;
            const state = deployResult[t.id];
            return (
              <div key={t.id} className="bg-neutral-950 border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all">
                <div className="h-[2px] bg-[#A855F7]" />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/30 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#A855F7]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">{t.name}</h3>
                        <span className="text-[9px] text-[#A855F7] uppercase tracking-widest">{t.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> {t.rating}
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">{t.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] text-neutral-600">
                      <span>{t.uses} deploys</span>
                      <span>{t.guardrails.length} guardrails</span>
                    </div>
                    <button
                      onClick={() => deployTemplate(t.id)}
                      disabled={state === "loading"}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                        state === "deployed"
                          ? "bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66]"
                          : "bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] hover:bg-[#A855F7]/20"
                      }`}
                    >
                      {state === "loading" ? <Loader2 className="w-3 h-3 animate-spin" /> : state === "deployed" ? "✓ Live" : <><Play className="w-3 h-3 inline mr-1" /> Deploy</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
