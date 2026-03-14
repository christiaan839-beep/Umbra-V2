import React from 'react';
import SwarmClientGrid from './SwarmClientGrid';
import { db } from '../../../db';
import { globalTelemetry, activeSwarms } from '../../../db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SwarmDashboard() {
  let ingestionCount = 0;
  let activeNodesCount = 0;
  
  try {
    const [telemetryResult, swarmResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(globalTelemetry),
      db.select({ count: sql<number>`count(*)` }).from(activeSwarms)
    ]);
    
    ingestionCount = telemetryResult[0]?.count || 0;
    activeNodesCount = swarmResult[0]?.count || 0;
  } catch (error) {
    console.error("[Swarm Postgres DB Error] Could not parse telemetry:", error);
  }

  // Multiply by 7.4 (mock baseline) to simulate a "Rate" based on raw row count
  const ingestionRate = Math.max(12, ingestionCount * 7.4);

  return (
    <SwarmClientGrid 
       initialIngestionRate={ingestionRate} 
       activeNodesCount={activeNodesCount} 
    />
  );
}
