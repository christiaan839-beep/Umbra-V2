"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Zap, ArrowRight, X } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "umbra";
  text: string;
}

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "umbra", text: "I'm UMBRA — your shadow intelligence. I can write ad copy, analyze competitors, hunt leads, and buy media autonomously. What would you like to see?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`demo_${Date.now()}`);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading || limitReached) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId: sessionId.current }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "umbra", text: data.reply }]);
      if (data.limitReached) setLimitReached(true);
    } catch {
      setMessages(prev => [...prev, { role: "umbra", text: "Processing... try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      {/* Header */}
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

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-electric/20 text-white border border-electric/30"
                  : "glass-card text-gray-300"
              }`}>
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
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-glass-border px-4 py-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          {limitReached ? (
            <Link href="/sovereign"
              className="w-full py-3.5 bg-white text-midnight font-bold rounded-xl flex items-center justify-center gap-2 group hover:bg-gray-200 transition-all">
              Deploy UMBRA for Your Business <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask UMBRA anything about AI marketing..."
                className="flex-1 bg-onyx border border-glass-border rounded-xl px-4 py-3 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:border-electric/50"
                disabled={loading}
              />
              <button type="submit" disabled={!input.trim() || loading}
                className="px-4 py-3 bg-white text-midnight rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
