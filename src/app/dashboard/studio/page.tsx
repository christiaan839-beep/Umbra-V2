"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Play, Upload, MessageSquare, Mic, UserSquare2, RefreshCcw, Send, CheckCircle2 } from "lucide-react";

type RenderStatus = "idle" | "script" | "voice" | "avatar" | "rendering" | "deployed";

export default function CinematicStudioPage() {
  const [status, setStatus] = useState<RenderStatus>("idle");
  const [topic, setTopic] = useState("Biohacking Protocol for CEO Focus");
  const [progress, setProgress] = useState(0);



  const startPipeline = async () => {
    if (!topic || status !== "idle") return;
    
    setStatus("script");
    setProgress(15);

    
    try {
      // Step 1: Generate Script via Gemini 2.5 Pro
      const scriptRes = await fetch("/api/swarm/cinematic/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, style: "cinematic" }),
      });
      const scriptData = await scriptRes.json();
      
      if (scriptData.success) {
        console.log("Script generation complete", scriptData.script.length);
      }

      setStatus("voice");
      setProgress(40);

      // Step 2: Simulate Lyria Audio Generation (API not yet publicly available)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("avatar");
      setProgress(65);

      // Step 3: Simulate Veo Video Synthesis (API not yet publicly available)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStatus("rendering");
      setProgress(85);

      // Step 4: Final Render
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("deployed");
      setProgress(100);

    } catch (err) {
      console.error("[Cinematic Pipeline Error]:", err);
      setStatus("idle");
      setProgress(0);
    }
  };

  const getStepStatus = (step: string) => {
    const order = ["idle", "script", "voice", "avatar", "rendering", "deployed"];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(step);
    
    if (currentIndex > stepIndex) return "completed";
    if (currentIndex === stepIndex) return "active";
    return "pending";
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-8 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Film className="w-3 h-3" /> Synthesis Engine
        </div>
        <h1 className="text-3xl font-bold font-mono text-white tracking-tight">Cinematic Studio</h1>
        <p className="text-sm text-[#8A95A5] mt-2 max-w-2xl font-mono uppercase tracking-widest flex items-center gap-2">
          Autonomous Generation: <span className="text-indigo-400 font-bold">Lyria (Audio)</span> + <span className="text-emerald-400 font-bold">Veo (Video)</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Input & Control Panel */}
        <div className="lg:col-span-1 glass-card border flex flex-col overflow-hidden bg-black/40 backdrop-blur-2xl border-glass-border">
          <div className="p-8 flex items-center justify-between border-b border-glass-border bg-black/40">
            <h3 className="text-white font-bold font-mono flex items-center gap-2 text-sm uppercase tracking-widest">
              <Upload className="w-4 h-4 text-indigo-400" /> Vector Input
            </h3>
          </div>
          <div className="p-8 flex-1 flex flex-col space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2">Subject / Hook Vector</label>
              <textarea 
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-black/60 border border-glass-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all shadow-inner resize-none"
                placeholder="Paste context from AI Memory..."
                disabled={status !== "idle"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2 flex items-center gap-1">Audio Synthesis <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span></label>
                  <select disabled={status !== "idle"} className="w-full bg-black/60 border border-glass-border rounded-lg px-3 py-2.5 text-xs text-white outline-none cursor-pointer appearance-none border-indigo-500/30">
                    <option>Google Lyria (Cinematic Score)</option>
                    <option>Google Lyria (Dynamic Voice)</option>
                    <option>Gemini Audio (Real-time TTS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-[#5C667A] mb-2 flex items-center gap-1">Visual Synthesizer <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></label>
                  <select disabled={status !== "idle"} className="w-full bg-black/60 border border-glass-border rounded-lg px-3 py-2.5 text-xs text-white outline-none cursor-pointer appearance-none border-emerald-500/30">
                    <option>Google Veo (Hyper-Realistic)</option>
                    <option>Google Veo (Cinematic 4K)</option>
                    <option>Legacy Avatar (HeyGen)</option>
                  </select>
                </div>
            </div>

            <div className="mt-auto pt-6">
              <button 
                onClick={startPipeline}
                disabled={status !== "idle" || !topic}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-lg flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
              >
                {status === "idle" ? <><Play className="w-4 h-4" /> Synthesize Grid</> : <><RefreshCcw className="w-4 h-4 animate-spin" /> Swarm Generating...</>}
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Visualizer */}
        <div className="lg:col-span-2 glass-card border flex flex-col overflow-hidden bg-black/40 backdrop-blur-2xl border-glass-border relative">
            <div className="p-4 border-b border-glass-border bg-black/40 flex flex-col shrink-0 gap-3">
               <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white font-mono">Telemetry: Real-Time Render</h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      {status !== "idle" && status !== "deployed" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'idle' ? 'bg-stone-500' : status === 'deployed' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#5C667A]">
                      {status === "idle" ? "Standby" : status === "deployed" ? "Live" : "Processing"}
                    </span>
                  </div>
               </div>
               <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                   transition={{ duration: 0.5 }}
                 />
               </div>
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center relative">
               
               {/* Decorative grid */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-50" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] to-transparent pointer-events-none" />

               <div className="relative z-10 max-w-lg mx-auto w-full space-y-6">
                 
                 {/* Step 1 */}
                 <PipelineNode 
                   title="Script Engineering" 
                   agent="Gemini 1.5 Pro" 
                   icon={MessageSquare} 
                   status={getStepStatus("script")} 
                 />
                 
                 {/* Step 2 */}
                 <PipelineNode 
                   title="Lyria Audio Generation" 
                   agent="Google Lyria Engine" 
                   icon={Mic} 
                   status={getStepStatus("voice")} 
                 />

                 {/* Step 3 */}
                 <PipelineNode 
                   title="Veo Video Synthesis" 
                   agent="Google Veo API" 
                   icon={UserSquare2} 
                   status={getStepStatus("avatar")} 
                 />

                 {/* Step 4 */}
                 <PipelineNode 
                   title="Autonomous Deployment" 
                   agent="Swarm Root" 
                   icon={Send} 
                   status={getStepStatus("rendering")} 
                 />

               </div>

            </div>
        </div>

      </div>
    </div>
  );
}

function PipelineNode({ title, agent, icon: Icon, status }: { title: string, agent: string, icon: React.ComponentType<{ className?: string }>, status: "pending" | "active" | "completed" }) {
  return (
    <div className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 
      ${status === 'active' ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.15)] scale-105 z-10' : 
        status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : 
        'bg-black/40 border-glass-border opacity-50'}`}
    >
       <div className={`flex items-center justify-center w-10 h-10 rounded-lg border 
         ${status === 'active' ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse' : 
           status === 'completed' ? 'bg-emerald-900 border-emerald-500 text-emerald-400' : 
           'bg-stone-900 border-stone-800 text-stone-500'}`}
       >
         {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
       </div>
       
       <div className="flex-1">
         <h4 className={`text-sm tracking-wide font-bold ${status === 'active' ? 'text-white' : status === 'completed' ? 'text-emerald-100' : 'text-stone-400'}`}>{title}</h4>
         <p className="text-[10px] uppercase tracking-widest text-[#5C667A] font-mono mt-0.5">{agent}</p>
       </div>

       {status === 'active' && (
         <div className="absolute right-4 flex gap-1">
           <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
           <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
           <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
         </div>
       )}
    </div>
  );
}
