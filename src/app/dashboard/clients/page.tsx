"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Target, DollarSign, TrendingUp, FileText, Plus, ArrowUpRight, MoreHorizontal } from "lucide-react";

interface Client {
  id: string; name: string; company: string; plan: string; status: string;
  metrics: { revenue: number; leads: number; contentPieces: number; lastActivity: string };
}

const PLAN_COLORS: Record<string, string> = { sovereign: "#6c63ff", ghost: "#ffd700", franchise: "#ff3366" };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [agg, setAgg] = useState({ totalClients: 0, activeClients: 0, totalRevenue: 0, totalLeads: 0, totalContent: 0 });

  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(d => d.clients && setClients(d.clients));
    fetch("/api/clients?aggregate=true").then(r => r.json()).then(d => d.metrics && setAgg(d.metrics));
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3 h-3" /> Agency CRM
          </div>
          <h1 className="text-2xl font-bold serif-text text-white">Client Portal</h1>
          <p className="text-sm text-text-secondary mt-1">Manage all clients from one dashboard.</p>
        </div>
        <button className="px-4 py-2 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Clients", value: agg.totalClients, icon: Users, color: "#6c63ff" },
          { label: "Active", value: agg.activeClients, icon: Target, color: "#00ff88" },
          { label: "Revenue", value: `$${agg.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "#ffd700" },
          { label: "Leads", value: agg.totalLeads, icon: TrendingUp, color: "#00d4ff" },
          { label: "Content", value: agg.totalContent, icon: FileText, color: "#ff3366" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4">
            <m.icon className="w-4 h-4 mb-2" style={{ color: m.color }} />
            <div className="text-xl font-bold font-mono">{m.value}</div>
            <div className="text-text-secondary text-[10px] uppercase tracking-widest">{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Client Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] gap-4 p-4 border-b border-glass-border text-[10px] text-text-secondary font-bold uppercase tracking-widest">
          <span>Client</span><span>Plan</span><span>Revenue</span><span>Leads</span><span>Content</span><span></span>
        </div>
        {clients.map(c => (
          <div key={c.id} className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,auto] gap-4 p-4 border-b border-glass-border last:border-0 items-center hover:bg-glass-bg transition-colors">
            <div>
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-text-secondary text-xs">{c.company}</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold capitalize w-fit" style={{ background: `${PLAN_COLORS[c.plan] || "#6c63ff"}15`, color: PLAN_COLORS[c.plan] || "#6c63ff" }}>
              {c.plan}
            </span>
            <span className="text-sm font-medium font-mono">${c.metrics.revenue.toLocaleString()}</span>
            <span className="text-sm flex items-center gap-1">{c.metrics.leads} <ArrowUpRight className="w-3 h-3 text-emerald-400" /></span>
            <span className="text-sm">{c.metrics.contentPieces}</span>
            <button className="p-2 hover:bg-glass-bg rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4 text-text-secondary" /></button>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
