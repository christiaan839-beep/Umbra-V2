"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, Loader2, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export default function ArchitectDashboard() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [statusIndicator, setStatusIndicator] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        setIsGenerating(true);
        setGeneratedCode(null);
        setStatusIndicator(null);
        
        try {
            const res = await fetch('/api/swarm/architect', {
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

            setGeneratedCode(data.code);
            setStatusIndicator("Synthesis complete.");
            setTimeout(() => setStatusIndicator(null), 3000);
        } catch (error) {
            console.error(error);
            setStatusIndicator("Failed to generate architecture.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getIframeSrcDoc = (jsxCode: string) => `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        electric: '#00B7FF',
                        midnight: '#001824',
                    }
                }
            }
        }
    </script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { margin: 0; background-color: #000; color: #fff; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(0,183,255,0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,183,255,0.4); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        try {
            ${jsxCode}
            setTimeout(() => {
                if (window.lucide) window.lucide.createIcons();
            }, 100);
        } catch(e) {
            document.getElementById('root').innerHTML = '<div style="color:red; padding:20px; font-family:monospace;">Runtime Compile Error: ' + e.message + '</div>';
        }
    </script>
</body>
</html>
    `;

    return (
        <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-6 p-4 lg:p-8 overflow-hidden z-10 relative">
            {/* Left Panel: The Neural Prompt */}
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6 z-20">
                <div className="bg-black/40 backdrop-blur-2xl border border-[#00B7FF]/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,183,255,0.05)] flex flex-col h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                    
                    <h1 className="text-2xl font-light text-white tracking-widest font-mono flex items-center gap-3 mb-2">
                        <Terminal className="w-6 h-6 text-emerald-400" />
                        ARCHITECT
                    </h1>
                    <p className="text-[#8A95A5] uppercase tracking-[0.2em] text-[10px] font-bold mb-6">
                        Autonomous UI Synthesis Engine
                    </p>

                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-3 flex items-center gap-2">
                                <Code className="w-3 h-3 text-[#00B7FF]" /> Design Prompt
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe the UI to architect... (e.g. 'Build a high-converting dark-mode pricing tier section for a MedSpa. Use glassmorphism and electric blue accents.')"
                                className="w-full flex-1 bg-black/60 border border-[#00B7FF]/20 rounded-xl p-4 text-sm text-neutral-300 placeholder:text-neutral-700/50 focus:outline-none focus:border-[#00B7FF]/50 focus:ring-1 focus:ring-[#00B7FF]/50 transition-all resize-none font-mono"
                            />
                        </div>

                        <AnimatePresence>
                            {statusIndicator && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">{statusIndicator}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 hover:from-emerald-500/20 hover:to-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center gap-3 transition-all group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-bold font-mono text-xs"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            )}
                            {isGenerating ? 'Compiling DOM Vectors...' : 'Execute Architecture'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel: Live Executable Canvas */}
            <div className="flex-1 bg-black/40 backdrop-blur-3xl border border-[#00B7FF]/20 rounded-2xl relative overflow-hidden shadow-[0_0_50px_rgba(0,183,255,0.05)] flex flex-col z-20">
                <div className="absolute top-0 left-0 right-0 h-10 border-b border-[#00B7FF]/10 bg-black/40 flex items-center px-4 gap-4 z-10 backdrop-blur-md">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="flex-1 text-center flex justify-center">
                        <div className="bg-[#00B7FF]/5 border border-[#00B7FF]/20 rounded-md px-4 py-1 flex items-center gap-2">
                            <Play className="w-3 h-3 text-[#00B7FF]" />
                            <span className="text-[10px] font-mono text-[#00B7FF] tracking-widest">sandbox.umbra.local</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative bg-black/80 w-full h-full overflow-hidden pt-10">
                    {isGenerating ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 mt-10">
                            <div className="w-32 h-32 relative">
                                <div className="absolute inset-0 border border-[#00B7FF]/30 rounded-full animate-[spin_4s_linear_infinite]" />
                                <div className="absolute inset-2 border border-emerald-500/30 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                                <div className="absolute inset-4 border border-rose-500/30 rounded-full animate-[spin_2s_linear_infinite]" />
                                <Code className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00B7FF] animate-pulse" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-xs font-mono text-[#00B7FF] tracking-widest uppercase">Synthesizing AST Tree</div>
                                <div className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">Injecting Tailwind Styling</div>
                            </div>
                        </div>
                    ) : generatedCode ? (
                        <iframe
                            srcDoc={getIframeSrcDoc(generatedCode)}
                            className="w-full h-full border-none bg-black"
                            sandbox="allow-scripts"
                            title="UMBRA Architecture Sandbox"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center mt-10">
                            <div className="text-center opacity-30">
                                <Code className="w-16 h-16 mx-auto mb-4 text-white" />
                                <p className="text-xs font-mono text-neutral-400 tracking-widest uppercase">Waiting for God-Brain Directives</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
