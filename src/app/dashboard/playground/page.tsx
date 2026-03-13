"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Bot, User, Trash2, Copy, Check, Brain, FileText, Video, MessageSquare } from "lucide-react";

const AGENTS: Record<string, { name: string; icon: typeof Brain; color: string; model: string; system: string }> = {
  content: { name: "Content Agent", icon: FileText, color: "#6c63ff", model: "claude", system: "You are an elite content creation agent. Create high-converting marketing content. Be specific, engaging, and include calls to action." },
  research: { name: "Research Agent", icon: Brain, color: "#00d4ff", model: "gemini", system: "You are a market research analyst. Provide thorough, data-driven analysis with actionable insights." },
  closer: { name: "Sales Closer", icon: MessageSquare, color: "#00ff88", model: "claude", system: "You are a high-ticket sales closer. Qualify leads, handle objections, and guide conversations toward the sale." },
  video: { name: "Video Director", icon: Video, color: "#ff3366", model: "gemini", system: "You are a video creative director. Create detailed production briefs with scene-by-scene breakdowns." },
};

interface Msg { role: "user" | "assistant"; content: string; model?: string }

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [activeAgent, setActiveAgent] = useState("content");
  const [copied, setCopied] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const agent = AGENTS[activeAgent];
    setMessages(p => [...p, { role: "user", content: input.trim() }]);
    setInput(""); setStreaming(true);
    setMessages(p => [...p, { role: "assistant", content: "", model: agent.model }]);

    try {
      const res = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input.trim(), systemInstruction: agent.system, model: agent.model }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No stream");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const data = JSON.parse(line.replace("data: ", ""));
          if (data.done) break;
          if (data.text) {
            setMessages(p => {
              const u = [...p]; const last = u[u.length - 1];
              if (last.role === "assistant") last.content += data.text;
              return [...u];
            });
          }
        }
      }
    } catch {
      setMessages(p => { const u = [...p]; u[u.length - 1].content = "⚠️ Failed. Check API keys."; return [...u]; });
    } finally { setStreaming(false); }
  };

  const copyMsg = (i: number, c: string) => { navigator.clipboard.writeText(c); setCopied(i); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-1 overflow-hidden">
        {/* Agent Sidebar */}
        <div className="w-56 border-r border-glass-border p-4 hidden md:block shrink-0">
          <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-3">Select Agent</p>
          <div className="space-y-1.5">
            {Object.entries(AGENTS).map(([key, a]) => (
              <button key={key} onClick={() => setActiveAgent(key)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all text-sm ${activeAgent === key ? "border border-electric/40 bg-electric/5" : "border border-transparent hover:border-glass-border"}`}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${a.color}15` }}>
                  <a.icon className="w-3.5 h-3.5" style={{ color: a.color }} />
                </div>
                <div>
                  <div className="text-xs font-medium">{a.name}</div>
                  <div className="text-[10px] text-text-secondary capitalize">{a.model}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 rounded-2xl bg-electric/10 flex items-center justify-center mb-4">
                  <Bot className="w-7 h-7 text-electric" />
                </div>
                <h2 className="text-lg font-bold mb-1">Chat with {AGENTS[activeAgent].name}</h2>
                <p className="text-text-secondary text-xs">Powered by {AGENTS[activeAgent].model === "claude" ? "Claude Sonnet" : "Gemini Flash"}</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-1" style={{ background: `${AGENTS[activeAgent].color}15` }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: AGENTS[activeAgent].color }} />
                  </div>
                )}
                <div className={`max-w-[70%] ${msg.role === "user" ? "bg-electric/20 border border-electric/30" : "glass-card"} rounded-2xl p-3.5 group relative`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === "assistant" && msg.content && (
                    <button onClick={() => copyMsg(i, msg.content)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-glass-bg">
                      {copied === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-text-secondary" />}
                    </button>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-electric/10 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-electric" />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-glass-border p-4">
            <div className="max-w-3xl mx-auto flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={`Message ${AGENTS[activeAgent].name}...`} disabled={streaming}
                className="flex-1 bg-onyx border border-glass-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors placeholder:text-text-secondary disabled:opacity-50" />
              <button onClick={send} disabled={streaming || !input.trim()}
                className="px-4 py-3 bg-white text-midnight font-bold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
