"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Zap, DollarSign, ArrowUpRight, Shield, AlertTriangle, Crown } from "lucide-react";

type ClientMetrics = {
  tenantId: string;
  nodeId: string;
  plan: string;
  totalActions: number;
  leadEvents: number;
  seoEvents: number;
  socialEvents: number;
  riskLevel: "healthy" | "watch" | "churn";
  createdAt: string;
};

export default function AdminDashboardPage() {
  const [clients, setClients] = useState<ClientMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/admin/clients");
        const data = await res.json();
        if (data.success) setClients(data.clients);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const totalRevenue = clients.length * 5000; // Rough MRR calculation
  const activeClients = clients.filter(c => c.totalActions > 0).length;
  const atRiskClients = clients.filter(c => c.riskLevel === "churn" || c.riskLevel === "watch").length;

  const getRiskBadge = (risk: string) => {
    const configs: Record<string, { color: string; bg: string; label: string; icon: typeof Shield }> = {
      healthy: { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Healthy", icon: Shield },
      watch: { color: "text-amber-400", bg: "bg-amber-400/10", label: "Watch", icon: AlertTriangle },
      churn: { color: "text-red-400", bg: "bg-red-400/10", label: "At Risk", icon: AlertTriangle },
    };
    const c = configs[risk] || configs.healthy;
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 ${c.color} ${c.bg}`}>
        <c.icon className="w-3 h-3" /> {c.label}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Crown className="w-3 h-3" /> Admin Panel
        </div>
        <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Multi-Client Command</h1>
        <p className="text-sm text-[#8A95A5] mt-2 font-mono uppercase tracking-widest">
          All client nodes ranked by activity, revenue, and health
        </p>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total MRR", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Active Clients", value: activeClients.toString(), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "At-Risk Clients", value: atRiskClients.toString(), icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10" },
          { label: "Total Swarm Actions", value: clients.reduce((sum, c) => sum + c.totalActions, 0).toLocaleString(), icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 border border-glass-border"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold text-[#5C667A] uppercase tracking-widest mb-1">{stat.label}</p>
            <span className="text-2xl font-bold font-mono text-white">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Client Table */}
      <div className="glass-card border border-glass-border overflow-hidden">
        <div className="px-6 py-4 border-b border-glass-border bg-black/40 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> All Client Nodes
          </h3>
          <span className="text-[10px] font-bold text-[#5C667A] uppercase tracking-wider">{clients.length} nodes</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-[#5C667A] animate-pulse">Loading client data...</div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-[#2A2D35] mx-auto mb-4" />
            <p className="text-sm text-[#5C667A] mb-2">No clients onboarded yet.</p>
            <p className="text-xs text-[#3A3D45]">Clients will appear here after Stripe checkout completes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-glass-border bg-black/20">
                  {["Node ID", "Plan", "Actions", "Leads", "SEO Pages", "Social", "Health", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-[10px] font-bold text-[#5C667A] uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {clients
                  .sort((a, b) => b.totalActions - a.totalActions)
                  .map((client, i) => (
                    <motion.tr
                      key={client.tenantId}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-bold font-mono text-white">{client.nodeId}</td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">
                          {client.plan}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-white">{client.totalActions.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm font-mono text-blue-400">{client.leadEvents}</td>
                      <td className="px-4 py-4 text-sm font-mono text-emerald-400">{client.seoEvents}</td>
                      <td className="px-4 py-4 text-sm font-mono text-pink-400">{client.socialEvents}</td>
                      <td className="px-4 py-4">{getRiskBadge(client.riskLevel)}</td>
                      <td className="px-4 py-4">
                        <button className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3" /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
