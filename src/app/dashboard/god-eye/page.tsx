"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Focus, BarChart3, ScanEye, Camera, MonitorCheck, Map, Users } from "lucide-react";

export default function GodEyePage() {
  const [pipelineState, setPipelineState] = useState<"idle" | "calibrating" | "live">("idle");

  const startStream = () => {
    setPipelineState("calibrating");
    setTimeout(() => {
      setPipelineState("live");
    }, 4000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <ScanEye className="w-3 h-3" /> Metropolis Video Analytics
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
          God-Eye Spatial Tracking
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Powered by NVIDIA Metropolis. Ingests CCTV or webcam feeds to process real-time spatial analytics, heatmaps, footfall tracking, and demographic estimations for physical retail/warehouses automatically synced to the Sovereign CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[500px] flex flex-col rounded-2xl bg-black border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)] relative group">
               {/* Overlay UI */}
               <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <div className="px-3 py-1 bg-black/50 backdrop-blur border border-white/10 rounded-md flex items-center gap-2">
                     <Camera className="w-3 h-3 text-emerald-500" />
                     <span className="text-[10px] font-mono text-white uppercase tracking-widest">Feed 01 / Retail Floor</span>
                  </div>
                  {pipelineState === "live" && (
                    <div className="px-3 py-1 bg-emerald-500/20 backdrop-blur border border-emerald-500/50 rounded-md flex items-center gap-2 animate-pulse">
                       <span className="w-2 h-2 rounded-full bg-emerald-500" />
                       <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">120 FPS / YOLOv8 Tensor</span>
                    </div>
                  )}
               </div>

               {/* Video Canvas */}
               <div className="flex-1 relative bg-neutral-900 border-b border-white/10 overflow-hidden flex items-center justify-center">
                  {pipelineState === "idle" && (
                     <div className="text-center">
                        <MonitorCheck className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Cameras Offline</p>
                        <button onClick={startStream} className="mt-4 px-6 py-2 bg-white/5 border border-white/10 rounded text-xs uppercase hover:bg-white/10 transition-colors">Connect RTSP Stream</button>
                     </div>
                  )}
                  {pipelineState === "calibrating" && (
                     <div className="text-center absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 font-mono text-emerald-400 text-xs">
                        <Focus className="w-10 h-10 animate-spin mb-4" />
                        <p>&gt; Calibrating intrinsic matrix...</p>
                        <p>&gt; Loading human pose estimation weights...</p>
                     </div>
                  )}
                  {(pipelineState === "live" || pipelineState === "calibrating") && (
                     <>
                        <img 
                          src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80"
                          className={`w-full h-full object-cover transition-all duration-1000 ${pipelineState === "calibrating" ? 'blur-md grayscale' : 'grayscale-0'}`}
                          alt="Retail Store Live Feed"
                        />
                        {/* Fake bounding box overlay */}
                        {pipelineState === "live" && (
                          <div className="absolute inset-0 pointer-events-none">
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute top-[30%] left-[45%] w-24 h-48 border-2 border-emerald-500 bg-emerald-500/10">
                                <div className="absolute -top-5 left-[-2px] bg-emerald-500 text-black text-[9px] font-bold px-1 uppercase tracking-widest">Person (0.94)</div>
                                <div className="absolute bottom-1 right-1 text-[8px] font-mono text-emerald-400">AGE: ~28</div>
                             </motion.div>
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute top-[40%] left-[20%] w-16 h-32 border-2 border-emerald-500 bg-emerald-500/10">
                                <div className="absolute -top-5 left-[-2px] bg-emerald-500 text-black text-[9px] font-bold px-1 uppercase tracking-widest">Person (0.87)</div>
                                <div className="absolute bottom-1 right-1 text-[8px] font-mono text-emerald-400">DWELL: 42s</div>
                             </motion.div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-30 pointer-events-none" />
                     </>
                  )}
               </div>
               
               {/* Event Log */}
               <div className="h-40 bg-black p-4 overflow-y-auto font-mono text-[10px] text-neutral-400">
                  {pipelineState === "live" ? (
                    <div className="space-y-2">
                       <p><span className="text-emerald-500">[14:02:11]</span> Event: High Dwell Time (Aisle 4 / Electronics) - Syncing to CRM.</p>
                       <p><span className="text-emerald-500">[14:02:18]</span> Event: Entry recognized (Demographic: Male, ~35-45).</p>
                       <p><span className="text-rose-500">[14:02:40]</span> Alert: Zone boundary breached (Staff Only / Backroom).</p>
                    </div>
                  ) : (
                    <p>Awaiting telemetry...</p>
                  )}
               </div>
           </div>
        </div>

        {/* Right Col: Metrics */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" /> Spatial Intelligence
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-2">
                       <span>Current Occupancy</span>
                       <span className="text-white">42 / 100</span>
                    </div>
                    <div className="h-2 bg-black rounded-full overflow-hidden border border-white/5">
                       <motion.div className="h-full bg-emerald-500" initial={{ width: "0%" }} animate={{ width: pipelineState === "live" ? "42%" : "0%" }} />
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-2">
                       <span>Avg Dwell Time</span>
                       <span className="text-emerald-400">8.4 mins</span>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                       <Map className="w-4 h-4 text-neutral-500" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Heatmap Zones</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                       <div className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded flex justify-between"><span>Entrance</span><span>High</span></div>
                       <div className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded flex justify-between"><span>Aisle 3</span><span>Med</span></div>
                       <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded flex justify-between"><span>Checkout</span><span>Low</span></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
