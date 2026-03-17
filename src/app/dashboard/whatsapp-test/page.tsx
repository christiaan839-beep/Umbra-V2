"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Bot, User, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Message {
  from: "user" | "umbra";
  text: string;
  timestamp: string;
}

const PRESET_MESSAGES = [
  "Hey, I saw your post about dental marketing. How does it work?",
  "What's the pricing for the AI marketing system?",
  "Can you show me a competitor analysis for my area?",
  "I'm spending R30k/month with an agency and getting nothing. Help?",
];

export default function WhatsAppTestPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "umbra",
      text: "Welcome to the UMBRA WhatsApp Simulator. Send a message as if you were a prospect — watch how our AI Closer responds autonomously.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = {
      from: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You are UMBRA's WhatsApp AI Closer. A prospect just messaged you: "${text.trim()}". Reply in 1-2 short, conversational sentences. Be persuasive but natural. Your goal is to qualify them and book a demo call. Do NOT sound like a bot.`,
          sessionId: `whatsapp_test_${Date.now()}`,
        }),
      });
      const data = await res.json();
      const umbraMsg: Message = {
        from: "umbra",
        text: data.reply || "I'd love to learn more about your business. What area are you in and what's your biggest marketing challenge right now?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, umbraMsg]);
    } catch {
      setMessages(prev => [...prev, {
        from: "umbra",
        text: "I'd love to help you crush your competition. What city is your practice in? I'll run a free competitor scan right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <MessageSquare className="w-3 h-3" /> WhatsApp Sandbox
        </div>
        <h1 className="text-2xl font-bold serif-text text-white">WhatsApp AI Closer Test</h1>
        <p className="text-sm text-text-secondary mt-1">Simulate a lead conversation. UMBRA responds autonomously.</p>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESET_MESSAGES.map((msg, i) => (
          <button key={i} onClick={() => sendMessage(msg)}
            className="px-3 py-1.5 text-xs rounded-full glass-card text-text-secondary hover:text-white hover:border-emerald-400/30 transition-all cursor-pointer">
            {msg.length > 50 ? msg.slice(0, 50) + "..." : msg}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="rounded-2xl border border-glass-border overflow-hidden shadow-[0_0_40px_rgba(0,255,136,0.08)]">
        {/* Header */}
        <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-300/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">UMBRA AI Closer</p>
            <p className="text-emerald-200/60 text-[10px]">online • test mode</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Messages */}
        <div ref={chatRef} className="bg-[#0b141a] p-4 h-[450px] overflow-y-auto space-y-3"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-[#005c4b] text-white rounded-br-sm"
                    : "bg-[#1f2c33] text-gray-200 rounded-bl-sm"
                }`}>
                  {msg.from === "umbra" && (
                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> UMBRA AI
                    </p>
                  )}
                  {msg.text}
                  <p className="text-[9px] text-gray-500 text-right mt-1">{msg.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[#1f2c33] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }}
          className="bg-[#1f2c33] px-4 py-3 flex items-center gap-2 border-t border-gray-700/30">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message as a prospect..."
            className="flex-1 bg-[#2a3942] rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none" disabled={loading} />
          <button type="submit" disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors disabled:opacity-50">
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-text-secondary mb-3">In production, this runs on WhatsApp via Twilio — no human needed.</p>
        <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm text-electric hover:text-white transition-colors">
          Configure WhatsApp API Keys <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
