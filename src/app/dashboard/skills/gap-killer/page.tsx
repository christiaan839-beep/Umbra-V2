"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CopySlash, Search, Zap, AlertCircle, FileText, Globe } from "lucide-react";

export default function GapKillerPage() {
  const [urls, setUrls] = useState(["", "", ""]);
  const [niche, setNiche] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = async () => {
    if (!urls[0] || !niche) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch("/api/skills/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "gap-killer", urls: urls.filter(u => u), niche })
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-glow/10 border border-rose-glow/20 text-rose-glow text-xs font-bold uppercase tracking-wider mb-3">
          <CopySlash className="w-3 h-3" /> Agentic Skill
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Competition Gap Killer</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Deploy an autonomous agent to scan competitor websites. Find missing content, keyword gaps, and trust signals. Automatically generate the exact 5 blog topics you need to steal their traffic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-sm font-bold text-white mb-4">Target Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Your Niche</label>
                <input 
                  type="text" 
                  value={niche}
                  onChange={e => setNiche(e.target.value)}
                  placeholder="e.g. AI Dental Marketing"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Competitor URLs</label>
                {urls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-text-secondary shrink-0" />
                    <input 
                      type="url" 
                      value={url}
                      onChange={e => {
                        const newUrls = [...urls];
                        newUrls[i] = e.target.value;
                        setUrls(newUrls);
                      }}
                      placeholder={`Competitor ${i + 1} URL`}
                      className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric transition-colors"
                    />
                  </div>
                ))}
              </div>

              <button 
                onClick={analyze}
                disabled={isAnalyzing || !niche || !urls[0]}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-electric to-rose-glow text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(45,110,255,0.3)] hover:shadow-[0_0_30px_rgba(45,110,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <><Zap className="w-4 h-4 animate-pulse" /> Scanning Websites...</>
                ) : (
                  <><Search className="w-4 h-4" /> Deploy Gap Killer</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {results ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              <div className="glass-card p-6 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-white">Vulnerabilities Found</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-onyx/40 p-4 rounded-xl border border-glass-border">
                    <span className="block text-xs text-text-secondary mb-1">Missing Content Gaps</span>
                    <ul className="text-sm text-white space-y-1 mt-2 list-disc pl-4">
                      {results.vulnerabilities?.content?.map((v: string, i: number) => <li key={i}>{v}</li>)}
                    </ul>
                  </div>
                  <div className="bg-onyx/40 p-4 rounded-xl border border-glass-border">
                    <span className="block text-xs text-text-secondary mb-1">Missing Trust Signals</span>
                    <ul className="text-sm text-white space-y-1 mt-2 list-disc pl-4">
                      {results.vulnerabilities?.trust?.map((v: string, i: number) => <li key={i}>{v}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 border-electric/20">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5 text-electric" />
                  <h3 className="text-lg font-bold text-white">5 High-Impact Attack Topics</h3>
                </div>
                <div className="space-y-4">
                  {results.topics?.map((topic: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-glass-border bg-black/20 hover:border-electric/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-white mb-1"><span className="text-electric mr-2">{i+1}.</span> {topic.title}</h4>
                          <p className="text-sm text-text-secondary mb-3">{topic.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                              Low Competition
                            </span>
                            <span className="text-rose-glow">Intent: {topic.intent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] glass-card flex flex-col items-center justify-center text-center p-8 border border-glass-border border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-onyx/50 border border-glass-border flex items-center justify-center mb-4">
                <CopySlash className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Analysis Engine Idle</h3>
              <p className="text-sm text-text-secondary max-w-sm">
                Enter your competitor targets to initialize the live scanning protocol and generate the attack vector.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
