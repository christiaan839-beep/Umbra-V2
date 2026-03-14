import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Required for Edge Environments (Vercel)
// We rely on the DATABASE_URL environment variable to hold the Neon connection string
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
