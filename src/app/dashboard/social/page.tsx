"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Instagram, Youtube, Play, ArrowRight, Zap, Target, BarChart3, Clock, Sparkles } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: delay * 0.1, ease: [0.16, 1, 0.3, 1] as const }
});

export default function SocialHub() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);

  const handleDeploySwarm = async () => {
    if (!topic) return;
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/swarm/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStatus("success");
    } catch (e: any) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div {...fade(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-widest flex items-center gap-3">
            <Share2 className="w-8 h-8 text-electric" />
            <span className="font-bold">SOCIAL</span> MEDIA
          </h1>
          <p className="text-text-secondary mt-2">Generate platform-optimized content for Instagram, LinkedIn, YouTube, and more.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Master Control */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div {...fade(1)} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Global Control
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-secondary mb-2 block uppercase tracking-wider">Campaign Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 'Dopamine Detox Protocols'"
                  className="w-full bg-onyx border border-glass-border/50 text-white p-3 rounded-lg outline-none focus:border-electric/50 transition-colors placeholder:text-text-secondary/50"
                  disabled={status === "loading"}
                />
              </div>
              <button
                onClick={handleDeploySwarm}
                disabled={status === "loading" || !topic}
                className="w-full bg-gradient-to-r from-electric to-electric-dark text-onyx font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === "loading" ? (
                  <span className="animate-pulse">Deploying Social Swarm...</span>
                ) : (
                  <>Deploy Omni-Channel Swarm <Zap className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div {...fade(2)} className="glass-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">Live Analytics (24h)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-onyx/50 rounded-lg border border-glass-border/50">
                <Instagram className="w-5 h-5 text-pink-500 mb-2" />
                <p className="text-2xl font-bold text-white">12.4K</p>
                <p className="text-[10px] text-emerald-400 capitalize">Reach</p>
              </div>
              <div className="p-3 bg-onyx/50 rounded-lg border border-glass-border/50">
                <Youtube className="w-5 h-5 text-red-500 mb-2" />
                <p className="text-2xl font-bold text-white">8,930</p>
                <p className="text-[10px] text-emerald-400 capitalize">Views</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Mission Debrief / Feed */}
        <div className="lg:col-span-2">
          {status === "idle" && (
            <motion.div {...fade(3)} className="h-full min-h-[400px] border border-dashed border-glass-border rounded-xl flex flex-col items-center justify-center text-text-secondary/50 p-8 text-center">
              <Share2 className="w-12 h-12 mb-4 opacity-20" />
              <p>Awaiting campaign directive...</p>
              <p className="text-sm mt-2">Enter a topic to generate and publish an organic campaign.</p>
            </motion.div>
          )}

          {status === "loading" && (
            <motion.div {...fade(3)} className="glass-card p-8 text-center space-y-4">
               <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-electric border-solid mx-auto animate-spin" />
               <p className="text-electric animate-pulse">Gemini 1.5 Pro compiling organic strategy...</p>
            </motion.div>
          )}

          {status === "success" && result && (
             <motion.div {...fade(4)} className="space-y-6">
                <div className="glass-card p-6 border-l-4 border-l-emerald-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg text-white font-bold">Swarm Target Engaged</h2>
                  </div>
                  <p className="text-sm text-text-secondary">Topic: <span className="text-white">{topic}</span></p>
                  <p className="text-xs text-text-secondary mt-1">Campaign ID: {result.data.campaignId}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Instagram Review */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-glass-border bg-gradient-to-r from-pink-500/10 to-transparent flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-5 h-5 text-pink-500" />
                        <span className="font-bold text-white">Instagram</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] uppercase font-bold rounded">
                        {result.data.status.instagram_subagent}
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest block mb-1">Generated Caption</span>
                        <p className="text-sm text-white bg-onyx p-3 rounded-lg border border-glass-border/50 break-words">
                          {result.data.contentPlan.instagram.caption}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest block mb-1">Carousel Logic ({result.data.contentPlan.instagram.slide_count} Slides)</span>
                        <p className="text-xs text-text-secondary bg-onyx p-3 rounded-lg border border-glass-border/50 whitespace-pre-wrap break-words">
                          {result.data.contentPlan.instagram.script}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* YouTube Review */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-glass-border bg-gradient-to-r from-red-500/10 to-transparent flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-white">YouTube Shorts</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] uppercase font-bold rounded">
                        {result.data.status.youtube_subagent}
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest block mb-1">Video Title</span>
                        <p className="text-sm text-white font-bold bg-onyx p-3 rounded-lg border border-glass-border/50">
                          {result.data.contentPlan.youtube.title}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-text-secondary uppercase tracking-widest block mb-1">Script Breakdown</span>
                        <p className="text-xs text-text-secondary bg-onyx p-3 rounded-lg border border-glass-border/50 whitespace-pre-wrap break-words h-[150px] overflow-y-auto custom-scrollbar">
                          {result.data.contentPlan.youtube.script}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
             </motion.div>
          )}

          {status === "error" && (
            <motion.div {...fade(3)} className="glass-card p-6 border-l-4 border-l-rose-500">
               <h2 className="text-rose-500 font-bold">Commander, a fatal error occurred.</h2>
               <p className="text-sm text-text-secondary mt-2">The Social Router failed to complete the directive. Check server logs.</p>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
