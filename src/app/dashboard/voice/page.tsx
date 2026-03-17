"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Phone, Mic, ShieldAlert, Cpu, Activity, Play, Square, Volume2, Network } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { VoicePathwayBuilder } from "@/components/dashboard/VoicePathwayBuilder";

function VoiceAgentClient() {
  const searchParams = useSearchParams();
  const [targetPhone, setTargetPhone] = useState(searchParams.get("phone") || "");
  const [context, setContext] = useState(searchParams.get("context") || "Offer: Free SEO Audit + Review Sweeper");
  
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "active" | "completed">("idle");
  const [activeTab, setActiveTab] = useState<"execution" | "pathway">("execution");

  const initiateCall = async () => {
    if (!targetPhone) return;
    setCallStatus("connecting");
    
    // Simulate connection to Pipecat / NVIDIA NIM
    setTimeout(() => {
      setCallStatus("active");
    }, 2500);
  };

  const endCall = () => {
    setCallStatus("completed");
    setTimeout(() => setCallStatus("idle"), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3 animate-pulse">
          <Cpu className="w-3 h-3" /> UMBRA V3: Voice Node (NVIDIA NIM)
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Autonomous Voice Caller</h1>
        <p className="text-sm text-stone-400 mt-2 max-w-2xl">
          Deploy ultra-realistic, low-latency conversational agents powered by NVIDIA NIM and Pipecat. UMBRA doesn&apos;t just find leads—it calls them, pitches your offer, and books meetings on your calendar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Call Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-5 border border-white/5 bg-black/40">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-electric" /> Target Acquisition
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-1 block">Target Phone Number</label>
                <input 
                  type="text" 
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-electric font-mono transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-1 block">Campaign Context (System Prompt)</label>
                <textarea 
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white font-mono focus:outline-none focus:border-electric resize-none transition-all"
                />
              </div>

              <div className="pt-2">
                {callStatus === "idle" || callStatus === "completed" ? (
                  <button 
                    onClick={initiateCall}
                    disabled={!targetPhone}
                    className="w-full py-3 px-4 bg-white text-black font-bold rounded-lg hover:bg-electric transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                  >
                    <Play className="w-4 h-4 fill-current" /> Initialize Voice Swarm
                  </button>
                ) : (
                  <button 
                    onClick={endCall}
                    className="w-full py-3 px-4 bg-red-500/20 text-red-500 border border-red-500/30 font-bold rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Square className="w-4 h-4 fill-current" /> Terminate Connection
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-4 border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> System Status</h4>
            <div className="space-y-2 text-xs font-mono text-stone-400">
              <div className="flex justify-between"><span>NVIDIA NIM Endpoints:</span> <span className="text-emerald-400">ONLINE</span></div>
              <div className="flex justify-between"><span>Pipecat Framework:</span> <span className="text-emerald-400">ENGAGED</span></div>
              <div className="flex justify-between"><span>Latency Average:</span> <span className="text-electric">320ms</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Terminal / Visualizer / Pathway */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
           {/* Tab Switcher */}
           <div className="flex items-center gap-2">
              <button 
                 onClick={() => setActiveTab("execution")}
                 className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${activeTab === "execution" ? "bg-electric/20 text-electric border border-electric/50 shadow-[0_0_15px_rgba(0,255,255,0.2)]" : "bg-white/5 text-stone-500 border border-white/5 hover:text-white hover:bg-white/10"}`}
              >
                 <Activity className="w-3 h-3" /> Live Execution
              </button>
              <button 
                 onClick={() => setActiveTab("pathway")}
                 className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 ${activeTab === "pathway" ? "bg-electric/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "bg-white/5 text-stone-500 border border-white/5 hover:text-white hover:bg-white/10"}`}
              >
                 <Network className="w-3 h-3" /> Pathway Builder
              </button>
           </div>

           {activeTab === "execution" ? (
             <div className="relative flex-1 overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl min-h-[500px]">
               {/* Terminal Header */}
           <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between z-10">
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
              </div>
              <div className="text-[10px] text-stone-500 uppercase tracking-widest font-mono font-bold">UMBRA Voice Execution Environment</div>
           </div>

           <div className="pt-16 pb-8 px-8 h-[500px] flex flex-col justify-center items-center relative z-0">
              
              {callStatus === "idle" && (
                <div className="text-center opacity-30 flex flex-col items-center">
                  <Mic className="w-16 h-16 text-white mb-4" />
                  <p className="font-mono text-sm tracking-widest text-white uppercase">Awaiting Target</p>
                </div>
              )}

              {callStatus === "connecting" && (
                <div className="text-center flex flex-col items-center">
                  <Activity className="w-16 h-16 text-amber-400 mb-4 animate-pulse" />
                  <p className="font-mono text-sm tracking-widest text-amber-400 uppercase animate-pulse">Establishing NIM Socket Connection...</p>
                </div>
              )}

              {callStatus === "active" && (
                <div className="w-full flex items-center justify-between gap-8">
                   {/* AI Avatar */}
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-electric/20 border-2 border-electric flex items-center justify-center relative shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                        <div className="absolute inset-0 rounded-full border border-electric animate-ping opacity-20"></div>
                        <Volume2 className="w-8 h-8 text-electric" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-electric font-mono">UMBRA Agent</span>
                   </div>

                   {/* Visualizer Waves */}
                   <div className="flex-1 flex items-center justify-center gap-1 h-32">
                      {[...Array(20)].map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: ["10%", "100%", "10%"] }}
                          transition={{ duration: 0.5 + Math.abs(Math.sin(i * 10)) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
                          className="w-2 rounded-full bg-gradient-to-t from-electric to-emerald-400"
                        />
                      ))}
                   </div>

                   {/* Target Avatar */}
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
                        <Phone className="w-8 h-8 text-stone-400" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono">Prospect Line</span>
                   </div>
                </div>
              )}

              {callStatus === "completed" && (
                <div className="text-center flex flex-col items-center">
                  <Square className="w-16 h-16 text-stone-500 mb-4" />
                  <p className="font-mono text-sm tracking-widest text-white uppercase">Connection Terminated</p>
                  <p className="font-mono text-[10px] text-emerald-400 mt-2">Disposition: Meeting Booked.</p>
                </div>
              )}
           </div>

           {/* Transcript overlay at bottom */}
           {callStatus === "active" && (
             <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent p-6 flex flex-col justify-end">
                <p className="font-mono text-xs text-stone-400 mb-1">Live Transcript:</p>
                <p className="font-mono text-sm text-white border-l-2 border-electric pl-3">
                  <span className="text-electric font-bold">[UMBRA]</span> Hey, I noticed you were missing your Google Business profile and SEO tags. Do you have 60 seconds?
                </p>
             </div>
           )}
         </div>
       ) : (
         <div className="relative flex-1 rounded-xl shadow-2xl min-h-[500px]">
            <VoicePathwayBuilder />
         </div>
       )}
     </div>
      </div>
    </div>
  );
}

export default function VoiceAgentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-stone-400 text-xs uppercase font-mono tracking-widest animate-pulse">Initializing Voice Module...</div>}>
      <VoiceAgentClient />
    </Suspense>
  );
}
