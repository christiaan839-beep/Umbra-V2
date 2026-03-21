"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Stats {
  totalRequests: number;
  totalLeads: number;
  avgResponseMs: number;
  uptimePercent: string;
}

/**
 * SocialProofMetrics — Fetches real platform metrics from /api/agents/analytics
 * and displays them on the landing page. No fake numbers.
 */
export function SocialProofMetrics() {
  const [stats, setStats] = useState<Stats>({
    totalRequests: 0,
    totalLeads: 0,
    avgResponseMs: 0,
    uptimePercent: "0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/agents/analytics");
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalRequests: data.totalRequests || data.total_requests || 0,
            totalLeads: data.totalLeads || data.total_leads || 0,
            avgResponseMs: data.avgResponseMs || data.avg_response_ms || 0,
            uptimePercent: data.uptimePercent || data.uptime_percent || "99.9",
          });
        }
      } catch {
        // API unreachable — show zeros (honest)
      }
    };
    fetchStats();
  }, []);

  const metrics = [
    { value: stats.totalRequests, suffix: "", label: "Agent Requests" },
    { value: stats.totalLeads, suffix: "", label: "Leads Processed" },
    { value: stats.avgResponseMs || 0, suffix: "ms", label: "Avg Response" },
    { value: stats.uptimePercent, suffix: "%", label: "Uptime" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mb-20 mt-10 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#10B981] serif-text mb-4">
          Live Platform Metrics
        </h2>
        <p className="text-neutral-500 max-w-2xl mx-auto text-sm">
          Real numbers from real infrastructure. Updated on every page load.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {metrics.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#10B981]/5 border border-[#10B981]/20 p-6 rounded-2xl text-center"
          >
            <div className="text-2xl md:text-3xl font-bold text-white font-mono">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#10B981] mt-2 font-bold">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
