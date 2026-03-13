"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Activity, ShieldAlert, Crosshair, Zap, Database, TerminalSquare, Radio, MapPin } from "lucide-react";

export default function OmnipresenceHub() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchData();
    // Poll every 5 seconds for "live" effect
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
      switch(type) {
          case 'capital': return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/50';
          case 'attention': return 'text-electric bg-electric/20 border-electric/50';
          case 'acquisition': return 'text-rose-500 bg-rose-500/20 border-rose-500/50';
          default: return 'text-white bg-white/20 border-white/50';
      }
  };

  return (
    <div className="min-h-screen bg-midnight text-white flex flex-col font-mono relative overflow-hidden">
      
      {/* Background Radar Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_95%,rgba(0,183,255,0.1)_100%)] bg-[length:100%_40px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0)_95%,rgba(0,183,255,0.1)_100%)] bg-[length:40px_100%]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-electric/30 border-dashed animate-[spin_60s_linear_infinite]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-electric/20" />
      </div>

      {/* Header Overlay */}
      <div className="relative z-10 p-6 border-b border-glass-border bg-midnight/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
              <div className="relative">
                  <Globe2 className="w-8 h-8 text-electric" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                  </span>
              </div>
              <div>
                  <h1 className="text-xl font-bold tracking-[0.2em] uppercase glow-text">Omnipresence</h1>
                  <p className="text-[10px] text-electric/70 uppercase tracking-widest mt-1">Global Telemetry Uplink: {data?.lastPing ? new Date(data.lastPing).toLocaleTimeString() : 'Syncing...'}</p>
              </div>
          </div>
          <div className="flex gap-6 hidden md:flex">
             {[
                 { label: "Active Nodes", value: data?.stats?.activeNodes || "—", icon: Database },
                 { label: "Capital (USD)", value: data?.stats?.capitalExtracted ? `$${data.stats.capitalExtracted.toLocaleString()}` : "—", icon: Zap, color: 'text-emerald-400' },
                 { label: "Funnels Hijacked", value: data?.stats?.funnelsHijacked || "—", icon: Crosshair, color: 'text-rose-500' },
                 { label: "Attention Share", value: data?.stats?.attentionCaptured ? `${(data.stats.attentionCaptured / 1000000).toFixed(1)}M` : "—", icon: Activity, color: 'text-electric' },
             ].map((stat, i) => (
                 <div key={i} className="flex flex-col items-end">
                     <span className="text-[10px] uppercase text-text-secondary tracking-widest flex items-center gap-1 mb-1">
                         <stat.icon className="w-3 h-3" /> {stat.label}
                     </span>
                     <span className={`text-lg font-bold ${stat.color || 'text-white'}`}>{loading ? "..." : stat.value}</span>
                 </div>
             ))}
          </div>
      </div>

      {/* Main Theatre */}
      <div className="flex-1 relative z-10 flex flex-col xl:flex-row">
          
          {/* Radar Visualization Area */}
          <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden min-h-[500px]">
              {/* Stylized World Map Representation (Abstract) */}
              <div className="relative w-full max-w-[800px] aspect-[2/1] border border-glass-border/30 bg-onyx/20 rounded-xl overflow-hidden backdrop-blur-sm">
                  {/* Sweep Line */}
                  <div className="absolute top-1/2 left-1/2 w-[150%] h-0.5 bg-electric/50 origin-left animate-[spin_4s_linear_infinite]" style={{ boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff' }} />
                  
                  {loading ? (
                       <div className="absolute inset-0 flex items-center justify-center flex-col text-electric/50">
                           <Radio className="w-12 h-12 animate-pulse mb-4" />
                           <p className="text-xs uppercase tracking-[0.3em]">Establishing Sat-Link...</p>
                       </div>
                  ) : (
                      <>
                        <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Equirectangular_projection_SW.jpg')] bg-cover bg-center filter grayscale contrast-200 brightness-200 mix-blend-screen" />
                        <AnimatePresence>
                            {data?.telemetry?.map((point: any) => {
                                // Map Lat/Lng to % (Rough Equirectangular translation)
                                const x = ((point.location.lng + 180) / 360) * 100;
                                const y = ((90 - point.location.lat) / 180) * 100;

                                return (
                                    <motion.div
                                        key={point.id}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: [0.8, 1, 0.5], scale: [0.5, 1.2, 1] }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        className="absolute w-4 h-4 -ml-2 -mt-2 group cursor-crosshair"
                                        style={{ left: `${x}%`, top: `${y}%` }}
                                    >
                                        <div className={`w-full h-full rounded-full ${getTypeColor(point.type).split(' ')[1]} flex items-center justify-center animate-ping absolute opacity-75`} />
                                        <div className={`w-2 h-2 rounded-full ${getTypeColor(point.type).split(' ')[1]} relative z-10 mx-auto mt-1`} />
                                        
                                        {/* Hover Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-midnight/90 border border-glass-border rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                                            <p className={`font-bold uppercase tracking-wider ${getTypeColor(point.type).split(' ')[0]}`}>{point.location.name}</p>
                                            <p className="text-white mt-1 truncate">{point.description}</p>
                                            <p className="text-text-secondary mt-1">{new Date(point.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                      </>
                  )}
              </div>
          </div>

          {/* Telemetry Feed Log */}
          <div className="w-full xl:w-[450px] border-l border-glass-border bg-midnight/50 flex flex-col">
              <div className="p-4 border-b border-glass-border flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-electric flex items-center gap-2">
                      <TerminalSquare className="w-4 h-4" />
                      Live God-Brain Stream
                  </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {loading ? (
                      <div className="animate-pulse space-y-4">
                          {[1,2,3,4,5].map(i => (
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
                                  className={`p-3 rounded border text-xs ${getTypeColor(log.type)} bg-opacity-10 backdrop-blur-sm`}
                              >
                                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-[currentcolor]/20">
                                      <span className="font-bold uppercase tracking-widest flex items-center gap-1">
                                          <MapPin className="w-3 h-3" /> {log.location.name} [{log.location.region}]
                                      </span>
                                      <span className="opacity-70 text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                  <p className="text-white/90 leading-relaxed font-sans">{log.description}</p>
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
