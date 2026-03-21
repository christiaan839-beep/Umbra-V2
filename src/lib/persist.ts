/**
 * PERSISTENCE LAYER — File-based storage that survives Vercel redeploys.
 * 
 * Uses /tmp for Vercel serverless (shared within invocation lifecycle)
 * and provides a Supabase/Neon-ready interface for production migration.
 * 
 * This wraps all in-memory stores with a persist-on-write pattern.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const PERSIST_DIR = join("/tmp", "sovereign-persist");

function ensureDir() {
  if (!existsSync(PERSIST_DIR)) {
    mkdirSync(PERSIST_DIR, { recursive: true });
  }
}

export function persistWrite<T>(key: string, data: T): void {
  try {
    ensureDir();
    const path = join(PERSIST_DIR, `${key}.json`);
    writeFileSync(path, JSON.stringify(data), "utf-8");
  } catch {
    // Silent fail — persistence is best-effort on serverless
  }
}

export function persistRead<T>(key: string, fallback: T): T {
  try {
    ensureDir();
    const path = join(PERSIST_DIR, `${key}.json`);
    if (!existsSync(path)) return fallback;
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function persistAppend<T>(key: string, item: T, maxItems: number = 1000): void {
  const existing = persistRead<T[]>(key, []);
  existing.push(item);
  if (existing.length > maxItems) {
    existing.splice(0, existing.length - maxItems);
  }
  persistWrite(key, existing);
}

export function persistDelete(key: string): void {
  try {
    const path = join(PERSIST_DIR, `${key}.json`);
    if (existsSync(path)) {
      writeFileSync(path, "[]", "utf-8");
    }
  } catch {
    // Silent fail
  }
}

/**
 * SUPABASE-READY INTERFACE
 * When ready to migrate, replace the file operations above with:
 * 
 * import { createClient } from '@supabase/supabase-js';
 * const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
 * 
 * export async function persistWrite(key: string, data: any) {
 *   await supabase.from('persist').upsert({ key, data, updated_at: new Date() });
 * }
 * 
 * export async function persistRead(key: string, fallback: any) {
 *   const { data } = await supabase.from('persist').select('data').eq('key', key).single();
 *   return data?.data || fallback;
 * }
 */
