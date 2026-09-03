import { LocalStorageAdapter } from './localStorageAdapter';
import type { StorageAdapter } from './types';

export type { StorageAdapter } from './types';
export * from './schema';

let adapter: StorageAdapter | null = null;

/**
 * Single place that decides which persistence backend is live.
 * Swap to `new SupabaseStorageAdapter(...)` here (or branch on an env flag)
 * when the app graduates to Vercel + Supabase — nothing else changes.
 */
export function getStorage(): StorageAdapter {
  if (!adapter) adapter = new LocalStorageAdapter();
  return adapter;
}
