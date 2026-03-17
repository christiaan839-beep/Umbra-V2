"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Network, Upload, FileText, Link as LinkIcon, Download, Trash2, ShieldCheck, Database, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useUsage } from "@/hooks/useUsage";

type KnowledgeSource = {
  id: string;
  type: "pdf" | "url" | "text";
  name: string;
  tokens: number;
  status: "active" | "processing" | "failed";
  addedAt: string;
};

export default function KnowledgeBasePage() {
  const { canGenerate } = useUsage();
  const [sources, setSources] = useState<KnowledgeSource[]>([
    { id: "1", type: "pdf", name: "High-Ticket SEO Sales Script.pdf", tokens: 4200, status: "active", addedAt: "10 mins ago" },
    { id: "2", type: "url", name: "https://umbra.io/objection-handling", tokens: 1850, status: "active", addedAt: "1 hr ago" },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  
  const handleFileUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setSources([{
        id: Date.now().toString(),
        type: "pdf",
        name: "Agency_Onboarding_SOP_V3.pdf",
        tokens: 8540,
        status: "active",
        addedAt: "Just now"
      }, ...sources]);
      setIsUploading(false);
    }, 2000);
  };

  const handleUrlAdd = () => {
    if (!urlInput) return;
    setIsUploading(true);
    setTimeout(() => {
      setSources([{
        id: Date.now().toString(),
        type: "url",
        name: urlInput,
        tokens: 3200,
        status: "active",
        addedAt: "Just now"
      }, ...sources]);
      setUrlInput("");
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Database className="w-3 h-3" /> Vertex AI Vector Store
          </div>
          <h1 className="text-3xl font-bold serif-text text-white">The God-Brain</h1>
          <p className="text-sm text-stone-400 mt-2 max-w-2xl">
            Upload your proprietary agency SOPs, sales transcripts, and playbooks. UMBRA's Voice and Page Builder nodes automatically ground their execution against this private knowledge base.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-black/50 border border-white/10 rounded-xl flex flex-col items-end">
             <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Total Vector Tokens</span>
             <span className="text-lg font-mono text-electric">{sources.reduce((sum, s) => sum + s.tokens, 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input Vectors */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-5 border border-white/5 bg-black/40">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" /> Ingest Knowledge
            </h3>
            
            <div className="space-y-4">
              {/* PDF Upload */}
              <div 
                onClick={handleFileUpload}
                className="border-2 border-dashed border-white/10 hover:border-indigo-400/50 hover:bg-indigo-400/5 rounded-xl p-6 text-center cursor-pointer transition-all group"
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                ) : (
                  <FileText className="w-8 h-8 text-stone-600 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
                )}
                <p className="text-sm text-white font-medium">Upload PDF Document</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">SOPs, Playbooks, Transcripts</p>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-mono text-stone-600 uppercase">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* URL Ingest */}
              <div>
                <label className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mb-2 block">Crawl Website URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input 
                      type="url" 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://your-agency.com/sops"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-indigo-400 font-mono transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleUrlAdd}
                    disabled={!urlInput || isUploading}
                    className="px-4 bg-white/10 hover:bg-indigo-500/20 text-white rounded-lg transition-colors disabled:opacity-50 border border-white/10 hover:border-indigo-500/30"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Enterprise Secure</h4>
            <p className="text-xs text-stone-400 font-mono leading-relaxed">
              UMBRA utilizes Google Cloud Vertex AI Vector Search. Your uploaded proprietary data is encrypted at rest and in transit. <span className="text-white">It is NEVER used to train Google's public models.</span>
            </p>
          </div>
        </div>

        {/* Right Column: Database View */}
        <div className="lg:col-span-2">
          <div className="glass-card border border-white/10 bg-black overflow-hidden h-full min-h-[500px] flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-electric" /> Active Neuro-Vectors
              </h3>
              <span className="text-[10px] font-mono text-stone-500 border border-white/10 px-2 py-0.5 rounded-md">STATUS: OPTIMAL</span>
            </div>

            <div className="flex-1 p-0 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-stone-500 bg-black/40">
                    <th className="font-medium p-4 pl-6">Source Node</th>
                    <th className="font-medium p-4">Vector Volume</th>
                    <th className="font-medium p-4">Ingestion Time</th>
                    <th className="font-medium p-4 text-right pr-6">Commands</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sources.map((source, i) => (
                    <motion.tr 
                      key={source.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${source.type === 'pdf' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                            {source.type === 'pdf' ? <FileText className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium max-w-[200px] sm:max-w-xs truncate">{source.name}</p>
                            <p className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Vectorized Active
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-stone-400 font-mono bg-white/5 px-2 py-1 rounded-md border border-white/10">
                          {source.tokens.toLocaleString()} tkns
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-stone-500 font-mono">{source.addedAt}</span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-md transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setSources(sources.filter(s => s.id !== source.id))}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  
                  {sources.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-stone-500 text-sm font-mono">
                        No vector sources found. The God-Brain is starving.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
