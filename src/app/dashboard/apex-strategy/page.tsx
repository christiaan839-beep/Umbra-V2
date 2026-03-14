"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, Cpu, Brain, Film, PenTool, Zap, Network } from 'lucide-react';
import { pusherClient } from '@/lib/pusher';

type Agent = 'COMMANDER' | 'GOVERNOR' | 'AD-BUYER' | 'COPYWRITER' | 'VIDEO-SYNTH';

interface Message {
  id: string;
  agent: Agent;
  text: string;
  timestamp: Date;
  videoUrl?: string;
}

const AGENT_CONFIG = {
  'COMMANDER': { color: 'text-white', bg: 'bg-white/10', border: 'border-white/20', icon: Terminal },
  'GOVERNOR': { color: 'text-[#00B7FF]', bg: 'bg-[#00B7FF]/10', border: 'border-[#00B7FF]/20', icon: Brain },
  'AD-BUYER': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: Zap },
  'COPYWRITER': { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: PenTool },
  'VIDEO-SYNTH': { color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: Film },
};

// Active WebSocket Hook connecting to Executive Operations Server
function useApexTelemetry(initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe('umbra-global');
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind('apex_response', (data: any) => {
      setMessages(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), agent: data.agent, text: data.text, timestamp: new Date() }]);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    channel.bind('live_lead_stream', (data: any) => {
      if (data.event === 'video_synthesized') {
        const text = `[RE-ENTRY WEBHOOK] Synthetic Representation Asset Retrieved. Target URL injected into feed:`;
        setMessages(prev => [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          agent: 'VIDEO-SYNTH', 
          text: text, 
          timestamp: new Date(),
          videoUrl: data.video_url
        }]);
      } else {
        const payloadString = JSON.stringify(data, null, 2);
        const text = `[RE-ENTRY WEBHOOK] Physical Scraper Node returned payload:\n\n${payloadString}`;
        setMessages(prev => [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          agent: 'GOVERNOR', 
          text: text, 
          timestamp: new Date() 
        }]);
      }
      setIsProcessing(false);
    });

    channel.bind('apex_complete', () => {
       setIsProcessing(false);
    });

    return () => {
       if (pusherClient) {
         pusherClient.unsubscribe('umbra-global');
       }
    }
  }, []);

  const dispatchCommand = async (command: string) => {
    setIsProcessing(true);
    try {
      await fetch('/api/swarm/apex/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, role: 'GOD_MODE_EXECUTIVE' })
      });
      // The API route will either respond directly or trigger a pusher event
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return { messages, isProcessing, dispatchCommand };
}

export default function ApexStrategyTerminal() {
  const { messages, isProcessing, dispatchCommand } = useApexTelemetry([
    {
      id: '1',
      agent: 'GOVERNOR',
      text: 'God-Brain sequence initiated. Swarm nodes standing by for command injection.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    dispatchCommand(input);
    setInput('');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-[calc(100vh-2rem)] flex flex-col relative z-10">
      
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-light text-white tracking-widest font-mono flex items-center gap-3">
            <Terminal className="w-8 h-8 text-[#00B7FF]" /> 
            APEX COMMAND TERMINAL
          </h1>
          <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-xs mt-2 font-bold">
            Direct Natural Language Injection • Multi-Agent Swarm Logic
          </p>
        </div>
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-[#00B7FF]/20 shadow-[0_0_15px_rgba(0,183,255,0.1)]">
           <Network className="w-4 h-4 text-[#00B7FF] animate-pulse" />
           <span className="text-xs font-mono font-bold text-[#00B7FF] uppercase tracking-widest">
             {isProcessing ? 'Swarm Synthesizing...' : 'Swarm Idle'}
           </span>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="flex-1 bg-black/60 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col relative">
        
        {/* Cinematic Grid Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg) => {
              const config = AGENT_CONFIG[msg.agent];
              const Icon = config.icon;
              const isCommander = msg.agent === 'COMMANDER';
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex w-full ${isCommander ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[80%] ${isCommander ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-[0_0_15px_rgba(0,0,0,0.5)] flex-col ${config.bg} ${config.border}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    
                    <div className={`flex flex-col ${isCommander ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
                          [{msg.agent}]
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                           {msg.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className={`p-4 rounded-xl font-mono text-sm leading-relaxed border ${
                          isCommander 
                            ? 'bg-white/5 border-white/10 text-white rounded-tr-none' 
                            : 'bg-[#0B0C10]/80 border-glass-border text-neutral-300 rounded-tl-none'
                        } shadow-lg`}
                      >
                         <p className="whitespace-pre-wrap">{msg.text}</p>
                         
                         {msg.videoUrl && (
                           <div className="mt-4 rounded-xl overflow-hidden border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)] bg-black">
                              <div className="bg-pink-500/10 px-3 py-2 border-b border-pink-500/20 flex items-center justify-between">
                                <span className="text-xs font-bold text-pink-500 tracking-widest uppercase flex items-center gap-2">
                                  <Film className="w-3 h-3" /> SYNTHESIZED_ASSET.MP4
                                </span>
                                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                              </div>
                              <video 
                                src={msg.videoUrl} 
                                controls 
                                className="w-full max-w-sm rounded-b-xl object-cover"
                                autoPlay
                                loop
                                muted
                              />
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Command Input Area */}
        <div className="p-4 border-t border-[#00B7FF]/20 bg-[#0B0C10]/90 z-10 relative">
          <form onSubmit={handleCommand} className="relative flex items-center">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00B7FF]/50 font-mono font-bold">&gt;</div>
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Inject command into God-Brain... (e.g., 'Analyze competitor.com and launch counter-campaign')"
               disabled={isProcessing}
               className="w-full bg-black/50 border border-[#00B7FF]/30 rounded-xl py-4 pl-10 pr-16 text-white font-mono text-sm focus:outline-none focus:border-[#00B7FF] focus:shadow-[0_0_20px_rgba(0,183,255,0.2)] transition-all placeholder:text-neutral-600 disabled:opacity-50"
             />
             <button
               type="submit"
               disabled={!input.trim() || isProcessing}
               className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#00B7FF]/10 text-[#00B7FF] rounded-lg border border-[#00B7FF]/30 hover:bg-[#00B7FF]/20 transition-all disabled:opacity-50"
             >
               {isProcessing ? <Cpu className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}
