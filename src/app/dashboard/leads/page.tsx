"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Loader2, User, Building2, Mail, Flame, Filter, ArrowUpRight, Zap, MessageCircle } from "lucide-react";

interface Lead {
  id: string; name: string; email: string; company: string; score: number;
  tier: "hot" | "warm" | "cold"; signals: string[]; source: string; lastActivity: string;
}

const TIER_STYLE = {
  hot: { label: "🔥 Hot", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" },
  warm: { label: "🟡 Warm", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  cold: { label: "❄️ Cold", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
};

export default function LeadsPage() {
  const [industry, setIndustry] = useState("SaaS");
  const [ideal, setIdeal] = useState("Agency owner doing $10k-$50k/mo");
  const [filter, setFilter] = useState<"all" | "hot" | "warm" | "cold">("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [scoredLeads, setScoredLeads] = useState<Lead[]>([]);

  // Load scored demo leads on mount
  useEffect(() => {
    const demo: Lead[] = [
      { id: "l1", name: "Alex Rivera", email: "alex@techventures.co", company: "TechVentures", score: 92, tier: "hot", signals: ["Visited pricing 3x", "Downloaded ROI guide", "Budget: $5k+/mo"], source: "Demo", lastActivity: "12m ago" },
      { id: "l2", name: "Riley Cooper", email: "riley@ecomboost.com", company: "EcomBoost", score: 88, tier: "hot", signals: ["Requested call", "Budget: $10k+/mo", "Currently using agency"], source: "Demo", lastActivity: "30m ago" },
      { id: "l3", name: "Jordan Lee", email: "jordan@growthco.io", company: "GrowthCo", score: 78, tier: "hot", signals: ["Completed demo", "Asked about Ghost Mode", "Agency owner"], source: "Organic", lastActivity: "2h ago" },
      { id: "l4", name: "Sam Torres", email: "sam@nextlevel.agency", company: "NextLevel Agency", score: 65, tier: "warm", signals: ["Shared with team", "Budget: $2-5k/mo"], source: "Referral", lastActivity: "1d ago" },
      { id: "l5", name: "Casey Morgan", email: "casey@startupfuel.com", company: "StartupFuel", score: 51, tier: "warm", signals: ["Opened 3 emails", "Viewed features page"], source: "Email", lastActivity: "3d ago" },
      { id: "l6", name: "Taylor Kim", email: "taylor@localfitness.com", company: "LocalFitness", score: 34, tier: "cold", signals: ["Single page visit", "No email opens"], source: "Ads", lastActivity: "1w ago" },
    ];
    setScoredLeads(demo);
  }, []);

  const prospect = async () => {
    if (loading) return;
    setLoading(true); setLeads([]);
    try {
      const res = await fetch("/api/agents", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "prospector", industry, idealClient: ideal }),
      });
      const data = await res.json();
      if (data.leads) setLeads(data.leads);
    } catch {} finally { setLoading(false); }
  };

  const displayLeads = filter === "all" ? scoredLeads : scoredLeads.filter(l => l.tier === filter);
  const hotCount = scoredLeads.filter(l => l.tier === "hot").length;
  const warmCount = scoredLeads.filter(l => l.tier === "warm").length;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <Users className="w-3 h-3" /> AI Lead Intelligence
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">Lead Scoring & Prospecting</h1>
        <p className="text-sm text-text-secondary mt-1">AI finds, qualifies, and auto-scores leads by engagement, budget, and fit.</p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Hot Leads", count: hotCount, icon: Flame, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Warm Leads", count: warmCount, icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Total Pipeline", count: scoredLeads.length, icon: Users, color: "text-electric", bg: "bg-electric/10" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.bg}`}><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            <div>
              <p className="text-xl font-bold font-mono text-white">{s.count}</p>
              <p className="text-[10px] uppercase tracking-widest text-text-secondary">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-3.5 h-3.5 text-text-secondary" />
        {(["all", "hot", "warm", "cold"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${filter === f ? "bg-white text-midnight" : "text-text-secondary hover:text-white"}`}>
            {f === "all" ? "All" : TIER_STYLE[f].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Communications Feed */}
        <div className="lg:col-span-1 glass-card overflow-hidden flex flex-col h-[500px]">
          <div className="px-5 py-4 border-b border-glass-border bg-black/20 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Comm Line
            </h2>
            <MessageCircle className="w-4 h-4 text-emerald-400/50" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm hide-scrollbar">
            {/* Mock Live Feed */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-text-secondary mb-1">
                <span>+1 (512) 555-0198</span>
                <span>Just now</span>
              </div>
              <div className="bg-onyx/40 border border-glass-border rounded-xl rounded-tl-sm p-3 inline-block max-w-[90%] text-white text-xs">
                Saw your post about GBP hijacking. Do you guys handle dental practices?
              </div>
            </div>
            
            <div className="space-y-1 flex flex-col items-end">
              <div className="flex items-center justify-between text-[10px] text-text-secondary mb-1 w-full flex-row-reverse">
                <span className="text-electric flex items-center gap-1"><Zap className="w-3 h-3" /> UMBRA C-35</span>
                <span>Just now</span>
              </div>
              <div className="bg-electric/10 border border-electric/20 text-white rounded-xl rounded-tr-sm p-3 inline-block max-w-[90%] text-xs">
                Yes. We currently track 244 dental competitors in Austin. Our system finds their blind spots and generates the exact copy needed to steal their local map traffic. Want to see a live audit of your clinic?
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-text-secondary mb-1 mt-4">
                <span>+1 (214) 555-0122</span>
                <span>2m ago</span>
              </div>
              <div className="bg-onyx/40 border border-glass-border rounded-xl rounded-tl-sm p-3 inline-block max-w-[90%] text-white text-xs">
                I'm looking for a new agency. Our current one is too slow.
              </div>
            </div>

            <div className="space-y-1 flex flex-col items-end">
              <div className="flex items-center justify-between text-[10px] text-text-secondary mb-1 w-full flex-row-reverse">
                <span className="text-electric flex items-center gap-1"><Zap className="w-3 h-3" /> UMBRA C-35</span>
                <span>1m ago</span>
              </div>
              <div className="bg-electric/10 border border-electric/20 text-white rounded-xl rounded-tr-sm p-3 inline-block max-w-[90%] text-xs">
                We don't have employees, so we don't have delays. UMBRA executes campaigns 24/7 autonomously. I've sent you our autonomous pipeline demo. Let me know when you've reviewed it.
              </div>
            </div>
          </div>
        </div>

        {/* Scored Leads Table */}
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col h-[500px]">
          <div className="px-5 py-4 border-b border-glass-border flex items-center justify-between bg-black/20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary">Scored Pipeline</h2>
            <span className="text-[10px] text-text-secondary bg-onyx/50 px-2 py-1 rounded border border-glass-border">{displayLeads.length} active</span>
          </div>
          <div className="divide-y divide-glass-border overflow-y-auto hide-scrollbar">
          {displayLeads.map((l, i) => {
            const style = TIER_STYLE[l.tier];
            return (
              <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-glass-bg/30 transition-colors">
                {/* Score Circle */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono ${style.bg} ${style.border} border ${style.text}`}>
                  {l.score}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{l.name}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${style.bg} ${style.border} border ${style.text}`}>{l.tier}</span>
                  </div>
                  <p className="text-xs text-text-secondary flex items-center gap-2">
                    <Building2 className="w-3 h-3" />{l.company} · <Mail className="w-3 h-3" />{l.email}
                  </p>
                </div>
                {/* Signals */}
                <div className="hidden lg:flex flex-wrap gap-1 max-w-[200px]">
                  {l.signals.slice(0, 2).map((s, j) => (
                    <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-onyx/50 border border-glass-border text-text-secondary">{s}</span>
                  ))}
                </div>
                {/* Source + Activity */}
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-text-secondary">{l.source}</p>
                  <p className="text-[10px] text-text-secondary/50">{l.lastActivity}</p>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Prospector */}
      <div className="glass-card p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2"><Search className="w-3 h-3" /> AI Prospector</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Industry"
            className="bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
          <input value={ideal} onChange={e => setIdeal(e.target.value)} placeholder="Ideal client profile"
            className="bg-onyx border border-glass-border rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-electric/50" />
        </div>
        <button onClick={prospect} disabled={loading}
          className="w-full py-2.5 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "Prospecting..." : "Find New Leads"}
        </button>
      </div>
    </div>
  );
}
