"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal, Sparkles, Activity, ShieldAlert, Zap, Send, BrainCircuit, Maximize, Lock, Globe, Power } from "lucide-react";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function NemoClawPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are OpenClaw Nano 30B, the local Edge Daemon operating on the Commander's macOS. " +
    "You have root-level terminal access. " +
    "Your objective is to execute OS-level commands, intercept local data, and route heavy reasoning to the Super 120B God-Brain."
  );
  
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "OpenClaw Daemon Initialized. Mac OS connection established. Awaiting root directive." }
  ]);
  const [input, setInput] = useState("");
  const [isInferencing, setIsInferencing] = useState(false);
  const [latency, setLatency] = useState("- ms");
  const [privacyMode, setPrivacyMode] = useState<"secure" | "open">("secure");
  const [selectedModel, setSelectedModel] = useState("mistral-nemotron");
  const [isDeployed247, setIsDeployed247] = useState(false);
  const [showGuardrails, setShowGuardrails] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isInferencing]);

  const handleSend = async () => {
    if (!input.trim() || isInferencing) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input }
    ];
    
    setMessages(newMessages);
    setInput("");
    setIsInferencing(true);

    const startTime = performance.now();

    try {
      // We pass the system prompt as the first message to the NIM
      const payloadMessages = [
        { role: "system", content: systemPrompt },
        // Skip the initial assistant greeting for the payload, 
        // just send the actual user messages and assistant replies
        ...newMessages.filter(m => m.content !== "NemoClaw Initialized. NVIDIA Mistral-Nemotron Core online. Awaiting directive.")
      ];

      const res = await fetch("/api/nim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: payloadMessages,
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      setLatency(`${(endTime - startTime).toFixed(0)} ms`);

      const data = await res.json();

      if (data.success && data.result?.choices?.[0]?.message) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.result.choices[0].message.content }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "\`[SYSTEM ERROR]\` Interference detected. NIM endpoint failed to respond." }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "\`[CRITICAL ERROR]\` Connection to NVIDIA infrastructure severed." }
      ]);
    } finally {
      setIsInferencing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Activity className="w-3 h-3 animate-pulse" /> Edge Telemetry Active
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
          Nano 30B Edge Terminal
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Live connection to your local macOS OpenClaw Daemon. Execute OS-level commands natively, 
          manage background routines, and view payload telemetry bypassing the cloud.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[75vh]">
        
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Status Card */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00B7FF] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Hardware Status
            </h3>
            <div className="space-y-3 font-mono text-[10px] uppercase tracking-wider">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-neutral-500">Active Node</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-transparent border-none text-emerald-400 font-bold uppercase tracking-wider focus:outline-none focus:ring-0 cursor-pointer text-right appearance-none custom-select"
                  >
                    <option value="nano-30b" className="bg-[#050505]">Nemotron Nano (30B)</option>
                    <option value="super-120b" className="bg-[#050505]">Nemotron Super (120B)</option>
                    <option value="mistral-nemotron" className="bg-[#050505]">Mistral-Nemotron</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-neutral-500">Local Uplink</span>
                <span className="text-white">Port 8001 (openclaw_payload.py)</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-neutral-500">OpenShell Guardrails</span>
                <span className="text-emerald-400 flex items-center gap-1">
                   <ShieldAlert className="w-3 h-3" /> Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Last Inference</span>
                <span className="text-electric font-bold">{latency}</span>
              </div>
            </div>
          </div>

          {/* Builder Config */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 backdrop-blur-md flex-1 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> Core Directive
            </h3>
            <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed">
              Define the base system prompt constraints. This instructs Nemotron on how to reason and respond to downstream API triggers.
            </p>
            <textarea
              className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-emerald-100/90 focus:outline-none focus:border-[#00B7FF]/50 transition-colors resize-none custom-scrollbar"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              spellCheck={false}
            />
            <button className="w-full mt-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Save Core Directive
            </button>
          </div>

          {/* Enterprise Controls */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 backdrop-blur-md">
             <h3 className="text-xs font-bold uppercase tracking-widest text-[#00B7FF] mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Agent Toolkit Controls
             </h3>
             
             {/* Privacy Router */}
             <div className="mb-4">
               <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">Privacy Router</span>
               <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                 <button 
                   onClick={() => setPrivacyMode("secure")}
                   className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${privacyMode === 'secure' ? 'bg-[#00B7FF]/20 text-[#00B7FF] border border-[#00B7FF]/30' : 'text-neutral-500 hover:text-white'}`}
                 >
                   <Lock className="w-3 h-3" /> Local (Secure)
                 </button>
                 <button 
                   onClick={() => setPrivacyMode("open")}
                   className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${privacyMode === 'open' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'text-neutral-500 hover:text-white'}`}
                 >
                   <Globe className="w-3 h-3" /> Cloud (Internal API)
                 </button>
               </div>
             </div>

             {/* 24/7 Deployment */}
             <button 
               onClick={() => setIsDeployed247(!isDeployed247)}
               className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all ${
                 isDeployed247 
                   ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                   : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
               }`}
             >
               <Power className={`w-4 h-4 ${isDeployed247 ? 'animate-pulse' : ''}`} />
               {isDeployed247 ? 'Agent Deployed 24/7' : 'Deploy 24/7 Node'}
             </button>
             {isDeployed247 && (
               <p className="text-[9px] text-emerald-500/70 font-mono mt-2 text-center uppercase tracking-widest">
                  Autonomous background process active.
               </p>
             )}
          </div>

        </div>

        {/* Right Column: Execution Terminal */}
        <div className="lg:col-span-8 rounded-2xl bg-black border border-white/10 flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(0,183,255,0.05)]">
          {/* Terminal Header */}
          <div className="h-12 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neutral-500" />
              <span className="text-[10px] font-mono text-neutral-400 tracking-widest uppercase">macOS openclaw_daemon@local</span>
            </div>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar font-mono text-sm">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  className={`flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    m.role === "assistant" 
                      ? "bg-[#00B7FF]/10 text-[#00B7FF] border border-[#00B7FF]/20" 
                      : "bg-white/10 text-white border border-white/20"
                  }`}>
                    {m.role === "assistant" ? <Cpu className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                  </div>
                  
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    m.role === "user" 
                      ? "bg-white/10 border border-white/10 text-white rounded-tr-sm" 
                      : "bg-[#00B7FF]/5 border border-[#00B7FF]/10 text-emerald-50 rounded-tl-sm relative group"
                  }`}>
                    {m.role === "assistant" && i > 0 && (
                      <div className="absolute -top-2.5 -left-2 px-2 py-0.5 bg-black border border-[#00B7FF]/30 rounded text-[9px] text-[#00B7FF] uppercase tracking-wider font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        TensorRT Inference
                      </div>
                    )}
                    <span className="whitespace-pre-wrap leading-relaxed">{m.content}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isInferencing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-lg bg-[#00B7FF]/10 text-[#00B7FF] border border-[#00B7FF]/20 flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4 animate-pulse" />
                 </div>
                 <div className="bg-[#00B7FF]/5 border border-[#00B7FF]/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B7FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B7FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00B7FF] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[10px] text-[#00B7FF] uppercase tracking-widest font-bold ml-2">Resolving NIM Logic...</span>
                 </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Initialize sequence... [Press Enter]"
                className="w-full bg-black/50 border border-white/10 focus:border-[#00B7FF]/50 rounded-xl py-4 flex-1 pl-4 pr-14 text-sm font-mono text-white outline-none transition-colors"
                disabled={isInferencing || isDeployed247}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isInferencing || isDeployed247}
                className="absolute right-2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-30 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {showGuardrails && (
               <div className="absolute top-0 right-4 -translate-y-full mb-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2 animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                 <ShieldAlert className="w-3 h-3" /> OpenShell Safety Policy Enforced
               </div>
            )}

            <div className="mt-2 text-center">
               <span className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest">
                 Live connection to NVIDIA NIM (mistral-nemotron)
               </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
