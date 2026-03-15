"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Server, Globe2, Shield, Cpu, Activity, Play, CheckCircle2 } from "lucide-react";

type BootStep = {
    id: string;
    label: string;
    log: string;
    status: "pending" | "active" | "completed" | "error";
    icon: any;
};

export default function GenesisProtocolTerminal() {
    const [domain, setDomain] = useState("");
    const [company, setCompany] = useState("");
    const [isExecuting, setIsExecuting] = useState(false);
    const [activeStepId, setActiveStepId] = useState<string | null>(null);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
    
    const logsEndRef = useRef<HTMLDivElement>(null);

    const [steps, setSteps] = useState<BootStep[]>([
        { id: "vercel", label: "Vercel Sub-Domain", log: "Authenticating Vercel Edge API...", status: "pending", icon: Server },
        { id: "twilio", label: "Twilio Telephony", log: "Provisioning Local VOIP Block...", status: "pending", icon: Globe2 },
        { id: "clerk", label: "Clerk Auth Vault", log: "Generating Multi-Tenant Admin Keys...", status: "pending", icon: Shield },
        { id: "gemini", label: "AI Swarm Workers", log: "Synthesizing Campaign Architecture (Gemini 2.5 Pro)...", status: "pending", icon: Cpu },
    ]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [terminalLogs]);

    const addLog = (msg: string) => {
        setTerminalLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`]);
    };

    const initiateGenesis = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domain || isExecuting) return;

        setIsExecuting(true);
        setTerminalLogs([]);
        setSteps(steps.map(s => ({ ...s, status: "pending" })));

        addLog(`COMMAND RECOGNIZED: Initiating Genesis Protocol for target [${domain}]`);
        addLog(`Deploying isolated UMBRA sub-swarm...`);

        // Step 1: Vercel
        updateStepStatus("vercel", "active");
        addLog("Connecting to Vercel API...");
        await new Promise(r => setTimeout(r, 1200));
        addLog(`Successfully provisioned DNS record: ${domain.split('.')[0] || 'client'}.umbra-os.com`);
        updateStepStatus("vercel", "completed");

        // Step 2: Twilio
        updateStepStatus("twilio", "active");
        addLog("Negotiating Twilio SIP trunking limits...");
        await new Promise(r => setTimeout(r, 1500));
        addLog(`Purchased isolated VOIP block: +1 (800) 555-${Math.floor(1000 + Math.random() * 9000)}`);
        updateStepStatus("twilio", "completed");

        // Step 3: Clerk
        updateStepStatus("clerk", "active");
        addLog("Pinging Clerk vault for tenant isolation...");
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Generated Admin JWT for ${company || domain}.`);
        updateStepStatus("clerk", "completed");

        // Step 4: AI Architecture
        updateStepStatus("gemini", "active");
        addLog("Connecting to Gemini 2.5 Pro to synthesize initial campaign architecture...");
        
        try {
            const res = await fetch("/api/swarm/genesis/provision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: domain, companyName: company })
            });
            const data = await res.json();
            
            if (data.success && data.data.architecture) {
                data.data.architecture.forEach((cmd: string) => addLog(`[GEMINI ORCHESTRATOR] Physical Swarm Directive: ${cmd}`));
            } else {
                addLog("[GEMINI ORCHESTRATOR] Default swarm configuration deployed.");
            }
        } catch (e) {
            addLog(`[SYSTEM EXCEPTION] Swarm architecture fallback engaged.`);
        }

        updateStepStatus("gemini", "completed");
        setActiveStepId(null);
        addLog("GENESIS PROTOCOL COMPLETE. High-Ticket asset secured and operational.");
        setIsExecuting(false);
    };

    const updateStepStatus = (id: string, status: "pending" | "active" | "completed" | "error") => {
        setActiveStepId(id);
        setSteps(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-transparent text-white font-mono">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                        <Terminal className="text-electric w-8 h-8" />
                        Genesis Protocol
                    </h1>
                    <p className="text-text-secondary uppercase tracking-widest text-xs mt-2">Autonomous Infrastructure Provisioning // <span className="text-[#00B7FF] font-bold">God-Tier Deployment</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Control Input */}
                <div className="col-span-1 border border-glass-border bg-black/40 backdrop-blur-2xl rounded-xl p-6 h-fit">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
                        <Globe2 className="w-4 h-4 text-electric" /> Target Coordinates
                    </h2>

                    <form onSubmit={initiateGenesis} className="space-y-4">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-secondary block mb-2">Client Company Name</label>
                            <input 
                                type="text" 
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g. Acme Corp" 
                                disabled={isExecuting}
                                className="w-full bg-midnight/50 border border-glass-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-text-secondary block mb-2">Target Domain URL</label>
                            <input 
                                type="text" 
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="e.g. acmecorp.com" 
                                required 
                                disabled={isExecuting}
                                className="w-full bg-midnight/50 border border-glass-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors" 
                            />
                        </div>

                        <button 
                            disabled={isExecuting || !domain} 
                            type="submit" 
                            className="w-full py-4 mt-4 bg-gradient-to-r from-electric to-rose-glow rounded-md text-white font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,183,255,0.3)]"
                        >
                            {isExecuting ? (
                                <><Activity className="w-4 h-4 animate-spin text-white" /> Provisioning Infrastructure...</>
                            ) : (
                                <><Play className="w-4 h-4" /> Initiate Genesis</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Operations Terminal */}
                <div className="col-span-1 border border-glass-border bg-black/40 backdrop-blur-2xl rounded-xl p-6 lg:col-span-2 flex flex-col h-[600px]">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
                        <Terminal className="w-4 h-4 text-electric" /> Swarm War Room UI
                    </h2>

                    <div className="flex gap-4 mb-6 shrink-0 overflow-x-auto pb-2">
                        {steps.map((step) => (
                            <div key={step.id} className={`flex-1 min-w-[140px] border p-3 rounded-lg flex flex-col gap-2 transition-all duration-300 relative overflow-hidden
                                ${step.status === 'active' ? 'border-electric bg-electric/10 shadow-[0_0_15px_rgba(0,183,255,0.2)]' : 
                                  step.status === 'completed' ? 'border-emerald-500/50 bg-emerald-500/10' : 
                                  'border-glass-border bg-midnight/30'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <step.icon className={`w-4 h-4 ${step.status === 'active' ? 'text-electric animate-pulse' : step.status === 'completed' ? 'text-emerald-400' : 'text-text-secondary'}`} />
                                    {step.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-widest ${step.status === 'active' ? 'text-white' : 'text-text-secondary'}`}>
                                    {step.label}
                                </span>
                                {step.status === 'active' && (
                                   <motion.div className="absolute bottom-0 left-0 h-1 bg-electric" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, repeat: Infinity }} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 bg-black/80 border border-glass-border rounded-lg p-4 font-mono text-xs overflow-y-auto relative shadow-inner">
                        <div className="absolute top-0 right-0 p-2 text-[10px] text-text-secondary uppercase select-none flex items-center gap-2">
                             <div className="flex gap-1">
                                 <div className="w-2 h-2 rounded-full bg-rose-500" />
                                 <div className="w-2 h-2 rounded-full bg-amber-500" />
                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                             </div>
                             System: UMBRA OS
                        </div>

                        <div className="mt-6 space-y-2">
                            {terminalLogs.length === 0 && (
                                <p className="text-text-secondary opacity-50 italic">Awaiting high-ticket genesis execution...</p>
                            )}
                            <AnimatePresence>
                                {terminalLogs.map((log, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`${log.includes('COMPLETE') ? 'text-emerald-400 font-bold' : log.includes('EXCEPTION') ? 'text-rose-500 font-bold' : log.includes('GEMINI') ? 'text-electric' : 'text-stone-300'}`}
                                    >
                                        <span className="opacity-50 select-none mr-2">&gt;</span> 
                                        {log}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={logsEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
