"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Zap, ArrowRight, Sparkles, FileText, Video, Shield, Calendar, Copy, Check } from "lucide-react";
import Link from "next/link";

interface Message { role: "user" | "umbra"; text: string }
interface Campaign { adCopy: string; calendar: string; videoBrief: string; competitive: string }

const TABS = [
  { id: "adCopy", label: "Ad Copy", icon: Sparkles, color: "#6c63ff" },
  { id: "calendar", label: "Content Calendar", icon: Calendar, color: "#00d4ff" },
  { id: "videoBrief", label: "Video Brief", icon: Video, color: "#ff3366" },
  { id: "competitive", label: "Competitive Intel", icon: Shield, color: "#00ff88" },
] as const;

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "umbra", text: "I'm UMBRA — your shadow intelligence. I can write ad copy, analyze competitors, hunt leads, and buy media autonomously. What would you like to see?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [niche, setNiche] = useState("");
  const [product, setProduct] = useState("");
  const [generating, setGenerating] = useState(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [activeTab, setActiveTab] = useState("adCopy");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`demo_${Date.now()}`);
  const messageCount = useRef(0);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading || limitReached) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);
    messageCount.current++;

    try {
      const res = await fetch("/api/demo/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId: sessionId.current }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "umbra", text: data.reply }]);
      if (data.limitReached) setLimitReached(true);
      if (messageCount.current >= 3 && !showGenerator) {
        setTimeout(() => setShowGenerator(true), 1000);
      }
    } catch {
      setMessages(prev => [...prev, { role: "umbra", text: "Processing... try again." }]);
    } finally { setLoading(false); }
  };

  const generateCampaign = async () => {
    if (!niche.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/demo/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, product }),
      });
      const data = await res.json();
      if (data.campaign) setCampaign(data.campaign);
    } catch {} finally { setGenerating(false); }
  };

  const copyContent = () => {
    if (campaign) {
      navigator.clipboard.writeText(campaign[activeTab as keyof Campaign]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <header className="border-b border-glass-border px-6 py-4 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric to-rose-glow flex items-center justify-center text-[10px] font-bold text-white">U</div>
          <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white">UMBRA Demo</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-text-secondary uppercase tracking-widest">Live Intelligence</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat */}
        <div className={`flex-1 flex flex-col ${campaign ? "w-1/2" : "w-full"} transition-all`}>
          <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-electric/20 text-white border border-electric/30" : "glass-card text-gray-300"}`}>
                    {msg.role === "umbra" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Zap className="w-3 h-3 text-electric" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-electric">UMBRA</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2 text-sm text-text-secondary">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-electric" /> Thinking...
                  </div>
                </motion.div>
              )}
              {/* Live Demo Generator Prompt */}
              <AnimatePresence>
                {showGenerator && !campaign && (
                  <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                    className="glass-card p-5 border-electric/30 bg-electric/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-electric" />
                      <span className="text-xs font-bold uppercase tracking-widest text-electric">Live Campaign Generator</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">See what UMBRA would build for <strong className="text-white">your</strong> business — ad copy, content calendar, video brief, and competitive analysis generated in seconds.</p>
                    <div className="space-y-3">
                      <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Your niche (e.g. fitness coaching)"
                        className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50" />
                      <input value={product} onChange={e => setProduct(e.target.value)} placeholder="Your product (e.g. 12-week transformation program)"
                        className="w-full bg-onyx border border-glass-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50" />
                      <button onClick={generateCampaign} disabled={!niche.trim() || generating}
                        className="w-full py-3 bg-white text-midnight font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50">
                        {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating 4 components...</> : <><Sparkles className="w-4 h-4" /> Generate My Campaign</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-glass-border px-4 py-4 shrink-0">
            <div className="max-w-2xl mx-auto">
              {limitReached ? (
                <Link href="/sovereign" className="w-full py-3.5 bg-white text-midnight font-bold rounded-xl flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all">
                  Deploy UMBRA for Your Business <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask UMBRA anything about AI marketing..."
                    className="flex-1 bg-onyx border border-glass-border rounded-xl px-4 py-3 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50" disabled={loading} />
                  <button type="submit" disabled={!input.trim() || loading}
                    className="px-4 py-3 bg-white text-midnight rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50"><Send className="w-4 h-4" /></button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Results Panel */}
        <AnimatePresence>
          {campaign && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "50%", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              className="border-l border-glass-border flex flex-col overflow-hidden">
              <div className="p-4 border-b border-glass-border bg-onyx/30 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-electric flex items-center gap-2"><Sparkles className="w-3 h-3" /> Your Custom Campaign</h3>
                  <button onClick={copyContent} className="p-1.5 rounded-lg hover:bg-glass-bg transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-text-secondary" />}
                  </button>
                </div>
                <div className="flex gap-1.5">
                  {TABS.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === t.id ? "bg-white text-midnight" : "text-text-secondary hover:text-white"}`}>
                      <t.icon className="w-3 h-3" />{t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{campaign[activeTab as keyof Campaign]}</pre>
              </div>
              <div className="p-4 border-t border-glass-border shrink-0">
                <Link href="/sovereign" className="w-full py-3 bg-white text-midnight font-bold rounded-xl flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all text-sm">
                  Deploy UMBRA — Get This For Every Client <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
