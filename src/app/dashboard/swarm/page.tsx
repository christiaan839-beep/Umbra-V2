import React from 'react';
import SwarmClientGrid from './SwarmClientGrid';
import { db } from '../../../lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SwarmDashboard() {
  let ingestionCount = 0;
  let activeNodesCount = 0;
  
  try {
    // In MVP mode, read from the local UMBRA memory store instead of Postgres.
    // Simulating database latency telemetry for the edge cluster nodes.
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Extrapolate general volume from active users to simulate DB load
    const userCount = db.users.count() || 1;
    ingestionCount = userCount * 14; 
    activeNodesCount = Math.max(3, Math.floor(userCount * 1.5));
  } catch (error) {
    console.error("[Swarm MVP DB Error] Could not read telemetry:", error);
  }

  // Multiply by a factor to simulate a "Rate" based on raw row count
  const ingestionRate = Math.max(12, ingestionCount * 7.4);

  return (
    <SwarmClientGrid 
       initialIngestionRate={ingestionRate} 
       activeNodesCount={activeNodesCount} 
    />
  );
}
