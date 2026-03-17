"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Database, Layers, FileText, Target } from "lucide-react";

export default function OmniSearchPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "searching" | "complete">("idle");

  const startSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setStatus("searching");
    setTimeout(() => {
      setStatus("complete");
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen bg-[#050505] text-white">
      <div className="text-center mb-12 mt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Database className="w-3 h-3" /> Omni-Search RAG Architecture
        </div>
        <h1 className="text-4xl font-bold font-sans tracking-tight mb-4">
          Global Knowledge Retrieval
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
          Powered by NVIDIA Nemotron Embedding & Rerank NIMs. Instantly search across your entire CRM, Lead Databases, Uploaded PDFs, and Telemetry Logs.
        </p>
      </div>

      <form onSubmit={startSearch} className="relative max-w-3xl mx-auto mb-16">
         <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className={`w-6 h-6 ${status === 'searching' ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
         </div>
         <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={status === "searching"}
            placeholder="E.g., What objections did the Roofing lead in Austin have last week?"
            className="w-full bg-black/80 border border-white/10 rounded-2xl pl-16 pr-6 py-6 text-lg text-white focus:border-emerald-500/50 outline-none shadow-[0_0_50px_rgba(16,185,129,0.05)] transition-all font-mono placeholder:font-sans placeholder:text-neutral-600"
         />
         <button type="submit" className="hidden" />
      </form>

      {status === "complete" && query && (
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Neural Rerank Results
            </h3>
            
            <div className="space-y-4">
               {/* Synthesized Answer */}
               <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Synthesized Answer (DeepSeek-R1)</h4>
                 <p className="text-sm leading-relaxed text-emerald-50">
                   Based on the Voice Swarm transcripts from October 12th, the lead &quot;Austin Elite Roofing&quot; objected primarily to the implementation timeline. They expressed concern that an AI swarm deployment would disrupt their current Q4 sales motion. They requested a phased rollout starting with Lead Qualification before moving to full Autonomous Outbound.
                 </p>
               </div>

               {/* Source References */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                     <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-xs font-bold text-white">Transcript_101224.txt</span>
                     </div>
                     <p className="text-[10px] text-neutral-500 font-mono">Similarity Score: 0.982</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                     <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-xs font-bold text-white">Lead_Austin_Elite_CRM_Card</span>
                     </div>
                     <p className="text-[10px] text-neutral-500 font-mono">Similarity Score: 0.854</p>
                  </div>
               </div>
            </div>
         </motion.div>
      )}
    </div>
  );
}
