"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Search, Play, Volume2, DatabaseZap, Clock, ArrowRight, Zap, Target, FileText } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'video' | 'audio' | 'document';
  title: string;
  relevance: number;
  timestamp?: string; // e.g., "01:24" where the exact phrase was said
  excerpt: string;
}

export default function OmnisearchDashboard() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setResults(null);

    // Simulate calling the Pinecone Vector DB with Gemini Multimodal Embeddings
    setTimeout(() => {
      setResults([
        {
          id: 'vid_994a8x',
          type: 'video',
          title: 'Meta Ad A - "Stop Biohacking" Hook',
          relevance: 98.4,
          timestamp: '00:04',
          excerpt: "...because 99% of what you are doing is literally destroying your baseline dopamine. Here is what we found in the biometric data..."
        },
        {
          id: 'aud_112z',
          type: 'audio',
          title: 'Closing Call - High Ticket Prospect (Dr. Evans)',
          relevance: 92.1,
          timestamp: '14:22',
          excerpt: "...exactly. And when you bypass the standard digestive limits using our protocol, the cognitive ROI is immediate. That's why the $5k retainer is..."
        },
        {
          id: 'doc_55x',
          type: 'document',
          title: 'Phase 2: The Sleep Optimization Protocol',
          relevance: 84.7,
          excerpt: "Implementing strict chromatic light filtering at 19:00 leads to a 2.4x median decrease in sleep latency across our executive cohort."
        }
      ]);
      setIsSearching(false);
    }, 2800);
  };

  return (
    <div className="flex-1 p-8 space-y-8 relative overflow-hidden bg-black/40 backdrop-blur-3xl min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-[#00B7FF]" />
            Omniscient Memory Retrieval
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[#00B7FF]/70">
            Gemini 2.0 Multimodal Vector Database
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Nodes Connected</span>
           </div>
           <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 flex items-center gap-2">
              <DatabaseZap className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[10px] font-mono tracking-widest text-neutral-400">14,392 Vectors</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="col-span-1 lg:col-span-2 space-y-8">
            {/* The Search Terminal */}
            <div className="bg-black/40 border border-[#00B7FF]/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,183,255,0.05)] backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <BrainCircuit className="w-32 h-32 text-[#00B7FF]" />
               </div>
               
               <form onSubmit={handleSearch} className="relative z-10">
                 <label className="block text-xs font-medium text-neutral-500 mb-4 uppercase tracking-wide">Enter Natural Language Query</label>
                 <div className="relative group">
                    <Search className="absolute left-4 top-4 w-5 h-5 text-neutral-500 group-focus-within:text-[#00B7FF] transition-colors" />
                    <input 
                      type="text"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00B7FF]/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 transition-all outline-none font-mono text-sm"
                      placeholder="e.g., 'Find the exact moment I explained the $5k offer on a sales call last week'"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                 </div>
                 <div className="mt-4 flex justify-between items-center">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#00B7FF]" /> Cross-modal search enabled (Video, Audio, Docs)
                    </p>
                    <button 
                      type="submit"
                      disabled={isSearching}
                      className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-[#00B7FF] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? 'Querying God-Brain...' : 'Extract Context'}
                    </button>
                 </div>
               </form>
            </div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
               {isSearching && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="w-full h-48 border border-dashed border-[#00B7FF]/30 rounded-2xl flex flex-col items-center justify-center space-y-4"
                 >
                    <div className="relative w-12 h-12 flex items-center justify-center">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                         className="absolute inset-0 rounded-full border border-dashed border-[#00B7FF]/50"
                       />
                       <DatabaseZap className="w-5 h-5 text-[#00B7FF] animate-pulse" />
                    </div>
                    <span className="text-xs font-mono text-[#00B7FF] uppercase tracking-widest">Traversing Latent Space...</span>
                 </motion.div>
               )}

               {results && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="space-y-4 text-left"
                 >
                    <h3 className="text-xs font-bold text-neutral-400 tracking-widest uppercase mb-4">Extracted Nodes ({results.length})</h3>
                    
                    {results.map((result, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={result.id}
                        className="bg-black/30 border border-white/5 p-5 rounded-xl hover:border-[#00B7FF]/30 transition-colors group relative"
                      >
                         <div className="absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs text-[#00B7FF] uppercase font-bold tracking-widest flex items-center gap-1">
                              Access Node <ArrowRight className="w-3 h-3" />
                            </button>
                         </div>

                         <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${
                              result.type === 'video' ? 'bg-rose-500/10 text-rose-500' :
                              result.type === 'audio' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-indigo-500/10 text-indigo-500'
                            }`}>
                               {result.type === 'video' && <Play className="w-5 h-5" />}
                               {result.type === 'audio' && <Volume2 className="w-5 h-5" />}
                               {result.type === 'document' && <FileText className="w-5 h-5" />}
                            </div>
                            
                            <div className="space-y-2 pr-24">
                               <div className="flex items-center gap-3">
                                  <h4 className="text-sm font-semibold text-white">{result.title}</h4>
                                  <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest bg-emerald-500/10 text-emerald-500">
                                    {(result.relevance).toFixed(1)}% MATCH
                                  </span>
                               </div>
                               
                               <div className="bg-black/50 p-3 rounded-lg border border-white/5 relative mt-3">
                                  {result.timestamp && (
                                    <span className="absolute -top-2.5 right-3 bg-[#0A0A0A] px-2 text-[10px] font-mono text-neutral-400 border border-white/10 rounded">
                                      <Clock className="inline w-3 h-3 mr-1" />{result.timestamp}
                                    </span>
                                  )}
                                  <p className="text-sm text-neutral-300 italic font-serif opacity-80 leading-relaxed">
                                    "{result.excerpt}"
                                  </p>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Sidebar Stats */}
         <div className="col-span-1 space-y-6">
            <div className="bg-black/30 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5C667A] mb-6">Cluster Statistics</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm text-neutral-400">Audio Memos Embedded</span>
                      <span className="text-white font-mono">1,402</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-white/5">
                      <span className="text-sm text-neutral-400">Video Ads Ingested</span>
                      <span className="text-white font-mono">344</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">Protocol Documents</span>
                      <span className="text-white font-mono">82</span>
                   </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-[#00B7FF]/10 to-transparent border border-[#00B7FF]/20 rounded-2xl p-6 relative overflow-hidden">
               <Target className="absolute top-0 right-0 w-24 h-24 text-[#00B7FF] opacity-10 -mr-6 -mt-6" />
               <h3 className="text-sm font-bold text-white mb-2 relative z-10">Strategic Advantage</h3>
               <p className="text-xs text-[#00B7FF]/80 leading-relaxed relative z-10">
                 Standard LLMs cannot watch video or listen to audio calls. UMBRA utilizes Gemini's native multimodal capabilities to encode the literal pixels and soundwaves of your high-converting assets into semantic space.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
