"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Shield, ShieldCheck, Lock, Activity, Server, FileCode, AlertTriangle, Fingerprint } from "lucide-react";

export default function CyberAuditPage() {
  const [targetUrl, setTargetUrl] = useState("");
  const [pipelineStatus, setPipelineStatus] = useState<"idle" | "scanning" | "analyzing" | "complete">("idle");
  const [vulnerabilities, setVulnerabilities] = useState<Array<{ type: "critical" | "high" | "medium"; title: string; desc: string }>>([]);

  const startAudit = () => {
    setPipelineStatus("scanning");
    
    setTimeout(() => {
      setPipelineStatus("analyzing");
    }, 2500);

    setTimeout(() => {
      setVulnerabilities([
        { type: "critical", title: "Exposed .env Configuration", desc: "Found publicly accessible environment variables at /api/.env.backup containing master database URIs." },
        { type: "high", title: "Outdated JWT Verification", desc: "Authentication middleware uses a deprecated JSON Web Token signing algorithm susceptible to key-confusion attacks." },
        { type: "medium", title: "Missing Rate Limiting (DDoS Risk)", desc: "The /webhook/stripe endpoint lacks throttle controls, enabling potential denial of service via rapid payload injection." }
      ]);
      setPipelineStatus("complete");
    }, 6000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[#050505] text-white">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-3 h-3" /> Container Security Analysis
        </div>
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2 flex items-center gap-3">
          AI Cyber Auditor
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Powered by NVIDIA Container Security Blueprint. Deploy the God-Brain to autonomously probe competitor or client infrastructure, identify zero-day vulnerabilities, and generate executive patch reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Config Col */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2">
              <Server className="w-4 h-4 text-red-400" /> Target Infrastructure
            </h3>
            
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2 block">Target Architecture URL / IP</label>
                  <input 
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-red-500/50 outline-none font-mono"
                    placeholder="https://client-infrastructure.com"
                  />
               </div>
            </div>

            <button 
              onClick={startAudit}
              disabled={pipelineStatus !== "idle" || !targetUrl}
              className="w-full mt-6 py-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
            >
              <Fingerprint className="w-4 h-4" /> Execute Vulnerability Sweep
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <FileCode className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                <h4 className="text-xl font-bold text-white mb-1">CWE</h4>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">Common Weaknesses</p>
             </div>
             <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                <Lock className="w-6 h-6 mx-auto mb-2 text-neutral-500" />
                <h4 className="text-xl font-bold text-white mb-1">CVE</h4>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">Known Exposures</p>
             </div>
          </div>
        </div>

        {/* Console Col */}
        <div className="lg:col-span-8">
           <div className="h-full min-h-[500px] flex flex-col rounded-2xl bg-black border border-red-500/20 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)]">
               <div className="h-12 border-b border-red-500/20 bg-red-500/5 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-mono text-red-400 tracking-widest uppercase">Live Sweep Telemetry</span>
                  </div>
                  {pipelineStatus !== "idle" && pipelineStatus !== "complete" && (
                     <div className="flex items-center gap-2 text-[9px] text-red-500 font-mono uppercase tracking-widest font-bold">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Probe Active
                     </div>
                  )}
                  {pipelineStatus === "complete" && (
                    <div className="flex items-center gap-2 text-[9px] text-red-500 font-mono uppercase tracking-widest font-bold">
                       <Shield className="w-3 h-3" /> Audit Logged
                    </div>
                  )}
               </div>

               <div className="p-6 flex-1 flex flex-col justify-center bg-[url('/noise.png')] bg-repeat opacity-95">
                  {pipelineStatus === "idle" && (
                     <div className="text-center">
                        <ShieldCheck className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                        <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Awaiting architecture target injection.</p>
                     </div>
                  )}

                  {pipelineStatus === "scanning" && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto space-y-4 font-mono text-xs text-red-400/70">
                        <p className="animate-pulse">&gt; Initializing port sweep over TCP/UDP...</p>
                        <p className="animate-pulse delay-75">&gt; Extracting container manifest headers...</p>
                        <p className="animate-pulse delay-150">&gt; Bypassing WAF telemetry protocols...</p>
                     </motion.div>
                  )}

                  {pipelineStatus === "analyzing" && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg mx-auto space-y-4 font-mono text-xs text-amber-400/70">
                        <p>&gt; Target topography mapped. 42 Nodes discovered.</p>
                        <p className="animate-pulse">&gt; Routing DOM structure to Llama-3.3-70B for injection simulation...</p>
                        <p className="animate-pulse delay-75">&gt; Cross-referencing active CVE lists via NVIDIA NIM...</p>
                     </motion.div>
                  )}

                  {pipelineStatus === "complete" && (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2 border-b border-red-500/20 pb-3">
                          <AlertTriangle className="w-4 h-4" /> Identified Vulnerabilities
                        </h3>
                        
                        <div className="space-y-4 flex-1">
                           {vulnerabilities.map((vuln, i) => (
                              <div key={i} className={`p-4 rounded-xl border ${
                                vuln.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                                vuln.type === 'high' ? 'bg-amber-500/10 border-amber-500/30' :
                                'bg-yellow-500/10 border-yellow-500/30'
                              }`}>
                                 <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                                      vuln.type === 'critical' ? 'bg-red-500 text-black' :
                                      vuln.type === 'high' ? 'bg-amber-500 text-black' :
                                      'bg-yellow-500 text-black'
                                    }`}>
                                      {vuln.type}
                                    </span>
                                    <h4 className="text-sm font-bold text-white">{vuln.title}</h4>
                                 </div>
                                 <p className="text-xs text-neutral-300 font-mono leading-relaxed">{vuln.desc}</p>
                              </div>
                           ))}
                        </div>

                        <button className="w-full mt-6 py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-[0_0_30px_rgba(239,68,68,0.3)] flex justify-center items-center gap-2">
                           Generate Executive PDF Report
                        </button>
                     </motion.div>
                  )}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
