'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Film } from 'lucide-react';

export default function DeepfakeShowcase() {
    // In production, these represent raw URL payloads from the HeyGen or Veo API outputs
    const videoDemos = [
        { id: 1, title: 'B2B Sales Outreach Deepfake', tech: 'HeyGen + Gemini 1.5' },
        { id: 2, title: 'Cinematic B-Roll Rendering', tech: 'Veo 3.1 Accelerated' }
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
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm font-medium mb-6"
                    >
                        <Film className="w-4 h-4 text-primary" />
                        Cinematic &quot;Proof of Work&quot;
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-outfit text-white">
                        Rendered purely by the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">God-Brain</span>.
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Do not hire human videographers. Our Filmmaker Agents utilize Veo 3.1 and elite TTS synthesis to manufacture hyper-realistic B2B cinematic content directly on the edge.
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
                            {/* Mock Video Thumbnail / Placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black group-hover:from-gray-800 transition-colors duration-500" />
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <PlayCircle className="w-16 h-16 text-white/50 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                                <p className="mt-4 text-gray-500 font-mono text-sm">[AWAITING_VIDEO_PAYLOAD]</p>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                                <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                                <p className="text-sm font-mono text-primary">{demo.tech}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
             </div>
        </section>
    );
}
