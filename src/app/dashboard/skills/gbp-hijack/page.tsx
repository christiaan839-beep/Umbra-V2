"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Zap, CheckCircle2, Copy } from "lucide-react";
import PdfExportButton from "@/components/ui/PdfExportButton";

export default function GBPHijackPage() {
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [city, setCity] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = async () => {
    if (!competitorUrl || !city) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch("/api/skills/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: "gbp-hijack", competitorUrl, city })
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
    // In a real app, show a toast notification here
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
          <MapPin className="w-3 h-3" /> Agentic Skill
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">GBP Map Pack Hijack</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Analyze competitor Google Business Profile strategies to identify their keyword gaps. Automatically generate 10 high-converting, urgency-driven local posts tailored for your city.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-sm font-bold text-white mb-4">Target Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Competitor URL / Name</label>
                <input 
                  type="text" 
                  value={competitorUrl}
                  onChange={e => setCompetitorUrl(e.target.value)}
                  placeholder="e.g. competitor.com"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target City</label>
                <input 
                  type="text" 
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Austin, TX"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-electric transition-colors"
                />
              </div>

              <button 
                onClick={analyze}
                disabled={isAnalyzing || !competitorUrl || !city}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-electric to-rose-glow text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(45,110,255,0.3)] hover:shadow-[0_0_30px_rgba(45,110,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <><Zap className="w-4 h-4 animate-pulse" /> Hijacking Profile...</>
                ) : (
                  <><Search className="w-4 h-4" /> Deploy GBP Hijack</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {results ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" id="report-content">
              
              <div className="flex justify-end mb-4 print:hidden">
                <PdfExportButton fileName={`GBP_Hijack_${city.replace(/\W+/g, "_") || "Report"}`} />
              </div>

              <div className="glass-card p-6 border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Competitor Weaknesses Exploited</h3>
                </div>
                <div className="text-sm text-text-secondary">
                  <p className="mb-2"><strong className="text-white">What they aren't doing:</strong> {results.competitorWeakness}</p>
                  <p><strong className="text-white">Our Angle:</strong> {results.ourAngle}</p>
                </div>
              </div>

              <div className="glass-card p-6 border-electric/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-electric" /> 
                    Ready-to-Deploy Local Posts
                  </h3>
                  <span className="text-xs text-text-secondary bg-onyx/50 px-2 py-1 rounded-md border border-glass-border">
                    10 Posts Generated
                  </span>
                </div>
                
                <div className="space-y-4">
                  {results.posts?.map((post: any, i: number) => (
                    <div key={i} className="p-5 rounded-xl border border-glass-border bg-black/20 group hover:border-electric/30 transition-colors relative">
                      <button 
                        onClick={() => copyToClipboard(post.content)}
                        className="absolute top-4 right-4 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-electric/10 text-electric text-xs font-bold border border-electric/20">
                          {i + 1}
                        </span>
                        <div className="flex gap-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                            CTA: {post.ctaType}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-rose-glow bg-rose-glow/10 px-2 py-0.5 rounded border border-rose-glow/20">
                            Landmark: {post.landmark}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-white leading-relaxed whitespace-pre-wrap font-medium">
                        {post.content}
                      </p>
                      
                      <div className="mt-3 pt-3 border-t border-glass-border/50 text-[11px] text-text-secondary flex gap-4">
                        <span className="text-electric">Keyword Focus: {post.keyword}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          ) : (
             <div className="h-full min-h-[400px] glass-card flex flex-col items-center justify-center text-center p-8 border border-glass-border border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-onyx/50 border border-glass-border flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Awaiting Target</h3>
              <p className="text-sm text-text-secondary max-w-sm">
                Provide a competitor and your city to unleash the AI. It will analyze their strategy and generate superior localized posts to hijack the map pack.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
