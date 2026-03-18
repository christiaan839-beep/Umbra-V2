import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Required for Edge Environments (Vercel)
// We rely on the DATABASE_URL environment variable to hold the Neon connection string.
// During Vercel's static build phase, env vars may be undefined, so we inject a safe fallback bypass.
const connectionString = process.env.DATABASE_URL || 'postgresql://sovereign:bypass@localhost/dummy';
const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
