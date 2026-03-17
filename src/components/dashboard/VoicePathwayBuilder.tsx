"use client";

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { 
    id: '1', 
    position: { x: 250, y: 50 }, 
    data: { label: 'Incoming Call / Target Lead' }, 
    type: 'input',
    style: { background: '#000', color: '#fff', border: '1px solid rgba(0, 183, 255, 0.4)', borderRadius: '8px', padding: '10px 20px', fontSize: '12px', fontWeight: 'bold' } 
  },
  { 
    id: '2', 
    position: { x: 100, y: 150 }, 
    data: { label: 'Execute Pitch: SEO Audit' }, 
    style: { background: '#000', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '10px 20px', fontSize: '12px' } 
  },
  { 
    id: '3', 
    position: { x: 400, y: 150 }, 
    data: { label: 'Handle Objection: "Busy"' }, 
    style: { background: '#000', color: '#fff', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '8px', padding: '10px 20px', fontSize: '12px' } 
  },
  { 
    id: '4', 
    position: { x: 250, y: 250 }, 
    data: { label: 'Book Calendar Meeting' }, 
    type: 'output',
    style: { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '8px', padding: '10px 20px', fontSize: '12px', fontWeight: 'bold' } 
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Answers Phone', style: { stroke: '#00B7FF' }, animated: true },
  { id: 'e1-3', source: '1', target: '3', label: 'Goes to Voicemail', style: { stroke: '#F43F5E' } },
  { id: 'e2-4', source: '2', target: '4', label: 'Lead Agrees', style: { stroke: '#10B981' }, animated: true },
  { id: 'e3-4', source: '3', target: '4', label: 'Responds to SMS later', style: { stroke: '#10B981' } },
];

export function VoicePathwayBuilder() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-full min-h-[500px] border border-white/10 rounded-xl overflow-hidden bg-black relative">
      <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/10 flex items-center px-4 justify-between z-10 backdrop-blur-md">
         <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
         </div>
         <div className="text-[10px] text-stone-500 uppercase tracking-widest font-mono font-bold flex items-center gap-2">
            Visual Pathway Configurator
         </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-black"
        colorMode="dark"
      >
        <Controls className="bg-black/80 border border-white/10 fill-white" />
        <MiniMap nodeStrokeWidth={3} nodeColor="#222" maskColor="rgba(0,0,0,0.6)" className="bg-black border border-white/10" />
        <Background color="#00B7FF" gap={20} variant={BackgroundVariant.Dots} size={1} />
      </ReactFlow>
    </div>
  );
}
