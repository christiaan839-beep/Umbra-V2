"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

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
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to the physical Render WebSocket URL in production
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'https://umbra-sockets.onrender.com';
    socketRef.current = io(wsUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Simulate ping calculation since we don't have a dedicated ping/pong handshake yet
    const interval = setInterval(() => {
      if (socketRef.current?.connected) {
        setPing(Math.floor(Math.random() * (45 - 12 + 1) + 12)); // Mock ping 12-45ms
        setLastPingTime(new Date());
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <TelemetryContext.Provider value={{ isConnected, ping, lastPingTime }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export const useGlobalTelemetry = () => useContext(TelemetryContext);
