"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, Wand2, PlayCircle, Users, Download, Activity, FileVideo } from "lucide-react";

export default function DeepfakeStudioPage() {
  const [pipelineState, setPipelineState] = useState<"idle" | "cloning" | "generating" | "complete">("idle");
  const [leadCount, setLeadCount] = useState(5000);

  const startPipeline = () => {
    setPipelineState("cloning");
    setTimeout(() => setPipelineState("generating"), 3000);
    setTimeout(() => setPipelineState("complete"), 7000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
          <FileVideo className="w-3 h-3" /> Omniverse Video-to-Video
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
          Executive Deepfake Studio
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Upload a master video. The engine clones the face and voice, then autonomously generates thousands of hyper-personalized 4K videos addressed perfectly to each lead in your CRM. Replaces video production agencies instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Setup */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-400" /> Source Material
            </h3>
            
            <div className="border border-dashed border-white/20 rounded-xl p-8 text-center bg-black/40 cursor-not-allowed mb-6 group hover:border-indigo-500/50 transition-colors">
               <Mic className="w-8 h-8 text-neutral-600 mx-auto mb-3 group-hover:text-indigo-400 transition-colors" />
               <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Master.MP4 Selected</p>
               <p className="text-[10px] text-emerald-500 font-mono mt-2">Vocal / Visual Profiles Extracted</p>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">CRM Lead Volume</label>
                  <input 
                    type="number"
                    value={leadCount}
                    onChange={(e) => setLeadCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500/50 outline-none font-mono"
                  />
               </div>
               
               <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">Dynamic Script Template</label>
                  <div className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white font-mono leading-relaxed h-32 overflow-y-auto">
                    "Hey <span className="text-emerald-400">{'{{first_name}}'}</span> from <span className="text-emerald-400">{'{{company_name}}'}</span>. I noticed your team is still using manual SDRs for outbound. We just deployed a sovereign AI swarm for a competitor in your space..."
                  </div>
               </div>
            </div>

            <button 
              onClick={startPipeline}
              disabled={pipelineState !== "idle"}
              className="w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-500 text-white hover:bg-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.3)] flex justify-center items-center gap-2"
            >
              <Wand2 className="w-4 h-4" /> Synthesize Campaign
            </button>
          </div>
        </div>

        {/* Right Col: Console */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[500px] flex flex-col rounded-2xl bg-black border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.05)]">
               <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-mono text-indigo-400/80 tracking-widest uppercase">NVIDIA Audio2Face / V2V Render Farm</span>
                  </div>
                  {pipelineState === "cloning" || pipelineState === "generating" ? (
                     <div className="flex items-center gap-2 text-[9px] text-indigo-400 font-mono uppercase tracking-widest font-bold animate-pulse">
                         Rendering Frame Buffer...
                     </div>
                  ) : pipelineState === "complete" ? (
                    <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-mono uppercase tracking-widest font-bold">
                       <CheckCircle2 className="w-3 h-3" /> Mass Render Complete
                    </div>
                  ) : null}
               </div>

               <div className="p-6 flex-1 bg-[url('/noise.png')] bg-repeat opacity-95 flex flex-col justify-center">
                  {pipelineState === "idle" && (
                    <div className="text-center">
                       <Video className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                       <p className="text-neutral-600 font-mono text-xs uppercase tracking-widest">
                         Awaiting Render Command...<br/>
                         Cloud GPUs idle.
                       </p>
                    </div>
                  )}

                  {(pipelineState === "cloning" || pipelineState === "generating") && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xl mx-auto space-y-4 font-mono text-xs text-indigo-400/80">
                        {pipelineState === "cloning" && (
                          <>
                            <p className="animate-pulse">&gt; Interpolating facial mesh landmarks (1,204 nodes)...</p>
                            <p className="animate-pulse delay-75">&gt; Extracting vocal timbre signature via Riva TTS...</p>
                            <p className="animate-pulse delay-150">&gt; Building dynamic visual skeleton...</p>
                          </>
                        )}
                        {pipelineState === "generating" && (
                          <>
                            <p className="text-emerald-400">&gt; Biometric clone successful. Initializing batch render.</p>
                            <p className="animate-pulse">&gt; Synthesizing 5,000 unique audio tracks...</p>
                            <p className="animate-pulse delay-75">&gt; Matching lip-sync tensors over original 4K video...</p>
                            <div className="mt-4 p-4 border border-indigo-500/20 bg-indigo-500/10 rounded-lg">
                               <div className="flex justify-between items-center mb-2">
                                  <span>Render Progress:</span>
                                  <span className="text-emerald-400">76%</span>
                               </div>
                               <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
                                  <motion.div className="h-full bg-indigo-500" initial={{ width: "0%" }} animate={{ width: "76%" }} transition={{ duration: 3 }} />
                               </div>
                            </div>
                          </>
                        )}
                     </motion.div>
                  )}

                  {pipelineState === "complete" && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className="w-20 h-20 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                           <PlayCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 tracking-tight text-white">{leadCount.toLocaleString()} Hyper-Personalized Videos Synthesized</h2>
                        <p className="text-sm font-mono text-neutral-400 mb-8 max-w-lg mx-auto">
                           Zero human involvement. Time elapsed: <span className="text-emerald-400">14 minutes 32 seconds.</span> Equivalent video agency cost: <span className="text-rose-400 line-through">$1,250,000</span>.
                        </p>
                        
                        <div className="flex items-center justify-center gap-4">
                           <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center gap-2">
                             <Download className="w-4 h-4" /> Download .ZIP (420GB)
                           </button>
                           <button className="px-6 py-3 rounded-xl bg-indigo-500 border border-indigo-400 text-white font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center gap-2">
                             <Users className="w-4 h-4" /> Push Straight to Outbound SDR Swarm
                           </button>
                        </div>
                     </motion.div>
                  )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
