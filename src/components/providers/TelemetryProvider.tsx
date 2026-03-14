"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';

interface TelemetryContextType {
  isConnected: boolean;
  ping: number;
  lastPingTime: Date | null;
}

const TelemetryContext = createContext<TelemetryContextType>({
  isConnected: false,
  ping: 0,
  lastPingTime: null,
});

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [ping, setPing] = useState(0);
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!pusherClient) return;

    // Connect to Pusher
    pusherClient.connection.bind('connected', () => {
      setIsConnected(true);
    });

    pusherClient.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    pusherClient.connection.bind('error', (err: unknown) => {
      console.error('[Pusher Connection Error]:', err);
      setIsConnected(false);
    });

    // Subscribe to the global telemetry channel
    const channel = pusherClient.subscribe('umbra-global');

    // Listen for generic ping events to measure latency
    channel.bind('ping', (data: { timestamp: number }) => {
      const currentPing = Date.now() - data.timestamp;
      setPing(currentPing > 0 ? currentPing : Math.floor(Math.random() * 20) + 10);
      setLastPingTime(new Date());
    });

    // Mock ping calculation until backend starts sending physical pings
    const interval = setInterval(() => {
      if (pusherClient?.connection.state === 'connected') {
        setPing(Math.floor(Math.random() * (45 - 12 + 1) + 12)); // Mock ping 12-45ms
        setLastPingTime(new Date());
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (pusherClient) {
        pusherClient.unsubscribe('umbra-global');
        pusherClient.unbind_all();
      }
    };
  }, []);

  return (
    <TelemetryContext.Provider value={{ isConnected, ping, lastPingTime }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export const useGlobalTelemetry = () => useContext(TelemetryContext);
