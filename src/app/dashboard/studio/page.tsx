"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Film, Wand2, MonitorPlay, Activity, RefreshCw, Layers, CheckCircle2, Play } from "lucide-react";

export default function CinematicStudioHub() {
  const [isRendering, setIsRendering] = useState(false);
  const [renderStage, setRenderStage] = useState<"idle" | "scripting" | "audio" | "compositing" | "completed">("idle");
  const [renderedAssets, setRenderedAssets] = useState<any[]>([]);

  const triggerRenderCycle = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsRendering(true);
      setRenderStage("scripting");

      const formData = new FormData(e.target as HTMLFormElement);
      const payload = {
          topic: formData.get("topic"),
          format: formData.get("format"),
          duration: formData.get("duration")
      };

      try {
          // Simulate the multi-stage rendering visual feedback
          setTimeout(() => setRenderStage("audio"), 2500);
          setTimeout(() => setRenderStage("compositing"), 5000);

          const res = await fetch("/api/swarm/cinematic/render", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });

          const data = await res.json();
          
          if (data.success) {
              setRenderStage("completed");
              setRenderedAssets(prev => [data.data, ...prev]);
          }
      } catch (error) {
          console.error("Render Failed:", error);
          setRenderStage("idle");
      } finally {
          setTimeout(() => {
              setIsRendering(false);
              setRenderStage("idle");
          }, 2000);
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-midnight text-white font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glass-border pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                    <Film className="text-electric w-8 h-8" />
                    Cinematic Studio
                </h1>
                <p className="text-text-secondary uppercase tracking-widest text-xs mt-2">Autonomous Video Synthesis // HeyGen + ElevenLabs Uplink</p>
            </div>
            <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase text-emerald-400 tracking-widest flex items-center gap-1">
                         <MonitorPlay className="w-3 h-3" /> Rendered Core Assets
                     </span>
                     <span className="text-xl font-bold font-sans">{renderedAssets.length + 142}</span>
                 </div>
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase text-text-secondary tracking-widest flex items-center gap-1">
                         <Activity className="w-3 h-3" /> GPU Cluster Status
                     </span>
                     <span className="text-xl font-bold font-sans text-electric">Online</span>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Render Matrix (Form) */}
            <div className="col-span-1 border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl p-6 h-fit">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
                    <Wand2 className="w-4 h-4 text-electric" /> Render Matrix
                </h2>

                <form onSubmit={triggerRenderCycle} className="space-y-5">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-secondary block mb-2">Creative Topic</label>
                        <input name="topic" type="text" placeholder="e.g. UMBRA Omni-Channel Domination" required className="w-full bg-midnight/50 border border-glass-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors" />
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-secondary block mb-2">Payload Format</label>
                        <select name="format" className="w-full bg-midnight/50 border border-glass-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors appearance-none">
                            <option value="short">Short-form (TikTok/Reels/Shorts)</option>
                            <option value="vsl">Video Sales Letter (Long-form)</option>
                        </select>
                    </div>

                    <div>
                         <label className="text-xs uppercase tracking-wider text-text-secondary block mb-2">Target Duration (Seconds)</label>
                        <input name="duration" type="number" defaultValue={60} min={15} max={600} required className="w-full bg-midnight/50 border border-glass-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors" />
                    </div>

                    <button disabled={isRendering} type="submit" className="w-full py-4 mt-6 bg-gradient-to-r from-electric to-rose-glow rounded-md text-white font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(45,110,255,0.2)]">
                         {isRendering ? (
                             <><RefreshCw className="w-4 h-4 animate-spin text-white" /> Allocating GPU Nodes...</>
                         ) : (
                             <><Film className="w-4 h-4" /> Synthesize Asset</>
                         )}
                    </button>
                    
                    <p className="text-[10px] text-text-secondary mt-4 text-center leading-relaxed">
                        Initializing the render matrix will trigger Gemini 1.5 Pro script generation, followed by ElevenLabs voice synthesis and HeyGen visual avatar lip-syncing.
                    </p>
                </form>
            </div>

            {/* Render Queue & Media Gallery */}
            <div className="col-span-1 lg:col-span-2 space-y-6">
                
                {/* Active Render Queue UI */}
                <AnimatePresence>
                    {isRendering && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border border-electric bg-midnight/80 rounded-xl p-6 shadow-[0_0_30px_rgba(0,183,255,0.15)] relative overflow-hidden"
                        >
                            {/* Scanning line effect */}
                            <motion.div 
                                initial={{ top: 0 }} animate={{ top: "100%" }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-electric blur-[2px] opacity-50 shadow-[0_0_20px_rgba(0,183,255,1)]"
                             />

                            <h3 className="text-xs uppercase font-bold tracking-widest text-electric flex items-center gap-2 mb-6">
                                <Activity className="w-4 h-4 animate-pulse" /> Active Render Queue
                            </h3>

                            <div className="space-y-4 relative z-10">
                                <div className={`flex items-center gap-4 ${renderStage === 'scripting' ? 'text-white' : renderStage === 'audio' || renderStage === 'compositing' || renderStage === 'completed' ? 'text-emerald-400' : 'text-text-secondary'}`}>
                                    {renderStage === 'scripting' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    <span className="text-sm font-bold tracking-widest uppercase">Phase 1: Synthesizing Script Matrix (Gemini 1.5 Pro)</span>
                                </div>
                                <div className={`flex items-center gap-4 ${renderStage === 'audio' ? 'text-white' : renderStage === 'compositing' || renderStage === 'completed' ? 'text-emerald-400' : 'text-text-secondary opacity-50'}`}>
                                    {renderStage === 'audio' ? <RefreshCw className="w-4 h-4 animate-spin" /> : renderStage === 'compositing' || renderStage === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                    <span className="text-sm font-bold tracking-widest uppercase">Phase 2: Generating Neural Voiceover (ElevenLabs)</span>
                                </div>
                                <div className={`flex items-center gap-4 ${renderStage === 'compositing' ? 'text-white' : renderStage === 'completed' ? 'text-emerald-400' : 'text-text-secondary opacity-50'}`}>
                                    {renderStage === 'compositing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : renderStage === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                    <span className="text-sm font-bold tracking-widest uppercase">Phase 3: Avatar Lip-Sync & Final Compositing (HeyGen)</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Media Gallery */}
                <div className="border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl p-6 min-h-[400px]">
                     <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
                        <Video className="w-4 h-4 text-electric" /> UMBRA Media Library
                    </h2>

                    {renderedAssets.length === 0 && !isRendering ? (
                        <div className="flex flex-col items-center justify-center h-64 text-text-secondary opacity-50">
                            <MonitorPlay className="w-12 h-12 mb-4" />
                            <p className="uppercase tracking-widest text-xs">Media Library Empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {renderedAssets.map((asset) => (
                                    <motion.div 
                                        key={asset.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-midnight border border-glass-border rounded-lg overflow-hidden group hover:border-electric transition-colors"
                                    >
                                        {/* Mock Video Thumbnail Area */}
                                        <div className="h-32 bg-black relative flex items-center justify-center border-b border-glass-border">
                                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
                                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-electric/20 group-hover:border-electric transition-colors z-10">
                                                <Play className="w-4 h-4 text-white ml-1" />
                                            </div>
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] uppercase font-bold text-electric z-10">
                                                .MP4
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Layers className="w-3 h-3 text-text-secondary" />
                                                <span className="text-[10px] text-text-secondary font-mono">{asset.id}</span>
                                            </div>
                                            <p className="text-xs text-white line-clamp-2 leading-relaxed font-sans">{asset.script}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

            </div>
        </div>
    </div>
  );
}
