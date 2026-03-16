"use client";

import React, { useState, useEffect, useRef } from "react";
import { CopySlash, Save, Loader2, Sparkles, FileText, UploadCloud, Play, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import PdfExportButton from "@/components/ui/PdfExportButton";

export default function CustomSkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", description: "", systemPrompt: "" });
  
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await fetch("/api/skills/custom");
      const data = await res.json();
      setSkills(data.skills || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setNewSkill(prev => ({
        ...prev,
        name: prev.name || file.name.replace(".txt", "").replace(".md", ""),
        systemPrompt: text
      }));
    };
    reader.readAsText(file);
  };

  const saveSkill = async () => {
    if (!newSkill.name || !newSkill.systemPrompt) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/skills/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill)
      });
      if (res.ok) {
        setNewSkill({ name: "", description: "", systemPrompt: "" });
        loadSkills();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteSkill = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/skills/custom?id=${id}`, { method: "DELETE" });
      if (selectedSkill?.id === id) setSelectedSkill(null);
      loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const executeSkill = async () => {
    if (!selectedSkill || !prompt) return;
    setIsExecuting(true);
    setResult(null);
    try {
      const res = await fetch("/api/skills/custom/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: selectedSkill.id, prompt })
      });
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3 h-3" /> Agent Factory
        </div>
        <h1 className="text-3xl font-bold serif-text text-white">Custom Skill Packs</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-2xl">
          Instantly deploy specialized AI agents by uploading Anthropic-style prompt files. No coding required. The Swarm will automatically route to your local node if configured.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border border-glass-border">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-violet-400" /> Install Skill Pack
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Agent Name</label>
                <input 
                  type="text" 
                  value={newSkill.name}
                  onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="e.g. Legal Contract Reviewer"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Capabilities (Optional)</label>
                <input 
                  type="text" 
                  value={newSkill.description}
                  onChange={e => setNewSkill({...newSkill, description: e.target.value})}
                  placeholder="e.g. Analyzes NDAs and SaaS agreements"
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex justify-between">
                  <span>System Prompt File (.txt)</span>
                  <button onClick={() => fileInputRef.current?.click()} className="text-violet-400 hover:text-white transition-colors">Browse</button>
                </label>
                <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md" onChange={handleFileUpload} />
                <textarea 
                  value={newSkill.systemPrompt}
                  onChange={e => setNewSkill({...newSkill, systemPrompt: e.target.value})}
                  placeholder="Paste instructions here or upload a file..."
                  rows={4}
                  className="w-full bg-onyx/50 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-400 font-mono text-xs"
                />
              </div>

              <button 
                onClick={saveSkill}
                disabled={isCreating || !newSkill.name || !newSkill.systemPrompt}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl px-4 py-3 text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Install Custom Agent
              </button>
            </div>
          </div>

          <div className="glass-card p-0 border border-glass-border overflow-hidden">
            <div className="bg-onyx/80 px-4 py-3 border-b border-glass-border">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Active Skill Packs</h3>
            </div>
            {isLoading ? (
               <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
            ) : skills.length === 0 ? (
               <div className="p-8 text-center text-sm text-neutral-500">No custom skills installed.</div>
            ) : (
              <div className="divide-y divide-glass-border max-h-[300px] overflow-y-auto">
                {skills.map(skill => (
                  <div 
                    key={skill.id} 
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors group flex justify-between items-start ${selectedSkill?.id === skill.id ? 'bg-violet-500/10' : ''}`}
                  >
                    <div>
                      <h4 className={`text-sm font-bold ${selectedSkill?.id === skill.id ? 'text-violet-400' : 'text-white'}`}>{skill.name}</h4>
                      {skill.description && <p className="text-xs text-text-secondary mt-1 line-clamp-1">{skill.description}</p>}
                    </div>
                    <button onClick={(e) => deleteSkill(skill.id, e)} className="text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedSkill ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              <div className="glass-card p-6 border-violet-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedSkill.name}</h2>
                    <p className="text-xs text-violet-400 uppercase tracking-wider font-bold">Ready for deployment</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Client Request / Task</label>
                  <textarea 
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Enter the task details you want this custom agent to execute..."
                    rows={4}
                    className="w-full bg-black/40 border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-400 transition-colors"
                  />
                  <div className="flex justify-end mt-3">
                    <button 
                      onClick={executeSkill}
                      disabled={isExecuting || !prompt}
                      className="flex items-center gap-2 bg-white text-black rounded-xl px-6 py-2.5 text-sm font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                      {isExecuting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Play className="w-4 h-4" /> Run Execution</>}
                    </button>
                  </div>
                </div>
              </div>

              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-0 border-glass-border overflow-hidden" id="report-content">
                  <div className="flex items-center justify-between bg-onyx/80 px-6 py-4 border-b border-glass-border">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-violet-400" /> Agent Output
                    </h3>
                    <div className="flex gap-2 print:hidden">
                      <PdfExportButton fileName={`${selectedSkill.name.replace(/\s+/g, "_")}_Report`} />
                    </div>
                  </div>
                  <div className="p-6 bg-black/50 overflow-x-auto text-sm text-white whitespace-pre-wrap leading-relaxed">
                    {result}
                  </div>
                </motion.div>
              )}

            </motion.div>
          ) : (
             <div className="h-full min-h-[500px] glass-card flex flex-col items-center justify-center text-center p-8 border border-glass-border border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-onyx/50 border border-glass-border flex items-center justify-center mb-4">
                <CopySlash className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Agent Selected</h3>
              <p className="text-sm text-text-secondary max-w-sm">
                Install a new Custom Skill Pack from the panel on the left or select an active agent to begin execution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
