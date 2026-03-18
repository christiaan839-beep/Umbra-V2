/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cuboid, Box, Download, Zap, Film, Rotate3D, Cpu, CheckCircle2, ChevronRight } from "lucide-react";

export default function VisualStudioPage() {
  const [prompt, setPrompt] = useState("");
  const [assetType, setAssetType] = useState<"3D_MESH" | "CINEMATIC_VIDEO">("3D_MESH");
  const [pipelineState, setPipelineState] = useState<"idle" | "generating" | "complete">("idle");

  const startForge = () => {
    if (!prompt) return;
    setPipelineState("generating");
    
    setTimeout(() => {
      setPipelineState("complete");
    }, 5500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] pointer-events-none" />
      
      <div className="mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Cpu className="w-3 h-3" /> Sovereign Visual Studio
        </div>
        <h1 className="text-4xl font-bold font-serif tracking-tight mb-2">
          Design Agency Extinction
        </h1>
        <p className="text-sm text-neutral-500 max-w-2xl leading-relaxed">
          Terminate human designer retainers. Route architectural prompts directly to NVIDIA Edify for 3D generation or NVIDIA Cosmos for 4K cinematic video synthesis. Zero latency. Zero SLA bottlenecks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Col: Prompt Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-white/10 p-6 bg-black/50 backdrop-blur-md">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-white" /> Rendering Directive
            </h3>
            
            <div className="space-y-6">
               {/* Asset Toggle */}
               <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
                 <button 
                   onClick={() => setAssetType("3D_MESH")}
                   className={`flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${assetType === "3D_MESH" ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                 >
                   <Cuboid className="w-3 h-3" /> Edify 3D
                 </button>
                 <button 
                   onClick={() => setAssetType("CINEMATIC_VIDEO")}
                   className={`flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${assetType === "CINEMATIC_VIDEO" ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                 >
                   <Film className="w-3 h-3" /> Cosmos 4K
                 </button>
               </div>

               {/* Prompt Input */}
               <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">
                    {assetType === "3D_MESH" ? "Mesh Architecture Prompt" : "Cinematic Scene Prompt"}
                  </label>
                  <textarea 
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-4 text-sm text-white focus:border-white/40 focus:ring-1 focus:ring-white/40 outline-none leading-relaxed font-mono transition-all resize-none"
                    placeholder={assetType === "3D_MESH" 
                      ? "> Generate a matte-black composite titanium UAV chassis with quad-rotor joints.\n\n> Output constraints: < 150k polys, fully rigged."
                      : "> Generate a slow-panning RED Komodo 8K sequence of an obsidian server rack pulsing with white LEDs in a dark concrete datacenter."}
                  />
               </div>
            </div>

            <button 
              onClick={startForge}
              disabled={pipelineState === "generating" || !prompt}
              className="w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex justify-center items-center gap-2"
            >
              <Zap className="w-4 h-4" /> {pipelineState === "generating" ? "Initiating Swarm..." : "Execute Render"}
            </button>
          </div>
        </div>

        {/* Right Col: Console */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[500px] flex flex-col rounded-2xl bg-black border border-white/10 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
               
               <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-4 relative z-10">
                  <div className="flex items-center gap-2">
                    {assetType === "3D_MESH" ? <Box className="w-4 h-4 text-neutral-400" /> : <Film className="w-4 h-4 text-neutral-400" />}
                    <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">
                      {assetType === "3D_MESH" ? "NVIDIA Edify Node Active" : "NVIDIA Cosmos Pipeline"}
                    </span>
                  </div>
                  {pipelineState === "generating" && (
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                       <span className="text-[9px] text-white font-mono uppercase tracking-widest font-bold">Compiling...</span>
                    </div>
                  )}
               </div>

               <div className="flex-1 relative flex items-center justify-center p-8 z-10">
                  {pipelineState === "idle" && (
                     <div className="text-center">
                        {assetType === "3D_MESH" ? (
                           <Rotate3D className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        ) : (
                           <Film className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        )}
                        <p className="text-neutral-600 font-mono text-[10px] uppercase tracking-widest">Awaiting Render Signal</p>
                     </div>
                  )}

                  {pipelineState === "generating" && (
                     <div className="text-center w-full max-w-sm">
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-6">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "100%" }}
                             transition={{ duration: 5.5, ease: "linear" }}
                             className="h-full bg-white"
                           />
                        </div>
                        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
                           <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                             {assetType === "3D_MESH" ? "Executing Voxel Synthesis..." : "Generating Video Frames..."}
                           </p>
                        </motion.div>
                     </div>
                  )}

                  {pipelineState === "complete" && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }} 
                       animate={{ opacity: 1, y: 0 }} 
                       className="w-full flex flex-col items-center"
                     >
                        {assetType === "3D_MESH" ? (
                           <div className="w-full max-w-lg aspect-square bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center p-8 mb-8 relative group">
                              <img 
                                src="https://images.unsplash.com/photo-1527961226068-d0554972175c?auto=format&fit=crop&q=80&w=400&h=400" 
                                className="w-full h-full object-contain filter grayscale contrast-150 drop-shadow-2xl mix-blend-screen opacity-70"
                                alt="Simulated 3D Model"
                              />
                              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
                           </div>
                        ) : (
                           <div className="w-full aspect-video bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center mb-8 relative overflow-hidden">
                              <img 
                                src="https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=800&h=450" 
                                className="w-full h-full object-cover filter grayscale contrast-125"
                                alt="Simulated Video Frame"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                 <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                                 </div>
                              </div>
                           </div>
                        )}
                        
                        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mb-8">
                           <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                             <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">{assetType === "3D_MESH" ? "Tris" : "Resolution"}</p>
                             <p className="text-xs font-mono text-white">{assetType === "3D_MESH" ? "124,082" : "3840x2160"}</p>
                           </div>
                           <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                             <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Format</p>
                             <p className="text-xs font-mono text-white">{assetType === "3D_MESH" ? ".USD" : "MP4 / H.265"}</p>
                           </div>
                           <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                             <p className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Validation</p>
                             <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1">
                               <CheckCircle2 className="w-3 h-3" /> Pass
                             </p>
                           </div>
                        </div>

                        <button className="px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center gap-3">
                          <Download className="w-4 h-4" /> Download Asset Package
                        </button>
                     </motion.div>
                  )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
