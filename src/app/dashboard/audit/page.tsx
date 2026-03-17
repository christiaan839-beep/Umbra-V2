"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Shield, Activity, Filter } from "lucide-react";

interface AuditEvent {
  type: string;
  timestamp: string;
  payload: string;
}

export default function AuditTimeline() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Seed with demo data
    setEvents([
      { type: "audit:campaign_launched", timestamp: new Date(Date.now() - 120000).toISOString(), payload: JSON.stringify({ actorType: "ai_agent", actorId: "outbound-swarm", details: { niche: "MedSpa", count: 5 } }) },
      { type: "audit:content_published", timestamp: new Date(Date.now() - 300000).toISOString(), payload: JSON.stringify({ actorType: "ai_agent", actorId: "content-engine", details: { platform: "Instagram", title: "5 Botox Myths Debunked" } }) },
      { type: "audit:competitor_scanned", timestamp: new Date(Date.now() - 600000).toISOString(), payload: JSON.stringify({ actorType: "system", actorId: "warfare-scanner", details: { competitor: "RivalSpa.com", threatLevel: "MEDIUM" } }) },
      { type: "audit:lead_closed", timestamp: new Date(Date.now() - 900000).toISOString(), payload: JSON.stringify({ actorType: "ai_agent", actorId: "closer-bot", details: { prospect: "Dr. Sarah Mitchell", value: "R85,000" } }) },
      { type: "audit:page_deployed", timestamp: new Date(Date.now() - 1200000).toISOString(), payload: JSON.stringify({ actorType: "ai_agent", actorId: "page-factory", details: { keyword: "botox miami", slug: "/botox-miami" } }) },
      { type: "audit:user_login", timestamp: new Date(Date.now() - 1800000).toISOString(), payload: JSON.stringify({ actorType: "user", actorId: "admin@umbra.ai", details: { ip: "192.168.1.1" } }) },
    ]);
  }, []);

  const getEventColor = (type: string) => {
    if (type.includes("lead")) return "#10B981";
    if (type.includes("content")) return "#A855F7";
    if (type.includes("competitor")) return "#EF4444";
    if (type.includes("campaign")) return "#F97316";
    if (type.includes("page")) return "#06B6D4";
    return "#6B7280";
  };

  const getEventLabel = (type: string) => type.replace("audit:", "").replace(/_/g, " ").toUpperCase();

  const filteredEvents = filter === "all" ? events : events.filter((e) => e.type.includes(filter));

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col gap-6 p-4 lg:p-8 z-10 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-widest font-mono flex items-center gap-3">
            <Shield className="w-6 h-6 text-cyan-400" />
            AUDIT TRAIL
          </h1>
          <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-[10px] font-bold mt-1">
            Full Operational Transparency
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-black/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-300 font-mono focus:outline-none">
            <option value="all">All Events</option>
            <option value="lead">Leads</option>
            <option value="content">Content</option>
            <option value="competitor">Competitor</option>
            <option value="campaign">Campaigns</option>
            <option value="page">Pages</option>
          </select>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />
        <div className="space-y-4">
          {filteredEvents.map((event, i) => {
            const parsed = JSON.parse(event.payload);
            const color = getEventColor(event.type);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative z-10" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                  <Activity className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color }}>
                      {getEventLabel(event.type)}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono">Actor: {parsed.actorType}:{parsed.actorId}</span>
                    {Object.entries(parsed.details || {}).map(([k, v]) => (
                      <span key={k} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono">{k}: {String(v)}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
