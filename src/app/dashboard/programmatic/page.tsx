"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, CopyPlus, Play, Layers, MapPin, Search } from "lucide-react";

export default function ProgrammaticSEOPage() {
  const [service, setService] = useState("");
  const [citiesInput, setCitiesInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ url: string; status: string }[]>([]);

  const generatePages = async () => {
    if (!service || !citiesInput) return;
    
    const cities = citiesInput.split(",").map(c => c.trim()).filter(c => c);
    if (cities.length === 0) return;

    setIsGenerating(true);
    setProgress(0);
    setResults([]);

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        try {
            // We await the API per city to show live progress
            const res = await fetch("/api/programmatic/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ service, city })
            });
            const data = await res.json();
            
            setResults(prev => [...prev, { url: `/locations/${service.toLowerCase().replace(/\\s+/g, '-')}/${city.toLowerCase().replace(/\\s+/g, '-')}`, status: data.success ? "Generated" : "Failed" }]);
        } catch (e) {
            setResults(prev => [...prev, { url: `/locations/${service.toLowerCase().replace(/\\s+/g, '-')}/${city.toLowerCase().replace(/\\s+/g, '-')}`, status: "Failed" }]);
        }
        setProgress(Math.round(((i + 1) / cities.length) * 100));
    }

    setIsGenerating(false);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric/10 border border-electric/20 text-electric text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3 h-3" /> Scale Infrastructure
          </div>
          <h1 className="text-3xl font-bold serif-text text-white">Programmatic SEO Engine</h1>
          <p className="text-sm text-text-secondary mt-2 max-w-2xl">
            Automate the creation of hundreds of hyper-localized service pages. Input your core service and a list of target cities, and UMBRA will generate distinct, schema-optimized pages to blanket Google Search.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="glass-card p-6 border border-glass-border h-fit">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <CopyPlus className="w-4 h-4 text-electric" />
            Batch Generation Parameters
          </h3>
          
          <div className="space-y-5">
             <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Core Service</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  value={service}
                  onChange={e => setService(e.target.value)}
                  placeholder="e.g. AI Dental Marketing"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-electric transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Target Cities (Comma Separated)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
                <textarea 
                  value={citiesInput}
                  onChange={e => setCitiesInput(e.target.value)}
                  placeholder="Dallas, Austin, Houston, San Antonio, Fort Worth..."
                  rows={4}
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-electric transition-colors resizenone"
                />
              </div>
              <p className="text-[10px] text-text-secondary mt-2">
                Will output pages at <code className="text-electric bg-electric/10 px-1 rounded">/locations/[service]/[city]</code>
              </p>
            </div>

            <button 
                onClick={generatePages}
                disabled={isGenerating || !service || !citiesInput.trim()}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-electric to-rose-glow text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(45,110,255,0.3)] hover:shadow-[0_0_30px_rgba(45,110,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                   <span className="flex items-center gap-2">
                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating {progress}%
                   </span>
                ) : (
                  <><Play className="w-4 h-4 fill-current" /> Initialize Factory</>
                )}
            </button>
          </div>
        </div>

        {/* Live Output Panel */}
        <div className="glass-card flex flex-col border border-glass-border">
          <div className="border-b border-glass-border p-4 bg-black/20 flex items-center justify-between">
             <h3 className="text-sm font-bold text-white flex items-center gap-2">
               <Globe className="w-4 h-4 text-emerald-400" />
               Deployment Log
             </h3>
             <span className="px-2 py-1 bg-onyx/50 rounded-md text-[10px] font-bold text-text-secondary uppercase tracking-wider border border-glass-border">
               {results.length} Routes Generated
             </span>
          </div>

          <div className="p-4 flex-1 h-[400px] overflow-y-auto font-mono text-xs">
            {results.length === 0 && !isGenerating ? (
               <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50">
                 <Layers className="w-8 h-8 mb-2" />
                 <p>Awaiting deployment orders</p>
               </div>
            ) : (
               <div className="space-y-2">
                 {results.map((res, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2 rounded bg-black/30 border border-glass-border/50"
                    >
                      <span className="text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%]">
                        {res.url}
                      </span>
                      {res.status === "Generated" ? (
                        <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 rounded">200 OK</span>
                      ) : (
                        <span className="text-rose-glow font-bold bg-rose-glow/10 px-2 rounded">500 ERR</span>
                      )}
                    </motion.div>
                 ))}
                 {isGenerating && (
                    <div className="flex items-center gap-2 p-2 text-text-secondary animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-electric" />
                      Generating next route...
                    </div>
                 )}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
