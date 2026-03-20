"use client";

import React, { useState } from 'react';
import { Ghost, ShieldAlert, Download, Terminal, UploadCloud, Skull, Network } from 'lucide-react';

export default function GhostProtocolNode() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentPhase, setDeploymentPhase] = useState(0);

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeploymentPhase(1);
    setTimeout(() => setDeploymentPhase(2), 2000);
    setTimeout(() => setDeploymentPhase(3), 4000);
    setTimeout(() => setDeploymentPhase(4), 6000);
  };

  return (
    <div className="min-h-screen bg-black text-[#00ff66] p-8 font-mono animate-in fade-in">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <header className="border-b border-[#00ff66]/30 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-4">
              <Ghost className="w-8 h-8" />
              Ghost Protocol [NVIDIA OpenShell]
            </h1>
            <p className="text-[#00ff66]/60 mt-2 uppercase text-xs tracking-widest">
              Physical Local-Hardware Hijacking & Autonomous RPA Execution
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="flex items-center justify-end gap-2">
              <Network className="w-4 h-4" /> ENCRYPTED EDGE BRIDGE
            </p>
            <p className="text-red-500 flex items-center justify-end gap-1 mt-1">
              <ShieldAlert className="w-3 h-3" /> LEVEL 4 CLEARANCE REQUIRED
            </p>
          </div>
        </header>

        <main className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Column: Mission Control */}
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-neutral-800 p-6">
              <h2 className="text-white font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-[#00ff66]" />
                Step 1: Download Daemon
              </h2>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                The Ghost Protocol requires the NemoClaw Python daemon to be installed on target hardware (Windows/macOS/Linux). Once executed, the target machine surrenders input authority (mouse/keyboard) to the Sovereign Matrix Vercel Edge server, enabling 100% autonomous RPA (Robotic Process Automation).
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-black font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#00ff66] transition-colors">
                  Download Windows (.exe)
                </button>
                <button className="border border-white/20 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-white/10 transition-colors">
                  Download macOS (.dmg)
                </button>
              </div>
            </div>

            <div className="bg-[#00ff66]/5 border border-[#00ff66]/20 p-6">
              <h2 className="text-[#00ff66] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Step 2: Dispatch Command
              </h2>
              <textarea
                className="w-full h-32 bg-black border border-[#00ff66]/40 p-4 text-[#00ff66] placeholder:text-[#00ff66]/30 focus:outline-none focus:border-[#00ff66] transition-colors resize-none text-xs"
                placeholder="Enter physical execution parameters... e.g., 'Open Chrome, navigate to LinkedIn.com, search for CEO profiles in Dubai, extract absolute URLs and send DM sequences.'"
              />
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || deploymentPhase === 4}
                className="w-full mt-4 bg-red-600/20 border border-red-500/50 text-red-500 font-black uppercase tracking-widest py-4 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Skull className="w-5 h-5" /> {isDeploying ? 'Establishing Neural Uplink...' : 'Execute Ghost Protocol'}
              </button>
            </div>
          </div>

          {/* Right Column: Telemetry & Live View */}
          <div className="border border-[#00ff66]/20 bg-black p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#00ff66] font-bold uppercase tracking-widest flex items-center gap-2 text-sm">
                <UploadCloud className="w-5 h-5" />
                Live Edge Stream
              </h2>
              <span className={`px-2 py-1 text-[10px] font-bold uppercase flex items-center gap-1 ${deploymentPhase > 0 ? 'bg-[#00ff66]/20 text-[#00ff66]' : 'bg-neutral-800 text-neutral-500'}`}>
                {deploymentPhase > 0 ? <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" /> : <span className="w-2 h-2 rounded-full bg-neutral-600" />}
                {deploymentPhase > 0 ? 'TARGET ACQUIRED' : 'NO CONNECTION'}
              </span>
            </div>

            {/* Video/RPA Stream Placeholder */}
            <div className="flex-1 border border-neutral-800 bg-neutral-950 relative overflow-hidden flex items-center justify-center min-h-[300px]">
              {deploymentPhase === 0 && (
                <p className="text-neutral-600 font-mono text-xs uppercase">Awaiting Target Handshake...</p>
              )}
              {deploymentPhase > 0 && deploymentPhase < 4 && (
                <div className="text-[#00ff66] font-mono text-xs uppercase animate-pulse flex flex-col items-center">
                  <Ghost className="w-12 h-12 mb-4" />
                  <p>{deploymentPhase === 1 ? 'Bypassing local security protocols...' : deploymentPhase === 2 ? 'Injecting Python execution vectors...' : 'Calibrating cursor/keyboard control limits...'}</p>
                </div>
              )}
              {deploymentPhase === 4 && (
                <div className="w-full h-full relative group">
                  <video src="/videos/demo3.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-[#00ff66]/10 mix-blend-overlay" />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-black/80 backdrop-blur-sm border-t border-[#00ff66]/30">
                     <p className="text-[#00ff66] font-mono text-xs animate-pulse">&#x25B6; GHOST_PROTOCOL_ACTIVE</p>
                     <p className="text-white text-[10px] font-mono mt-1 opacity-70">Agent taking physical control of desktop UI...</p>
                  </div>
                  {/* Targeting reticle overlay to look cool */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-[#00ff66]/50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#00ff66] rounded-full animate-ping" />
                  </div>
                </div>
              )}
            </div>

            {/* Log Stream */}
            <div className="mt-6 h-32 bg-black border border-neutral-800 p-4 font-mono text-[10px] overflow-hidden flex flex-col justify-end">
              {deploymentPhase >= 1 && <p className="opacity-50">[00:00:01] Authenticating Vercel Edge token...</p>}
              {deploymentPhase >= 2 && <p className="opacity-70">[00:00:03] Pinging local OpenShell client 192.168.1.44...</p>}
              {deploymentPhase >= 3 && <p className="opacity-90">[00:00:05] Bounding Box recognition successfully loaded via Cosmos VLM.</p>}
              {deploymentPhase >= 4 && <p className="text-[#00ff66]">[00:00:07] SUCCESS. Ghost Agent physically navigating 'LinkedIn.com'...</p>}
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
