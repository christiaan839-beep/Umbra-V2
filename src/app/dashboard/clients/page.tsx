"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Users, Target, DollarSign, TrendingUp, FileText,
  Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, CheckCircle2,
  Clock, AlertCircle, Mail, Zap, ChevronDown, Search, X
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  plan: string;
  status: string;
  metrics: {
    revenue: number;
    leads: number;
    contentPieces: number;
    lastActivity: string;
  };
}

interface AggregateMetrics {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  totalLeads: number;
  totalContent: number;
}

const PLAN_COLORS: Record<string, string> = {
  sovereign: "#a855f7",
  ghost: "#ffd700",
  franchise: "#ff3366",
};

const PLAN_PRICE: Record<string, number> = {
  sovereign: 497,
  ghost: 997,
  franchise: 2497,
};

const STATUS_CONFIG: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  active: { color: "#10b981", icon: CheckCircle2, label: "Active" },
  onboarding: { color: "#f59e0b", icon: Clock, label: "Onboarding" },
  churned: { color: "#ef4444", icon: AlertCircle, label: "Churned" },
  trial: { color: "#00B7FF", icon: Zap, label: "Trial" },
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [agg, setAgg] = useState<AggregateMetrics>({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    totalLeads: 0,
    totalContent: 0,
  });
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((d) => d.clients && setClients(d.clients))
      .catch(() => {});
    fetch("/api/clients?aggregate=true")
      .then((r) => r.json())
      .then((d) => d.metrics && setAgg(d.metrics))
      .catch(() => {});
  }, []);

  // Computed metrics
  const mrr = clients.reduce((sum, c) => {
    if (c.status === "active" || c.status === "trial") {
      return sum + (PLAN_PRICE[c.plan] || 497);
    }
    return sum;
  }, 0);

  const churnRate =
    agg.totalClients > 0
      ? ((clients.filter((c) => c.status === "churned").length / agg.totalClients) * 100).toFixed(1)
      : "0.0";

  const onboardingCount = clients.filter((c) => c.status === "onboarding").length;

  // Filter & search
  const filteredClients = clients.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sendOnboardingEmail = async (clientId: string) => {
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: clients.find((c) => c.id === clientId)?.name || "",
          subject: "Welcome to UMBRA — Your AI Marketing Engine is Live",
          body: "Your UMBRA node has been provisioned. Log in to your dashboard to begin.",
        }),
      });
    } catch {
      // Silently handle — email service may not be configured
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B7FF]/10 border border-[#00B7FF]/20 text-[#00B7FF] text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3 h-3" /> Agency CRM
          </div>
          <h1 className="text-2xl font-bold serif-text text-white">Client Portal</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage all nodes from one unified control surface.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <Plus className="w-4 h-4" /> Onboard Client
        </button>
      </div>

      {/* === TOP METRICS === */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        {[
          {
            label: "MRR",
            value: `$${mrr.toLocaleString()}`,
            icon: DollarSign,
            color: "#10b981",
            trend: "+12%",
            trendUp: true,
          },
          {
            label: "Total Clients",
            value: agg.totalClients,
            icon: Users,
            color: "#a855f7",
          },
          {
            label: "Active",
            value: agg.activeClients,
            icon: Target,
            color: "#00ff88",
          },
          {
            label: "Onboarding",
            value: onboardingCount,
            icon: Clock,
            color: "#f59e0b",
          },
          {
            label: "Churn Rate",
            value: `${churnRate}%`,
            icon: ArrowDownRight,
            color: parseFloat(churnRate as string) > 5 ? "#ef4444" : "#10b981",
          },
          {
            label: "Revenue",
            value: `$${agg.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "#00B7FF",
          },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <m.icon className="w-4 h-4" style={{ color: m.color }} />
              {m.trend && (
                <span
                  className={`text-[10px] font-bold flex items-center gap-0.5 ${
                    m.trendUp ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {m.trendUp ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {m.trend}
                </span>
              )}
            </div>
            <div className="text-xl font-bold font-mono">{m.value}</div>
            <div className="text-text-secondary text-[10px] uppercase tracking-widest">
              {m.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* === ONBOARDING PIPELINE === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mb-6"
      >
        <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#00B7FF]" /> Onboarding Pipeline
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { stage: "Payment Received", count: clients.filter((c) => c.status === "trial").length, color: "#00B7FF" },
            { stage: "Node Provisioned", count: onboardingCount, color: "#f59e0b" },
            { stage: "Welcome Sent", count: agg.activeClients, color: "#a855f7" },
            { stage: "Active & Running", count: agg.activeClients, color: "#10b981" },
          ].map((stage, i) => (
            <div key={stage.stage} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold font-mono"
                  style={{ background: `${stage.color}15`, color: stage.color }}
                >
                  {stage.count}
                </div>
                {i < 3 && (
                  <div className="w-full h-[2px] mx-2" style={{ background: `${stage.color}30` }} />
                )}
              </div>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest">{stage.stage}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* === FILTER BAR === */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {["all", "active", "onboarding", "trial", "churned"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-[#00B7FF]/15 text-[#00B7FF] border border-[#00B7FF]/20"
                  : "text-text-secondary hover:text-white border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative lg:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/[0.03] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#00B7FF]/30 transition-colors w-64 font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* === CLIENT TABLE === */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-xl"
      >
        {/* Table Header */}
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 p-4 border-b border-white/[0.06] text-[10px] text-text-secondary font-bold uppercase tracking-widest">
          <span>Client</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Revenue</span>
          <span>Leads</span>
          <span>Content</span>
          <span></span>
        </div>

        {/* Client Rows */}
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">
              {searchQuery ? "No clients match your search." : "No clients yet. Deploy UMBRA to start onboarding."}
            </p>
          </div>
        ) : (
          filteredClients.map((c) => {
            const statusConf = STATUS_CONFIG[c.status] || STATUS_CONFIG.active;
            const StatusIcon = statusConf.icon;
            const isExpanded = expandedClient === c.id;

            return (
              <div key={c.id}>
                <div
                  className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,auto] gap-4 p-4 border-b border-white/[0.04] items-center hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setExpandedClient(isExpanded ? null : c.id)}
                >
                  <div>
                    <div className="text-sm font-medium text-white">{c.name}</div>
                    <div className="text-text-secondary text-xs">{c.company}</div>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold capitalize w-fit"
                    style={{
                      background: `${PLAN_COLORS[c.plan] || "#a855f7"}15`,
                      color: PLAN_COLORS[c.plan] || "#a855f7",
                    }}
                  >
                    {c.plan}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: statusConf.color }}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConf.label}
                  </span>
                  <span className="text-sm font-medium font-mono">${c.metrics.revenue.toLocaleString()}</span>
                  <span className="text-sm flex items-center gap-1">
                    {c.metrics.leads}
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  </span>
                  <span className="text-sm">{c.metrics.contentPieces}</span>
                  <div className="flex items-center gap-1">
                    <ChevronDown
                      className={`w-4 h-4 text-text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                    <button
                      className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                    </button>
                  </div>
                </div>

                {/* Expanded Client Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-b border-white/[0.04]"
                    >
                      <div className="p-6 bg-white/[0.01] grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Monthly Value</p>
                          <p className="text-lg font-bold font-mono text-emerald-400">
                            ${(PLAN_PRICE[c.plan] || 497).toLocaleString()}/mo
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Last Activity</p>
                          <p className="text-sm text-white">{c.metrics.lastActivity || "—"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1">Node ID</p>
                          <p className="text-sm font-mono text-[#00B7FF]">
                            UMB-NX-{c.id.slice(-5).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-end gap-2">
                          <button
                            onClick={() => sendOnboardingEmail(c.id)}
                            className="px-3 py-1.5 bg-[#00B7FF]/10 border border-[#00B7FF]/20 text-[#00B7FF] rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#00B7FF]/20 transition-colors"
                          >
                            <Mail className="w-3 h-3" /> Send Welcome
                          </button>
                          <button className="px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400/20 transition-colors">
                            <FileText className="w-3 h-3" /> View Report
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
