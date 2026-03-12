"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Loader2, User, Building2, Mail, FlameKindling } from "lucide-react";

export default function LeadsPage() {
  const [industry, setIndustry] = useState("SaaS");
  const [ideal, setIdeal] = useState("Agency owner doing $10k-$50k/mo");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const prospect = async () => {
    if (loading) return;
    setLoading(true); setLeads([]);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "prospector", industry, idealClient: ideal }),
      });
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch {} finally { setLoading(false); }
  };

  const stageColor: Record<string, string> = { hot: "text-red-400 bg-red-400/10 border-red-400/20", warm: "text-amber-400 bg-amber-400/10 border-amber-400/20", cold: "text-blue-400 bg-blue-400/10 border-blue-400/20" };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Users className="w-3 h-3" /> Prospector
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Lead Intelligence</h1>
        <p className="text-sm text-text-secondary mt-1">AI finds, qualifies, and scores leads for your niche.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Industry</label>
          <input value={industry} onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
        </div>
        <div className="glass-card p-4">
          <label className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-2 block">Ideal Client</label>
          <input value={ideal} onChange={(e) => setIdeal(e.target.value)}
            className="w-full bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
        </div>
      </div>

      <button onClick={prospect} disabled={loading}
        className="w-full py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-8">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        {loading ? "Prospecting..." : "Find Leads"}
      </button>

      {leads.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-glass-border"><h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Found {leads.length} Leads</h2></div>
          <div className="divide-y divide-glass-border">
            {leads.map((l: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-glass-bg transition-colors">
                <div className="p-2 rounded-lg bg-onyx border border-glass-border"><User className="w-4 h-4 text-electric" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">{l.name}</p>
                  <p className="text-xs text-text-secondary flex items-center gap-2">
                    <Building2 className="w-3 h-3" /> {l.company} <Mail className="w-3 h-3 ml-1" /> {l.email}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${stageColor[l.stage] || stageColor.cold}`}>{l.stage}</span>
                {l.score && <span className="text-xs font-mono text-text-secondary">{l.score}/100</span>}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
