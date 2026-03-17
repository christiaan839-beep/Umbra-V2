"use client";

import React, { useState } from "react";
import { Megaphone, Loader2, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PdfExportButton from "@/components/ui/PdfExportButton";

interface AdCreative {
  headline: string;
  primaryText: string;
  callToAction: string;
  hook: string;
  style: string;
  targetAudience: string;
}

const STYLE_COLORS: Record<string, string> = {
  "pain-solution": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "social-proof": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "urgency": "bg-red-500/10 text-red-400 border-red-500/20",
  "curiosity": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "direct-benefit": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function AdCreatorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [creatives, setCreatives] = useState<AdCreative[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const [form, setForm] = useState({
    businessDescription: "",
    targetAudience: "",
    platform: "meta",
    tone: "Professional but bold"
  });

  const generate = async () => {
    if (!form.businessDescription || !form.targetAudience) return;
    setIsGenerating(true);
    setCreatives([]);
    try {
      const res = await fetch("/api/agents/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setCreatives(data.creatives || []);
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  const copyAd = (idx: number) => {
    const ad = creatives[idx];
    const text = `${ad.headline}\n\n${ad.primaryText}\n\n${ad.callToAction}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Megaphone className="w-3 h-3" /> Creative Factory
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Dynamic Ad Creator</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Generate 5 high-converting ad creatives in seconds using 5 different psychological hooks. Each variation is designed to stop the scroll and drive action. Agencies charge R50,000+ for this.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Campaign Brief</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Business Description</label>
                <textarea value={form.businessDescription} onChange={e => setForm({...form, businessDescription: e.target.value})} placeholder="e.g. Premium biohacking coaching program that helps professionals optimize sleep, focus, and physical performance through cold exposure, hybrid training, and organic nutrition." rows={4}
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target Audience</label>
                <input type="text" value={form.targetAudience} onChange={e => setForm({...form, targetAudience: e.target.value})} placeholder="e.g. Male professionals aged 28-45 who value self-improvement"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Platform</label>
                  <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}
                    className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
                    <option value="meta">Meta (FB/IG)</option>
                    <option value="tiktok">TikTok</option>
                    <option value="google">Google Ads</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Tone</label>
                  <select value={form.tone} onChange={e => setForm({...form, tone: e.target.value})}
                    className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none">
                    <option value="Professional but bold">Bold</option>
                    <option value="Casual and relatable">Casual</option>
                    <option value="Luxury and exclusive">Luxury</option>
                    <option value="Urgent and direct">Urgent</option>
                  </select>
                </div>
              </div>

              <button onClick={generate} disabled={isGenerating || !form.businessDescription || !form.targetAudience}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all disabled:opacity-50">
                {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating 5 Creatives...</> : <><Sparkles className="w-4 h-4" /> Generate Ad Pack</>}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2" id="report-content">
          <AnimatePresence>
            {creatives.length > 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">{creatives.length} Creatives Generated</h2>
                  <PdfExportButton fileName={`Ad_Creatives_${form.platform}`} />
                </div>

                {creatives.map((ad, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 border border-glass-border hover:border-rose-500/20 transition-colors group relative">
                    
                    <button onClick={() => copyAd(i)} className="absolute top-4 right-4 text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Copy ad">
                      {copiedIdx === i ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">{i + 1}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${STYLE_COLORS[ad.style] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"}`}>
                        {ad.style}
                      </span>
                    </div>

                    <div className="mb-3 p-3 bg-rose-500/5 rounded-lg border border-rose-500/10">
                      <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">Scroll-Stopper Hook</span>
                      <p className="text-sm text-white font-bold italic">&ldquo;{ad.hook}&rdquo;</p>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2">{ad.headline}</h4>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap mb-4">{ad.primaryText}</p>

                    <div className="flex items-center justify-between border-t border-glass-border pt-3">
                      <span className="text-xs text-electric font-bold">{ad.callToAction}</span>
                      <span className="text-[10px] text-text-secondary">{ad.targetAudience}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] glass-card flex flex-col items-center justify-center text-center p-8 border border-glass-border border-dashed">
                <div className="w-16 h-16 rounded-2xl bg-onyx/50 border border-glass-border flex items-center justify-center mb-4">
                  <Megaphone className="w-8 h-8 text-text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Creative Engine Idle</h3>
                <p className="text-sm text-text-secondary max-w-sm">
                  Describe your business and target audience. The AI will generate 5 scroll-stopping ad creatives using proven psychological frameworks.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
