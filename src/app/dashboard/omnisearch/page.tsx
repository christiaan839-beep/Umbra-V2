"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Search, Upload, Play, FileText, Image as ImageIcon, Volume2, Database, Zap, Activity } from 'lucide-react';

export default function OmnisearchTerminal() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSearching(true);
    setResults([]);

    // Simulate pinging the Gemini Multimodal Embeddings 2.0 API & Pinecone
    setTimeout(() => {
      setResults([
        {
          id: 'vec_9482',
          type: 'video',
          title: 'Competitor_Ad_Hook_Variant_B.mp4',
          match: '98.4%',
          snippet: '[00:00 - 00:05] Fast-paced B2B SaaS hook with aggressive text overlay.',
          icon: Play,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10'
        },
        {
          id: 'vec_1102',
          type: 'audio',
          title: 'High_Ticket_Sales_Call_Objection.wav',
          match: '92.1%',
          snippet: '[14:22] Handling the "too expensive" psychological objection using the UMBRA framework.',
          icon: Volume2,
          color: 'text-amber-400',
          bg: 'bg-amber-500/10'
        },
        {
          id: 'vec_7731',
          type: 'pdf',
          title: 'Elite_Agency_Pitch_Deck_2025.pdf',
          match: '88.7%',
          snippet: 'Page 12: Conversion architecture and psychological color theory breakdowns.',
          icon: FileText,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10'
        }
      ]);
      setIsSearching(false);
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-8 md:p-12 font-sans text-neutral-200">
      
      {/* Header */}
      <div className="mb-12 border-b border-neutral-800/50 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            animate={{ boxShadow: ['0 0 0px #8b5cf6', '0 0 20px #8b5cf6', '0 0 0px #8b5cf6'] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-10 h-10 rounded border border-violet-500/30 flex items-center justify-center bg-violet-500/10"
          >
            <BrainCircuit className="w-5 h-5 text-violet-400" />
          </motion.div>
          <h1 className="text-3xl font-light tracking-tight text-white">Omniscient Neural Memory</h1>
        </div>
        <p className="text-neutral-500 max-w-3xl tracking-wide">
          Powered by Gemini Multimodal Embeddings 2.0. Ingest, vector-embed, and retrieve competitor videos, audio, PDFs, and images within a single unified RAG vector space spanning up to 120 seconds of raw continuous media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Search Matrix */}
        <div className="lg:col-span-3 space-y-6">
          
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-neutral-500 group-focus-within:text-violet-400 transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the God-Brain's multi-dimensional memory lake... (e.g., 'Aggressive B2B SaaS video hook')"
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500/50 focus:bg-neutral-900 transition-all font-mono text-sm"
            />
            <button 
               type="submit"
               disabled={isSearching || !query}
               className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-500 text-white px-6 rounded-lg font-bold text-xs tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              RETRIEVE
            </button>
          </form>

          {/* Results Area */}
          <div className="bg-neutral-900/30 border border-neutral-800/60 rounded-xl min-h-[400px] p-6 backdrop-blur-md relative overflow-hidden">
             
             {isSearching ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-violet-400 z-10 bg-[#050505]/80 backdrop-blur-sm">
                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, ease: "linear", repeat: Infinity }}>
                   <Activity className="w-12 h-12 mb-4 opacity-50" />
                 </motion.div>
                 <p className="font-mono text-xs tracking-widest uppercase animate-pulse">Scanning 8,192-dimensional vector space...</p>
                 <p className="text-[10px] text-neutral-500 mt-2 font-mono">Cross-referencing video, audio, and PDF embeddings.</p>
               </div>
             ) : results.length > 0 ? (
               <div className="space-y-4">
                 <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4 font-mono">Top Semantic Matches (Cosine Similarity)</h3>
                 <AnimatePresence>
                   {results.map((result, i) => (
                     <motion.div 
                       key={result.id}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="flex items-start gap-4 p-4 bg-neutral-800/40 border border-neutral-800 rounded-lg group hover:border-violet-500/30 transition-colors cursor-pointer"
                     >
                       <div className={`p-3 rounded-lg ${result.bg} border border-neutral-800 group-hover:border-violet-500/20 transition-colors`}>
                         <result.icon className={`w-5 h-5 ${result.color}`} />
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                           <h4 className="text-white font-medium text-sm flex items-center gap-2">
                             {result.title}
                             <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 uppercase tracking-widest font-mono border border-neutral-700">
                               {result.type}
                             </span>
                           </h4>
                           <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">
                             {result.match} Match
                           </span>
                         </div>
                         <p className="text-sm text-neutral-400 mb-2">{result.snippet}</p>
                         <div className="text-[10px] text-neutral-600 font-mono flex items-center gap-4">
                           <span className="flex items-center gap-1"><Database className="w-3 h-3" /> Vector ID: {result.id}</span>
                           <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Embed Dims: 768</span>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-neutral-600">
                 <Database className="w-16 h-16 mb-4 opacity-20" />
                 <p className="font-mono text-sm">Vector Data Lake Ideled.</p>
                 <p className="text-xs text-neutral-700 mt-2">Awaiting multimodal query input.</p>
               </div>
             )}
          </div>

        </div>

        {/* Right Sidebar: Ingestion Status */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-xl p-6 backdrop-blur-md">
            <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-400" />
              Live Ingestion Node
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center bg-black/50 p-3 rounded border border-neutral-800">
                <span className="text-neutral-400 flex items-center gap-2"><Play className="w-4 h-4 text-rose-400" /> Videos</span>
                <span className="text-white">12,402</span>
              </div>
              <div className="flex justify-between items-center bg-black/50 p-3 rounded border border-neutral-800">
                <span className="text-neutral-400 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-sky-400" /> Images</span>
                <span className="text-white">84,191</span>
              </div>
              <div className="flex justify-between items-center bg-black/50 p-3 rounded border border-neutral-800">
                <span className="text-neutral-400 flex items-center gap-2"><Volume2 className="w-4 h-4 text-amber-400" /> Audio</span>
                <span className="text-white">3,892</span>
              </div>
              <div className="flex justify-between items-center bg-black/50 p-3 rounded border border-neutral-800">
                <span className="text-neutral-400 flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-400" /> PDFs</span>
                <span className="text-white">1,024</span>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800">
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-sans font-bold">Vector Database Status</p>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  Pinecone Cluster Online
                </div>
              </div>
            </div>
           </div>
        </div>

      </div>
    </div>
  );
}
