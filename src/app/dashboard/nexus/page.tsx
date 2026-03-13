"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, Play, Plus, Trash2, ArrowRight, Settings2, 
  Workflow, Zap, Smartphone, Megaphone, TerminalSquare, AlertTriangle, Activity, RefreshCw 
} from "lucide-react";

type NodeType = "trigger" | "action" | "condition";

interface PipelineNode {
  id: string;
  type: NodeType;
  label: string;
  icon: any;
  color: string;
}

const AVAILABLE_NODES: PipelineNode[] = [
  { id: "t_stripe", type: "trigger", label: "Stripe Webhook", icon: Zap, color: "from-blue-500 to-indigo-500" },
  { id: "t_schedule", type: "trigger", label: "Daily CRON", icon: Activity, color: "from-purple-500 to-pink-500" },
  { id: "a_voice", type: "action", label: "Voice Extraction", icon: Smartphone, color: "from-electric to-rose-glow" },
  { id: "a_ads", type: "action", label: "Meta Ad Injector", icon: Megaphone, color: "from-cyan-500 to-blue-500" },
  { id: "c_qualify", type: "condition", label: "If Qualified > 80%", icon: AlertTriangle, color: "from-amber-500 to-orange-500" },
  { id: "a_opt", type: "action", label: "Meta-Cognition Review", icon: Network, color: "from-emerald-400 to-teal-500" },
];

export default function NexusOrchestrator() {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<any[]>([]);

  const addNode = (node: PipelineNode) => {
      setNodes([...nodes, { ...node, id: `${node.id}_${Date.now()}` }]);
  };

  const removeNode = (id: string) => {
      setNodes(nodes.filter(n => n.id !== id));
  };

  const executePipeline = async () => {
      if (nodes.length === 0) return;
      setIsExecuting(true);
      setExecutionLog([]);

      try {
          const res = await fetch("/api/swarm/nexus/execute", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ workflowName: "Commander's Custom Flow", nodes })
          });

          const data = await res.json();
          if (data.success) {
              setExecutionLog(data.data.cascadeLog);
          }
      } catch (e) {
          console.error("Pipeline Execution Failed", e);
      } finally {
          setIsExecuting(false);
      }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-midnight text-white font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glass-border pb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                    <Workflow className="text-electric w-8 h-8" />
                    The Nexus
                </h1>
                <p className="text-text-secondary uppercase tracking-widest text-xs mt-2">Agentic Workflow Orchestrator</p>
            </div>
            <div className="flex items-center gap-4">
                 <button 
                     onClick={executePipeline}
                     disabled={isExecuting || nodes.length === 0}
                     className="px-6 py-3 bg-gradient-to-r from-electric to-rose-glow rounded-md text-white font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(45,110,255,0.3)]"
                 >
                     {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                     Execute Pipeline
                 </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Node Palette Sidebar */}
            <div className="col-span-1 border border-glass-border bg-onyx/30 backdrop-blur-md rounded-xl p-6 h-fit max-h-[800px] overflow-y-auto">
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-glass-border pb-4">
                    <Plus className="w-4 h-4 text-electric" /> Component Palette
                </h2>

                <div className="space-y-6">
                    {/* Triggers */}
                    <div>
                        <h3 className="text-[10px] uppercase text-text-secondary tracking-widest mb-3">Triggers</h3>
                        <div className="space-y-2">
                            {AVAILABLE_NODES.filter(n => n.type === 'trigger').map(node => (
                                <button key={node.id} onClick={() => addNode(node)} className="w-full text-left p-3 rounded bg-midnight/50 border border-glass-border hover:border-electric transition-colors flex items-center gap-3 group">
                                    <div className={`p-2 rounded bg-gradient-to-br ${node.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                        <node.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold">{node.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <h3 className="text-[10px] uppercase text-text-secondary tracking-widest mb-3">Swarm Actions</h3>
                        <div className="space-y-2">
                            {AVAILABLE_NODES.filter(n => n.type === 'action').map(node => (
                                <button key={node.id} onClick={() => addNode(node)} className="w-full text-left p-3 rounded bg-midnight/50 border border-glass-border hover:border-electric transition-colors flex items-center gap-3 group">
                                    <div className={`p-2 rounded bg-gradient-to-br ${node.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                        <node.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold">{node.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                     {/* Conditions */}
                     <div>
                        <h3 className="text-[10px] uppercase text-text-secondary tracking-widest mb-3">Logic Gates</h3>
                        <div className="space-y-2">
                            {AVAILABLE_NODES.filter(n => n.type === 'condition').map(node => (
                                <button key={node.id} onClick={() => addNode(node)} className="w-full text-left p-3 rounded bg-midnight/50 border border-glass-border hover:border-electric transition-colors flex items-center gap-3 group">
                                    <div className={`p-2 rounded bg-gradient-to-br ${node.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                        <node.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold">{node.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Workspace */}
            <div className="col-span-1 lg:col-span-3 border border-dashed border-glass-border bg-midnight/30 rounded-xl relative overflow-hidden min-h-[600px] flex">
                
                {/* Canvas Grid Background */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                {nodes.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary z-10 p-12 text-center">
                         <div className="w-20 h-20 rounded-full border border-dashed border-glass-border flex items-center justify-center mb-6">
                            <Workflow className="w-8 h-8 opacity-20" />
                         </div>
                         <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-2">Initialize Canvas</h3>
                         <p className="text-xs max-w-md mx-auto leading-relaxed">Construct a custom cognitive pipeline. Select Triggers, Swarm Actions, and Logic Gates from the component palette to orchestrate autonomous behavior.</p>
                    </div>
                ) : (
                    <div className="flex-1 p-12 overflow-x-auto overflow-y-hidden flex items-center gap-4 z-10">
                        <AnimatePresence mode="popLayout">
                            {nodes.map((node, index) => (
                                <div key={node.id} className="flex items-center shrink-0">
                                    
                                    {/* Node Card */}
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                        className="relative w-64 bg-onyx/80 backdrop-blur-md border border-glass-border rounded-xl shadow-2xl overflow-hidden group"
                                    >
                                        <div className={`h-1 w-full bg-gradient-to-r ${node.color}`} />
                                        
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-lg bg-gradient-to-br ${node.color} shadow-lg`}>
                                                    <node.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <button onClick={() => removeNode(node.id)} className="text-text-secondary hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            <p className="text-[10px] uppercase tracking-widest text-text-secondary mb-1">{node.type}</p>
                                            <h3 className="text-sm font-bold">{node.label}</h3>
                                        </div>

                                        {/* Execution Status Overlay */}
                                        {executionLog.find(l => l.nodeId === node.id) && (
                                            <div className="absolute bottom-0 left-0 w-full p-2 bg-emerald-500/20 border-t border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 backdrop-blur-md">
                                                <Activity className="w-3 h-3" /> Executed
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Visual Connection Arrow */}
                                    {index < nodes.length - 1 && (
                                         <div className="px-4 text-electric/50 flex flex-col items-center justify-center relative">
                                            <ArrowRight className="w-6 h-6 animate-pulse" />
                                            {isExecuting && (
                                                <motion.div 
                                                    initial={{ width: 0 }} 
                                                    animate={{ width: "100%" }} 
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                    className="absolute h-[2px] bg-electric top-1/2 -translate-y-1/2 left-0 shadow-[0_0_10px_rgba(45,110,255,0.8)]"
                                                />
                                            )}
                                         </div>
                                    )}
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Live Console Output Overlay */}
                <AnimatePresence>
                    {(executionLog.length > 0 || isExecuting) && (
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="absolute bottom-0 left-0 w-full h-1/3 bg-midnight/95 border-t border-glass-border backdrop-blur-xl z-20 overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-midnight/90 p-3 border-b border-glass-border flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><TerminalSquare className="w-4 h-4 text-electric" /> Nexus Execution Matrix</span>
                                {isExecuting && <span className="text-[10px] text-electric animate-pulse">Cascading payloads...</span>}
                            </div>
                            <div className="p-4 space-y-2 font-sans text-sm">
                                {executionLog.map((log, i) => (
                                    <div key={i} className="flex gap-4 opacity-80 hover:opacity-100 transition-opacity">
                                        <span className="text-text-secondary shrink-0">{i + 1}.</span>
                                        <span className="text-electric shrink-0">[{log.label}]</span>
                                        <span className={log.details.includes('Failed') ? 'text-rose-400' : 'text-emerald-400'}>{log.details}</span>
                                    </div>
                                ))}
                                {isExecuting && <div className="text-text-secondary animate-pulse ml-8">_</div>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    </div>
  );
}
