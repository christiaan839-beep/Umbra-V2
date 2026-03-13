"use client";

import { useState } from "react";
import { Mic, PhoneCall, PhoneForwarded, Radio, Waves, ShieldCheck, Activity, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceSwarmHub() {
  const [isDialing, setIsDialing] = useState(false);
  const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "connected" | "completed">("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [outcome, setOutcome] = useState("");

  const triggerVoiceAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialing(true);
    setCallStatus("dialing");
    setTranscript("");
    setOutcome("");

    const formData = new FormData(e.target as HTMLFormElement);
    const leadData = {
        name: formData.get("name"),
        industry: formData.get("industry")
    };

    try {
        // Simulate SIP trunk connecting
        setTimeout(() => setCallStatus("connected"), 1500);

        const res = await fetch("/api/swarm/voice/call", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadData })
        });

        const data = await res.json();
        
        if (data.success) {
            setCallStatus("completed");
            setOutcome(data.data.outcome);
            setTranscript(data.data.transcriptionSnippet);
        }

    } catch (e) {
        console.error("Voice Uplink Failed", e);
        setCallStatus("idle");
    } finally {
        setIsDialing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-midnight text-white font-mono">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                    <Mic className="text-electric w-8 h-8" />
                    Voice Swarm
                </h1>
                <p className="text-text-secondary uppercase tracking-widest text-xs mt-2">Autonomous Telephony Node // Vapi/Twilio Uplink</p>
            </div>
            <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase text-emerald-400 tracking-widest flex items-center gap-1">
                         <Activity className="w-3 h-3" /> Active Lines
                     </span>
                     <span className="text-xl font-bold font-sans">14 / 50</span>
                 </div>
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] uppercase text-text-secondary tracking-widest flex items-center gap-1">
                         <PhoneForwarded className="w-3 h-3" /> Minutes Talked (Today)
                     </span>
                     <span className="text-xl font-bold font-sans">3,492m</span>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Command Trigger */}
            <div className="col-span-1 border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
                    <PhoneCall className="w-4 h-4 text-electric" /> Initiate Outbound Extraction
                </h2>

                <form onSubmit={triggerVoiceAgent} className="space-y-4">
                    <div>
                        <label className="text-xs uppercase tracking-wider text-text-secondary block mb-2">Target Executive Name</label>
                        <input name="name" type="text" placeholder="e.g. John Smith" required className="w-full bg-midnight/50 border border-glass-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors" />
                    </div>
                    <div>
                         <label className="text-xs uppercase tracking-wider text-text-secondary block mb-2">Industry Vertical</label>
                        <input name="industry" type="text" placeholder="e.g. B2B SaaS" required className="w-full bg-midnight/50 border border-glass-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-electric transition-colors" />
                    </div>

                    <button disabled={isDialing} type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-electric to-rose-glow rounded-md text-white font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                         {isDialing ? (
                             <><Radio className="w-4 h-4 animate-spin text-white" /> Establishing SIP Link...</>
                         ) : (
                             <><PhoneCall className="w-4 h-4" /> Dispatch Voice Agent</>
                         )}
                    </button>
                    
                    <p className="text-[10px] text-text-secondary mt-4 text-center leading-relaxed">
                        UMBRA will synthesize an opening hook explicitly tailored to extract pain points regarding inefficient agency execution and high CAC within the target's industry profile.
                    </p>
                </form>
            </div>

            {/* Live Call Intercept Theatre */}
            <div className="col-span-1 lg:col-span-2 border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl flex flex-col overflow-hidden relative min-h-[500px]">
                
                <div className="p-4 border-b border-glass-border flex items-center justify-between bg-midnight/50 backdrop-blur-md z-10 relative">
                    <h2 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <Waves className="w-4 h-4 text-electric" /> Live Intercept Feed
                    </h2>
                    
                    {callStatus !== "idle" && (
                         <div className="flex items-center gap-2">
                            <span className="relative flex justify-center items-center h-3 w-3">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${callStatus === 'connected' ? 'bg-emerald-400' : 'bg-rose-500'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${callStatus === 'connected' ? 'bg-emerald-500' : 'bg-rose-600'}`}></span>
                            </span>
                            <span className={`text-[10px] uppercase tracking-widest font-bold ${callStatus === 'connected' ? 'text-emerald-400' : 'text-rose-500'}`}>
                                {callStatus}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-8 relative flex items-center justify-center">
                    {/* Background visualizer */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                         {[1,2,3,4,5].map(i => (
                             <motion.div
                                key={i}
                                className="absolute rounded-full border border-electric"
                                initial={{ width: 100, height: 100, opacity: 1 }}
                                animate={callStatus === "connected" ? {
                                    width: [100, 300 + (i*100), 100],
                                    height: [100, 300 + (i*100), 100],
                                    opacity: [0.8, 0, 0.8]
                                } : { opacity: 0 }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                             />
                         ))}
                    </div>

                    {callStatus === "idle" ? (
                        <div className="text-center text-text-secondary">
                             <Mic className="w-12 h-12 mx-auto mb-4 opacity-20" />
                             <p className="uppercase tracking-[0.2em] text-xs">Awaiting Extraction Command</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl text-left bg-midnight/80 border border-glass-border rounded-lg p-6 relative z-10 shadow-2xl backdrop-blur-md">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded bg-gradient-to-br from-electric/20 to-rose-glow/20 border border-electric/50 flex items-center justify-center shrink-0">
                                   <Brain className="w-5 h-5 text-electric" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase text-electric font-bold tracking-widest mb-1">UMBRA Swarm AI</p>
                                    
                                    <AnimatePresence mode="wait">
                                         {callStatus === "dialing" && (
                                              <motion.p key="dialing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-text-secondary text-sm">Negotiating SIP trunks...</motion.p>
                                         )}
                                         {callStatus === "connected" && (
                                              <motion.p key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-sm">Synthesizing vocal payload (Gemini 1.5 Pro). Transcribing...</motion.p>
                                         )}
                                         {callStatus === "completed" && (
                                              <motion.p key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-sm leading-relaxed font-sans mt-2 p-4 bg-white/5 rounded-md border-l-2 border-electric">"{transcript}"</motion.p>
                                         )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {outcome && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-4 border-t border-glass-border flex items-center justify-between">
                                    <span className="text-[10px] uppercase text-text-secondary tracking-widest">Event Resolution</span>
                                    <span className={`text-xs font-bold uppercase flex items-center gap-1 ${outcome.includes('Booked') || outcome.includes('Qualified') ? 'text-emerald-400' : 'text-rose-500'}`}>
                                         <ShieldCheck className="w-4 h-4" /> {outcome}
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
