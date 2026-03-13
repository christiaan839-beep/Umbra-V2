"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Activity, Zap, Database, TerminalSquare, MapPin, Crosshair, Radio } from "lucide-react";
import dynamic from 'next/dynamic';

const TelemetryGlobe = dynamic(() => import('@/components/3d/TelemetryGlobe'), { ssr: false });

export default function OmnipresenceHub() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/swarm/omnipresence");
      const json = await res.json();
      if (json.data) setData(json.data);
      setLoading(false);
    } catch (e) {
      console.error("Omnipresence sync failed", e);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'capital': return 'text-emerald-400';
      case 'attention': return 'text-[#00B7FF]';
      case 'acquisition': return 'text-rose-500';
      default: return 'text-white';
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] text-white font-mono relative">

      {/* Header */}
      <div className="relative z-10 p-6 backdrop-blur-3xl bg-black/40 border-b border-[#00B7FF]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Globe2 className="w-8 h-8 text-[#00B7FF]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-white">Omnipresence</h1>
            <p className="text-[10px] text-[#00B7FF]/70 uppercase tracking-widest mt-1">
              Global Telemetry Uplink: {data?.lastPing ? new Date(data.lastPing).toLocaleTimeString() : 'Syncing...'}
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          {[
            { label: "Active Nodes", value: data?.stats?.activeNodes || "—", icon: Database },
            { label: "Capital (USD)", value: data?.stats?.capitalExtracted ? `$${data.stats.capitalExtracted.toLocaleString()}` : "—", icon: Zap, color: 'text-emerald-400' },
            { label: "Funnels Hijacked", value: data?.stats?.funnelsHijacked || "—", icon: Crosshair, color: 'text-rose-500' },
            { label: "Attention Share", value: data?.stats?.attentionCaptured ? `${(data.stats.attentionCaptured / 1000000).toFixed(1)}M` : "—", icon: Activity, color: 'text-[#00B7FF]' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-end">
              <span className="text-[10px] uppercase text-neutral-500 tracking-widest flex items-center gap-1 mb-1">
                <stat.icon className="w-3 h-3" /> {stat.label}
              </span>
              <span className={`text-lg font-bold ${stat.color || 'text-white'}`}>{loading ? "..." : stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content — Globe + Feed */}
      <div className="flex-1 relative z-10 flex flex-col xl:flex-row">

        {/* 3D Globe Visualization Area */}
        <div className="flex-1 relative min-h-[600px]">
          <TelemetryGlobe />

          {/* Overlay HUD Cards */}
          <div className="absolute bottom-6 left-6 right-6 flex gap-4 z-10 pointer-events-none">
            {[
              { region: 'NA', label: 'North America', leads: 2340, capital: '$18.4K', status: 'HOT' },
              { region: 'EU', label: 'Europe', leads: 1890, capital: '$12.1K', status: 'ACTIVE' },
              { region: 'APAC', label: 'Asia Pacific', leads: 980, capital: '$7.8K', status: 'GROWING' },
            ].map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex-1 backdrop-blur-3xl bg-black/60 border border-[#00B7FF]/20 rounded-xl p-4 pointer-events-auto"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">{r.label}</span>
                  <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${r.status === 'HOT' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : r.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                    {r.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-white font-mono">{r.leads.toLocaleString()}</p>
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest">Leads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400 font-mono">{r.capital}</p>
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest">Capital</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Telemetry Feed Log */}
        <div className="w-full xl:w-[400px] border-l border-[#00B7FF]/10 bg-black/30 backdrop-blur-xl flex flex-col">
          <div className="p-4 border-b border-[#00B7FF]/10 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00B7FF] flex items-center gap-2">
              <TerminalSquare className="w-4 h-4" />
              Live God-Brain Stream
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-white/5 rounded mx-2" />
                ))}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {data?.telemetry?.map((log: any) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-xl border border-[#00B7FF]/15 bg-black/40 backdrop-blur-md text-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-bold uppercase tracking-widest flex items-center gap-1 ${getTypeColor(log.type)}`}>
                        <MapPin className="w-3 h-3" /> {log.location.name} [{log.location.region}]
                      </span>
                      <span className="opacity-50 text-[9px] text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-sans">{log.description}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
