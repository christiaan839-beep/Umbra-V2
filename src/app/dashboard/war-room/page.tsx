"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Brain, Zap, Terminal, ShieldAlert, CheckCircle2, Play } from "lucide-react";

export default function WarRoomColosseum() {
  const [topic, setTopic] = useState("Cold Outreach Campaign for B2B SaaS");
  const [status, setStatus] = useState<"idle" | "debating" | "consensus">("idle");
  const [messages, setMessages] = useState<Array<{ agent: "DeepSeek" | "Llama"; text: string }>>([]);

  const startDebate = () => {
    setStatus("debating");
    setMessages([]);

    const debateScript = [
      {
        agent: "DeepSeek",
        text: "STRATEGY: We must target Series A SaaS founders using a purely logic-based approach. The hook should leverage their burn rate, offering our AI integration as an operational cost-cutter. We should not use flashy sales copy. Direct math wins."
      },
      {
        agent: "Llama",
        text: "RED TEAM: Flawed premise. Series A founders are actively spending to acquire growth, not just cut costs. If we pitch pure cost-cutting, we sound like an accounting tool, not a growth engine. We must position the AI integration as a revenue multiplier that bypasses the need for bloated sales teams."
      },
      {
         agent: "DeepSeek",
         text: "REVISION: Conceded. Cost-cutting is a secondary benefit. The primary vector will be top-line revenue generation without head-count scaling. I propose the following subject line: 'Scaling outbound without the SDR headcount bloat by Q3'."
      },
      {
         agent: "Llama",
         text: "RED TEAM: That subject line is generic and lacks urgency. Q3 is too far away. Revised subject line: 'Replace your next 3 SDR hires with an AI swarm (Available to deploy Tuesday)'."
      },
      {
         agent: "DeepSeek",
         text: "CONSENSUS: The revised subject line hits emotional urgency, specifies the mechanism (AI swarm), and provides a concrete timeline. We will route this finalized framework to the n8n outbound orchestrator."
      }
    ];

    let delay = 0;
    debateScript.forEach((msg, idx) => {
      delay += 2500;
      setTimeout(() => {
        setMessages(prev => [...prev, msg as { agent: "DeepSeek" | "Llama"; text: string }]);
        if (idx === debateScript.length - 1) {
          setTimeout(() => setStatus("consensus"), 1000);
        }
      }, delay);
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Swords className="w-3 h-3" /> Multi-Agent Colosseum
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
          The Strategy War Room
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Deploy DeepSeek-R1 (Master Strategist) against Llama-3.3-70B (Red Team Challenger). They will autonomously debate your topic, identify flaws in logic, and reach an optimal, battle-tested consensus before running the campaign.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Setup */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" /> War Room Directive
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">Campaign / Topic Directive</label>
                  <textarea 
                    rows={4}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-indigo-500/50 outline-none"
                    placeholder="E.g., Design a LinkedIn outreach sequence for high-ticket closing..."
                  />
               </div>
            </div>

            <button 
              onClick={startDebate}
              disabled={status === "debating" || !topic}
              className="w-full mt-6 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
              <Swords className="w-4 h-4" /> Initiate Debate Sequence
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* DeepSeek Indicator */}
             <div className={`rounded-2xl border p-4 text-center transition-all ${status === 'debating' && messages.length % 2 === 0 ? 'border-[#00B7FF]/50 bg-[#00B7FF]/10 shadow-[0_0_15px_rgba(0,183,255,0.2)]' : 'border-white/10 bg-white/[0.02]'}`}>
                <Brain className={`w-8 h-8 mx-auto mb-2 ${status === 'debating' && messages.length % 2 === 0 ? 'text-[#00B7FF] animate-pulse' : 'text-neutral-500'}`} />
                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-1">DeepSeek-R1</h4>
                <p className="text-[9px] text-[#00B7FF]/70 font-mono uppercase">Master Strategist</p>
             </div>

             {/* Llama Indicator */}
             <div className={`rounded-2xl border p-4 text-center transition-all ${status === 'debating' && messages.length % 2 === 1 ? 'border-rose-500/50 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.2)]' : 'border-white/10 bg-white/[0.02]'}`}>
                <Zap className={`w-8 h-8 mx-auto mb-2 ${status === 'debating' && messages.length % 2 === 1 ? 'text-rose-400 animate-pulse' : 'text-neutral-500'}`} />
                <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-1">Llama 3.3 70B</h4>
                <p className="text-[9px] text-rose-400/70 font-mono uppercase">Red Team Challenger</p>
             </div>
          </div>
        </div>

        {/* Right Col: The Debate Stream */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[500px] flex flex-col rounded-2xl bg-black border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.05)]">
               <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-mono text-indigo-400/80 tracking-widest uppercase">Live Dual-Stream Telemetry</span>
                  </div>
                  {status === "debating" && (
                     <div className="flex items-center gap-2 text-[9px] text-red-400 font-mono focus:outline-none uppercase tracking-widest font-bold">
                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Live Debate
                     </div>
                  )}
                  {status === "consensus" && (
                    <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-mono focus:outline-none uppercase tracking-widest font-bold">
                       <CheckCircle2 className="w-3 h-3" /> Consensus Reached
                    </div>
                  )}
               </div>

               <div className="p-6 flex-1 overflow-y-auto space-y-6 custom-scrollbar bg-[url('/noise.png')] bg-repeat opacity-95">
                  {messages.length === 0 && status === "idle" && (
                    <div className="h-full flex items-center justify-center text-center">
                       <p className="text-neutral-600 font-mono text-xs uppercase tracking-widest">
                         Awaiting Topic Directive...<br/><br/>
                         DeepSeek will generate primary logic.<br/>
                         Llama will attack vulnerabilities.<br/>
                         Consensus output routes to automation pipeline.
                       </p>
                    </div>
                  )}

                  <AnimatePresence>
                     {messages.map((msg, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-4 ${msg.agent === "Llama" ? "flex-row-reverse" : "flex-row"}`}
                        >
                           <div className="flex-shrink-0">
                             {msg.agent === "DeepSeek" ? (
                               <div className="w-10 h-10 rounded-xl bg-[#00B7FF]/10 border border-[#00B7FF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,183,255,0.2)]">
                                  <Brain className="w-5 h-5 text-[#00B7FF]" />
                               </div>
                             ) : (
                               <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                  <Zap className="w-5 h-5 text-rose-400" />
                               </div>
                             )}
                           </div>
                           
                           <div className={`max-w-[80%] rounded-xl p-4 border ${
                             msg.agent === "DeepSeek" 
                               ? msg.text.startsWith("CONSENSUS:") 
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                  : "bg-[#00B7FF]/5 border-[#00B7FF]/20 text-blue-100" 
                               : "bg-rose-500/5 border-rose-500/20 text-rose-100"
                           }`}>
                              <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${
                                msg.agent === "DeepSeek" 
                                   ? msg.text.startsWith("CONSENSUS:") ? "text-emerald-400" : "text-[#00B7FF]"
                                   : "text-rose-400"
                              }`}>
                                {msg.agent === "DeepSeek" 
                                  ? msg.text.startsWith("CONSENSUS:") ? "DeepSeek (Consensus Protocol)" : "DeepSeek (Master Strategist)" 
                                  : "Llama 3.3 (Red Team Challenge)"}
                              </span>
                              <p className="text-sm leading-relaxed font-mono whitespace-pre-wrap">{msg.text}</p>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>

                  {status === "consensus" && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8">
                       <button className="w-full py-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 flex items-center justify-center gap-3 font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                         <Play className="w-5 h-5" /> Execute Consensus via n8n
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
