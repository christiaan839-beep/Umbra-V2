"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Search, ArrowRight, Skull, ShieldAlert, Copy, CheckCircle2, Loader2, Cpu } from "lucide-react";

interface HijackResult {
  competitor_analysis: {
    their_core_claim: string;
    their_fatal_flaw: string;
    estimated_price: string;
  };
  the_attack_vector: {
    objection_handling: string;
    the_wedge: string;
  };
  counter_copy: {
    ad_hook: string;
    email_subject: string;
    email_body: string;
  };
}

export default function FunnelHackerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HijackResult | null>(null);
  const [error, setError] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleHijack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/swarm/funnel-hijack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to hijack funnel");

      setResult(data.hijack_data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const CopyButton = ({ text }: { text: string }) => (
    <button
      onClick={() => copyToClipboard(text)}
      className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
      title="Copy to clipboard"
    >
      {copiedText === text ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-glow/10 border border-rose-glow/20 text-rose-glow text-xs font-bold uppercase tracking-wider mb-4">
          <Skull className="w-3.5 h-3.5" /> Agency Decimation Engine
        </div>
        <h1 className="text-3xl font-bold font-serif text-white mb-2">Funnel Hijacker</h1>
        <p className="text-text-secondary">
          Paste a competitor's URL. UMBRA will scrape their site, extract their pricing, and generate a lethal counter-campaign to steal their market share.
        </p>
      </div>

      <form onSubmit={handleHijack} className="relative mb-12">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-secondary" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://competitor-agency.com"
          className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl py-4 pl-12 pr-36 text-white placeholder-text-secondary focus:outline-none focus:border-electric/50 focus:ring-1 focus:ring-electric/50 transition-all font-mono"
          required
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="absolute right-2 top-2 bottom-2 px-6 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 text-midnight animate-spin" /> Hijacking...</>
          ) : (
             <>Destroy <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-200">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
            <div className="absolute inset-0 border-4 border-rose-glow rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Cpu className="w-6 h-6 text-rose-glow" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Scraping Funnel...</h3>
          <p className="text-text-secondary text-sm animate-pulse">Running advanced heuristics and deploying counter-measures.</p>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Phase 1: The Anatomy */}
            <div className="glass-card p-6 border border-white/10 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Target className="w-32 h-32" />
               </div>
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
                 Competitor Anatomy
               </h3>
               
               <div className="grid md:grid-cols-3 gap-6">
                 <div>
                   <p className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-bold">Their Core Promise</p>
                   <p className="text-sm text-white leading-relaxed">{result.competitor_analysis.their_core_claim}</p>
                 </div>
                 <div>
                   <p className="text-xs text-rose-400 uppercase tracking-wider mb-2 font-bold">The Fatal Flaw</p>
                   <p className="text-sm text-white leading-relaxed">{result.competitor_analysis.their_fatal_flaw}</p>
                 </div>
                 <div>
                   <p className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-bold">Estimated Pricing</p>
                   <p className="text-2xl font-mono text-emerald-400 font-bold">{result.competitor_analysis.estimated_price}</p>
                 </div>
               </div>
            </div>

            {/* Phase 2: The Attack */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-6 border border-white/10 rounded-2xl relative">
                 <CopyButton text={result.the_attack_vector.the_wedge} />
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
                   The Wedge (Sales Call)
                 </h3>
                 <p className="text-sm text-text-secondary mb-3">Say this exactly when they mention the competitor:</p>
                 <div className="bg-[#050505] border border-white/5 rounded-xl p-4 text-sm text-white font-medium italic">
                   "{result.the_attack_vector.the_wedge}"
                 </div>
                 <div className="mt-4">
                   <p className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-bold">Objection Handling</p>
                   <p className="text-sm text-white/80 leading-relaxed">{result.the_attack_vector.objection_handling}</p>
                 </div>
              </div>

              <div className="glass-card p-6 border border-rose-glow/30 bg-rose-glow/5 rounded-2xl relative shadow-[0_0_30px_rgba(255,45,85,0.05)]">
                 <CopyButton text={result.counter_copy.ad_hook} />
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <span className="w-6 h-6 rounded-full bg-rose-glow/20 text-rose-glow flex items-center justify-center text-xs">3</span>
                   Lethal Ad Hook
                 </h3>
                 <p className="text-sm text-text-secondary mb-3">Run this hook to steal their traffic:</p>
                 <div className="bg-[#050505] border border-rose-glow/20 rounded-xl p-5">
                   <p className="text-xl font-serif text-white leading-snug">"{result.counter_copy.ad_hook}"</p>
                 </div>
              </div>
            </div>

            {/* Phase 3: Outbound */}
            <div className="glass-card p-6 border border-white/10 rounded-2xl relative">
               <CopyButton text={`Subject: ${result.counter_copy.email_subject}\n\n${result.counter_copy.email_body}`} />
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">4</span>
                 Cold Email Sequence
               </h3>
               <div className="bg-[#050505] border border-white/5 rounded-xl p-5 font-mono text-sm">
                 <p className="text-text-secondary mb-4 border-b border-white/10 pb-4">
                   <span className="text-white font-bold">Subject:</span> {result.counter_copy.email_subject}
                 </p>
                 <p className="text-white whitespace-pre-wrap leading-relaxed">
                   {result.counter_copy.email_body}
                 </p>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
