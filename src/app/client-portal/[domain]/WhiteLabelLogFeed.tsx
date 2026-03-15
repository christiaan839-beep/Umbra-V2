"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Target, MapPin, CheckCircle2 } from "lucide-react";

interface PortalMetricEvent {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export default function WhiteLabelLogFeed({ clientId, primaryColor }: { clientId: string, primaryColor: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/portal/metrics?tenantId=${clientId}`);
        const data = await res.json();
        
        if (!data.success) throw new Error(data.error);

        let formattedLogs = (data.recentEvents || []).map((event: PortalMetricEvent) => {
          let type = "scan";
          let action = "System Action";
          const payloadStr = JSON.stringify(event.payload);
          
          if (event.eventType.includes("programmatic") || event.eventType.includes("seo")) {
            type = "seo"; action = "SEO Page Generated";
          } else if (event.eventType.includes("lead") || event.eventType.includes("social") || event.eventType.includes("closer")) {
            type = "comms"; action = "Swarm Outreach Executed";
          } else if (event.eventType === "revenue_secured") {
            type = "auth"; action = "High-Ticket Capital Secured";
          }

          const parsedTime = event.timestamp ? new Date(event.timestamp) : new Date();

          return {
            id: event.id,
            action,
            detail: `Telemetry Event: ${event.eventType}. Matrix execution logged successfully.`,
            type,
            time: parsedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        });

        if (formattedLogs.length === 0) {
          formattedLogs = [{ id: "1", action: "System Initialized", detail: "A.I. Neural Matrix active. Awaiting first autonomous cycle.", type: "auth", time: "Just Now" }];
        }

        setLogs(formattedLogs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, [clientId]);

  if (loading) return <div className="p-6 text-sm text-neutral-500 animate-pulse">Syncing Telemetry...</div>;

  return (
    <>
      {logs.map((log, i) => (
        <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (i * 0.1) }} className="relative flex gap-6 mt-6 first:mt-0">
          <div className="w-6 h-6 rounded-full bg-black/60 border border-white/10 flex-shrink-0 z-10 flex items-center justify-center mt-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            {log.type === "comms" && <MessageCircle className="w-3 h-3 text-neutral-300" />}
            {log.type === "seo" && <MapPin className="w-3 h-3 text-neutral-300" />}
            {log.type === "scan" && <Target className="w-3 h-3 text-neutral-300" />}
            {log.type === "auth" && <CheckCircle2 className="w-3 h-3" style={{ color: primaryColor }} />}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-sm font-bold text-white tracking-wide">{log.action}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{log.time}</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-lg line-clamp-2">{log.detail}</p>
          </div>
        </motion.div>
      ))}
    </>
  );
}
