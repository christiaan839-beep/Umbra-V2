"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Loader2, Sparkles, Download, CheckCircle2, Copy } from 'lucide-react';

export default function VectorStudio() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);
    const [statusIndicator, setStatusIndicator] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        setIsGenerating(true);
        setGeneratedSvg(null);
        setStatusIndicator(null);
        
        try {
            const res = await fetch('/api/swarm/studio/vectors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            
            if (!res.ok) throw new Error("Synthesis failed");
            
            const data = await res.json();
            
            if (data.error) {
                setStatusIndicator("Error: " + data.error);
                return;
            }

            setGeneratedSvg(data.svg);
            setStatusIndicator("Synthesis complete.");
            setTimeout(() => setStatusIndicator(null), 3000);
        } catch (error) {
            console.error(error);
            setStatusIndicator("Failed to generate vector.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedSvg) {
            navigator.clipboard.writeText(generatedSvg);
            setStatusIndicator("SVG copied to clipboard.");
            setTimeout(() => setStatusIndicator(null), 2000);
        }
    };

    const downloadSvg = () => {
        if (generatedSvg) {
            const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `umbra_vector_${Date.now()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-6 p-4 lg:p-8 overflow-hidden z-10 relative">
            {/* Left Panel: The Prompt Controller */}
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6 z-20">
                <div className="bg-black/40 backdrop-blur-2xl border border-[#00B7FF]/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,183,255,0.05)] flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />
                    
                    <h1 className="text-2xl font-light text-white tracking-widest font-mono flex items-center gap-3 mb-2">
                        <PenTool className="w-6 h-6 text-fuchsia-400" />
                        SYNTHESIS V2
                    </h1>
                    <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-[10px] font-bold mb-6">
                        Autonomous Vector Engine
                    </p>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-3 flex items-center gap-2">
                                <PenTool className="w-3 h-3 text-[#00B7FF]" /> Design Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the graphic to synthesize... (e.g. 'Generate an isometric 3D server rack logo with glowing neon blue and purple accents, suitable for a dark UI.')"
                                className="w-full flex-1 bg-black/60 border border-[#00B7FF]/20 rounded-xl p-4 text-sm text-neutral-300 placeholder:text-neutral-700/50 focus:outline-none focus:border-[#00B7FF]/50 focus:ring-1 focus:ring-[#00B7FF]/50 transition-all resize-none font-mono"
                            />
                        </div>

                        <AnimatePresence>
                            {statusIndicator && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />
                                    <span className="text-xs font-mono text-fuchsia-400 uppercase tracking-widest">{statusIndicator}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="w-full py-4 bg-gradient-to-r from-fuchsia-500/10 to-fuchsia-500/5 hover:from-fuchsia-500/20 hover:to-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 rounded-xl flex items-center justify-center gap-3 transition-all group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-bold font-mono text-xs"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            )}
                            {isGenerating ? 'Synthesizing Vectors...' : 'Execute Synthesis'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel: Live SVG Canvas */}
            <div className="flex-1 bg-black/40 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(0,183,255,0.05)] flex flex-col z-20">
                <div className="absolute top-0 left-0 right-0 h-14 border-b border-[#00B7FF]/10 bg-black/40 flex items-center justify-between px-6 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                         <div className="w-2 rounded-full h-2 bg-fuchsia-500 animate-pulse" />
                         <span className="text-[10px] font-mono text-[#00B7FF] tracking-widest uppercase">Canvas Viewport</span>
                    </div>
                    
                    {generatedSvg && (
                        <div className="flex gap-3">
                            <button 
                                onClick={copyToClipboard}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-neutral-300 flex items-center gap-2 transition-colors"
                            >
                                <Copy className="w-3 h-3" />
                                Copy Code
                            </button>
                            <button 
                                onClick={downloadSvg}
                                className="px-4 py-2 bg-[#00B7FF]/10 hover:bg-[#00B7FF]/20 border border-[#00B7FF]/30 rounded-lg text-xs font-mono text-[#00B7FF] flex items-center gap-2 transition-colors"
                            >
                                <Download className="w-3 h-3" />
                                Export SVG
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 relative bg-black/80 w-full h-full overflow-hidden flex items-center justify-center p-8 mt-14">
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:32px_32px]" />
                    
                    {isGenerating ? (
                        <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                            <div className="w-32 h-32 relative">
                                <div className="absolute inset-0 border border-fuchsia-500/30 rounded-lg animate-[spin_4s_linear_infinite]" />
                                <div className="absolute inset-2 border border-[#00B7FF]/30 rounded-lg animate-[spin_3s_linear_infinite_reverse]" />
                                <PenTool className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-fuchsia-400 animate-pulse" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-xs font-mono text-fuchsia-400 tracking-widest uppercase">Plotting Vector Paths</div>
                                <div className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">Calculating Bezier Curves</div>
                            </div>
                        </div>
                    ) : generatedSvg ? (
                         <div 
                            className="relative z-10 max-w-full max-h-full flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(0,183,255,0.2)]"
                            dangerouslySetInnerHTML={{ __html: generatedSvg }} 
                         />
                    ) : (
                        <div className="relative z-10 text-center opacity-30">
                            <PenTool className="w-16 h-16 mx-auto mb-4 text-white" />
                            <p className="text-xs font-mono text-neutral-400 tracking-widest uppercase">Awaiting Vector Parameters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
