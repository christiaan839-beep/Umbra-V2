'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Film } from 'lucide-react';

export default function DeepfakeShowcase() {
    // Cinematic Defense-Grade Payloads
    const videoDemos = [
        { id: 1, title: 'Synthetic Outbound Node', tech: 'Audio2Face + TensorRT', src: 'https://cdn.pixabay.com/video/2021/08/04/83902-584742469_tiny.mp4' },
        { id: 2, title: 'Cosmos VLM Render Target', tech: 'NVIDIA Hardware Accelerated', src: 'https://cdn.pixabay.com/video/2020/09/22/50238-460498748_tiny.mp4' }
    ];

    return (
        <section className="py-24 bg-[#030303] border-y border-white/5 relative z-10">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
             
             <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-sm font-bold uppercase tracking-widest mb-6"
                    >
                        <Film className="w-4 h-4 text-neutral-400" />
                        Autonomous Media Foundry
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-outfit text-white">
                        Rendered purely by the <span className="text-neutral-500 font-serif italic">God-Brain</span>.
                    </h2>
                    <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
                        Do not hire human videographers. Our Filmmaker Agents utilize NVIDIA Cosmos and elite TTS synthesis to manufacture hyper-realistic B2B cinematic content directly on the edge.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {videoDemos.map((demo, idx) => (
                        <motion.div
                            key={demo.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video cursor-pointer"
                        >
                            <video 
                                src={demo.src}
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                   <PlayCircle className="w-8 h-8 text-white ml-1" />
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">{demo.tech}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
             </div>
        </section>
    );
}
