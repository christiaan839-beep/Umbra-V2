"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Send, Activity, Cpu, Film, Target, Globe2, Shield, Zap, Bot } from 'lucide-react';

interface AgentMessage {
  id: string;
  agent: string;
  color: string;
  icon: any;
  text: string;
  timestamp: string;
}

const AGENTS: Record<string, { color: string; icon: any; glow: string }> = {
  'GOD-BRAIN': { color: 'text-[#00B7FF]', icon: BrainCircuit, glow: 'shadow-[0_0_15px_rgba(0,183,255,0.4)]' },
  'APEX': { color: 'text-rose-400', icon: Target, glow: 'shadow-[0_0_15px_rgba(244,63,94,0.4)]' },
  'TAVILY': { color: 'text-amber-400', icon: Globe2, glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]' },
  'CINEMATIC': { color: 'text-pink-400', icon: Film, glow: 'shadow-[0_0_15px_rgba(244,114,182,0.4)]' },
  'AD-BUYER': { color: 'text-emerald-400', icon: Zap, glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]' },
  'GOVERNOR': { color: 'text-violet-400', icon: Shield, glow: 'shadow-[0_0_15px_rgba(167,139,250,0.4)]' },
};

const ORCHESTRATION_SEQUENCES: Record<string, AgentMessage[]> = {
  default: [
    { id: '1', agent: 'GOD-BRAIN', color: '', icon: null, text: 'Decomposing strategic objective into sub-tasks. Routing to specialist nodes...', timestamp: '' },
    { id: '2', agent: 'TAVILY', color: '', icon: null, text: 'Initiating cross-domain intelligence extraction. Scanning competitive landscape across 12 verticals. Aggregating SERP dominance scores, backlink authority curves, and social velocity metrics...', timestamp: '' },
    { id: '3', agent: 'APEX', color: '', icon: null, text: 'TAVILY data ingested. Identifying vulnerability vectors in competitor positioning. Weak CTA structure detected. Pricing page has 34% lower conversion efficiency than market average. Formulating counter-strategy...', timestamp: '' },
    { id: '4', agent: 'CINEMATIC', color: '', icon: null, text: 'Synthesizing 3 video hook variants targeting identified vulnerability. Generating UGC-style testimonial (11Labs voice clone) + motion graphics explainer (HeyGen avatar). ETA: 45 seconds.', timestamp: '' },
    { id: '5', agent: 'AD-BUYER', color: '', icon: null, text: 'Campaign architecture ready. Allocating $150/day across 4 adsets. Lookalike audience seeded from competitor\'s top 1000 engaged followers. Projected ROAS: 4.2x within 72hrs.', timestamp: '' },
    { id: '6', agent: 'GOVERNOR', color: '', icon: null, text: '⚡ Compliance scan PASSED. Ad copy clear of restricted claims. Creative assets verified against Meta Advertising Standards. All systems green for deployment.', timestamp: '' },
    { id: '7', agent: 'GOD-BRAIN', color: '', icon: null, text: '✅ STRATEGIC DEPLOYMENT AUTHORIZED. All 6 sub-tasks routed and confirmed. Campaign goes live in T-minus 60 seconds. God-Tier Output: ENGAGED.', timestamp: '' },
  ],
};

export default function ApexWarRoom() {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTyping, setCurrentTyping] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, currentTyping]);

  const executeOrchestration = async (userPrompt: string) => {
    setIsProcessing(true);
    
    // Add user message
    const userMsg: AgentMessage = {
      id: `user-${Date.now()}`,
      agent: 'COMMANDER',
      color: 'text-white',
      icon: Cpu,
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setMessages(prev => [...prev, userMsg]);

    const sequence = ORCHESTRATION_SEQUENCES.default;

    for (let i = 0; i < sequence.length; i++) {
      const msg = sequence[i];
      const agentInfo = AGENTS[msg.agent];
      
      // Show typing indicator
      setCurrentTyping(msg.agent);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
      
      // Add the message
      const fullMsg: AgentMessage = {
        ...msg,
        id: `agent-${Date.now()}-${i}`,
        color: agentInfo.color,
        icon: agentInfo.icon,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      };
      
      setCurrentTyping(null);
      setMessages(prev => [...prev, fullMsg]);
      
      await new Promise(r => setTimeout(r, 400));
    }

    setIsProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const prompt = input;
    setInput('');
    executeOrchestration(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-5xl mx-auto p-4 lg:p-8">
      
      {/* Header */}
      <div className="backdrop-blur-3xl bg-black/40 border border-[#00B7FF]/20 rounded-2xl p-6 mb-6 shadow-[0_0_50px_rgba(0,183,255,0.05)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-white tracking-widest flex items-center gap-3 font-mono">
              <BrainCircuit className="w-7 h-7 text-[#00B7FF]" />
              [ APEX WAR ROOM ]
            </h1>
            <p className="text-neutral-400 text-xs tracking-widest uppercase mt-1">
              Multi-Agent Strategic Command Interface • Direct Neural Uplink
            </p>
          </div>
          <div className="flex items-center gap-2">
            {Object.entries(AGENTS).slice(0, 4).map(([name, info]) => (
              <div key={name} className={`w-2 h-2 rounded-full ${info.color.replace('text-', 'bg-')} ${isProcessing ? 'animate-pulse' : ''}`}
                style={{ boxShadow: isProcessing ? `0 0 8px currentColor` : 'none' }}
              />
            ))}
            <span className="text-[9px] uppercase tracking-widest text-neutral-500 ml-2 font-mono">
              {isProcessing ? 'PROCESSING' : '6 AGENTS ONLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Feed */}
      <div ref={feedRef} className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
        
        {messages.length === 0 && !isProcessing && (
          <div className="flex flex-col items-center justify-center h-full text-neutral-600">
            <BrainCircuit className="w-16 h-16 mb-6 opacity-20" />
            <p className="text-sm uppercase tracking-widest font-mono mb-2">Neural Uplink Awaiting Input</p>
            <p className="text-xs text-neutral-700 max-w-md text-center">
              Type a strategic order below. The God-Brain will decompose it into sub-tasks and route them to specialist agents in real-time.
            </p>
            <div className="mt-8 space-y-2 text-[10px] text-neutral-700 font-mono">
              <p className="opacity-50">Try: "Analyze competitor domain acme.com and launch a counter-campaign"</p>
              <p className="opacity-50">Try: "Generate a viral video campaign for B2B SaaS founders"</p>
              <p className="opacity-50">Try: "Deploy a cold outreach sequence to 500 qualified leads"</p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => {
            const isUser = msg.agent === 'COMMANDER';
            const agentInfo = !isUser ? AGENTS[msg.agent] : null;
            const IconComponent = isUser ? Cpu : msg.icon;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.4 }}
                className={`flex gap-4 ${isUser ? 'justify-end' : ''}`}
              >
                {!isUser && (
                  <div className={`w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0 ${agentInfo?.glow}`}>
                    <IconComponent className={`w-4 h-4 ${msg.color}`} />
                  </div>
                )}
                
                <div className={`max-w-[75%] ${isUser ? 'bg-[#00B7FF]/10 border-[#00B7FF]/30' : 'bg-black/50 border-white/10'} border backdrop-blur-2xl rounded-2xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isUser ? 'text-[#00B7FF]' : msg.color}`}>
                      {msg.agent}
                    </span>
                    <span className="text-[9px] text-neutral-600 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-neutral-200 leading-relaxed font-sans">{msg.text}</p>
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-[#00B7FF]/10 border border-[#00B7FF]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,183,255,0.3)]">
                    <Cpu className="w-4 h-4 text-[#00B7FF]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        {currentTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 pl-1"
          >
            <div className={`w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center ${AGENTS[currentTyping]?.glow}`}>
              {React.createElement(AGENTS[currentTyping]?.icon || Bot, { className: `w-4 h-4 ${AGENTS[currentTyping]?.color}` })}
            </div>
            <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 rounded-2xl px-4 py-3">
              <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${AGENTS[currentTyping]?.color} mr-2`}>{currentTyping}</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="backdrop-blur-3xl bg-black/60 border border-[#00B7FF]/20 rounded-2xl p-2 flex items-center gap-3 shadow-[0_0_50px_rgba(0,183,255,0.05)]">
          <div className="pl-4">
            <BrainCircuit className="w-5 h-5 text-[#00B7FF]/50" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isProcessing ? "Agents are processing..." : "Enter a strategic directive for the God-Brain..."}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-neutral-600 outline-none font-mono disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="p-3 rounded-xl bg-[#00B7FF]/10 border border-[#00B7FF]/30 hover:bg-[#00B7FF]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <Activity className="w-4 h-4 text-[#00B7FF] animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-[#00B7FF]" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
