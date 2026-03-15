"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock, Database, CreditCard, Shield, Brain, Radio, type LucideIcon } from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  latencyMs: number;
  message?: string;
}

interface HealthData {
  status: string;
  version: string;
  phases: number;
  uptime: string;
  timestamp: string;
  totalLatencyMs: number;
  summary: string;
  services: ServiceStatus[];
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
  database: Database,
  stripe: CreditCard,
  clerk: Shield,
  gemini: Brain,
  pusher: Radio,
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: LucideIcon; label: string }> = {
  operational: { color: "#10B981", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: CheckCircle2, label: "Operational" },
  degraded: { color: "#F59E0B", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: AlertTriangle, label: "Degraded" },
  down: { color: "#EF4444", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle, label: "Down" },
};

export default function SystemStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch {
      setHealth(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const overallConfig = health ? STATUS_CONFIG[health.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.operational : STATUS_CONFIG.operational;
  const OverallIcon = overallConfig.icon;

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col gap-6 p-4 lg:p-8 z-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-widest font-mono flex items-center gap-3">
            <Activity className="w-6 h-6 text-cyan-400" />
            SYSTEM STATUS
          </h1>
          <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-[10px] font-bold mt-1">
            Real-Time Infrastructure Health
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 hover:from-cyan-500/20 hover:to-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center gap-2 transition-all uppercase tracking-widest font-bold font-mono text-[10px] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Overall Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${overallConfig.bg} border ${overallConfig.border} rounded-2xl p-6 flex items-center justify-between`}
      >
        <div className="flex items-center gap-4">
          <OverallIcon className="w-8 h-8" style={{ color: overallConfig.color }} />
          <div>
            <p className="text-lg font-light text-white tracking-wider">{health?.summary || "Checking systems..."}</p>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">
              UMBRA v{health?.version || "..."} — {health?.phases || 0} Phases Active
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono" style={{ color: overallConfig.color }}>{overallConfig.label.toUpperCase()}</p>
          {lastChecked && (
            <p className="text-[10px] text-neutral-600 font-mono flex items-center gap-1 justify-end mt-1">
              <Clock className="w-3 h-3" /> {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </motion.div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {health?.services.map((service, i) => {
          const config = STATUS_CONFIG[service.status];
          const ServiceIcon = SERVICE_ICONS[service.name] || Activity;
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center`}>
                    <ServiceIcon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-light text-white tracking-wider capitalize">{service.name}</p>
                    <p className="text-[10px] text-neutral-600 font-mono">{service.latencyMs}ms</p>
                  </div>
                </div>
                <StatusIcon className="w-5 h-5" style={{ color: config.color }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold font-mono" style={{ color: config.color }}>
                  {config.label}
                </span>
                {service.message && (
                  <span className="text-[10px] text-neutral-600 font-mono truncate max-w-[150px]">{service.message}</span>
                )}
              </div>
              {/* Latency bar */}
              <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: config.color }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, Math.max(5, service.latencyMs / 5))}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Metrics */}
      {health && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Response Time", value: `${health.totalLatencyMs}ms`, color: "#00B7FF" },
            { label: "Server Uptime", value: health.uptime, color: "#10B981" },
            { label: "Active Phases", value: String(health.phases), color: "#A855F7" },
            { label: "API Version", value: `v${health.version}`, color: "#F59E0B" },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
            >
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">{metric.label}</p>
              <p className="text-xl font-light text-white font-mono" style={{ color: metric.color }}>{metric.value}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
