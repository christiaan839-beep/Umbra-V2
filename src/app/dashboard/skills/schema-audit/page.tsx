"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Search, Zap, AlertCircle, CheckCircle2, Copy } from "lucide-react";

export default function SchemaAuditPage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch("/api/skills/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "schema-audit", url })
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Code2 className="w-3 h-3" /> Agentic Skill
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Full Schema Technical Audit</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Instantly scan a prospect's website source code to evaluate their LocalBusiness structured data. Generates clean JSON-LD for missing elements—the definitive value-add for cold outreach.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-sm font-bold text-white mb-4">Target Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Prospect Website URL</label>
                <input 
                  type="url" 
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://prospect-site.com"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <button 
                onClick={analyze}
                disabled={isAnalyzing || !url}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <><Zap className="w-4 h-4 animate-pulse" /> Auditing Source Code...</>
                ) : (
                  <><Search className="w-4 h-4" /> Run Schema Audit</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {results ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               
               <div className="grid grid-cols-2 gap-4">
                 {/* Verdict Card */}
                <div className={`p-6 rounded-2xl border ${
                  results.verdict === 'useful' ? 'bg-emerald-500/5 border-emerald-500/20' : 
                  results.verdict === 'weak' ? 'bg-amber-500/5 border-amber-500/20' : 
                  'bg-rose-500/5 border-rose-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {results.verdict === 'useful' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : 
                     results.verdict === 'weak' ? <AlertCircle className="w-5 h-5 text-amber-500" /> :
                     <AlertCircle className="w-5 h-5 text-rose-500" />}
                    <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Audit Verdict</h3>
                  </div>
                  <p className={`text-3xl font-bold capitalize ${
                    results.verdict === 'useful' ? 'text-emerald-500' : 
                    results.verdict === 'weak' ? 'text-amber-500' : 
                    'text-rose-500'
                  }`}>
                    {results.verdict}
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    {results.summary}
                  </p>
                </div>

                {/* Missing Elements */}
                <div className="glass-card p-6 border-glass-border">
                  <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Missing Schema Priorities</h3>
                  <div className="space-y-3">
                    {results.missing?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-white">{item.element}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          item.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-onyx text-text-secondary border border-glass-border'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
               </div>

              {/* Generated Code Panel */}
              {results.generatedCode && (
                <div className="glass-card p-0 border-glass-border overflow-hidden">
                  <div className="flex items-center justify-between bg-onyx/80 px-4 py-3 border-b border-glass-border">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white">Generated JSON-LD (Ready to Deploy)</h3>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(results.generatedCode)}
                      className="text-xs font-bold text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3 h-3" /> Copy Code
                    </button>
                  </div>
                  <div className="p-4 bg-black/50 overflow-x-auto">
                    <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                      {results.generatedCode}
                    </pre>
                  </div>
                </div>
              )}

            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] glass-card flex flex-col items-center justify-center text-center p-8 border border-glass-border border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-onyx/50 border border-glass-border flex items-center justify-center mb-4">
                <Code2 className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Technical Engine Offline</h3>
              <p className="text-sm text-text-secondary max-w-sm">
                Enter a prospect's URL to deploy the schema auditor. The AI will physically scan their page source and generate the missing code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
