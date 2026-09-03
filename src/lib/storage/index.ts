import { LocalStorageAdapter } from './localStorageAdapter';
import { MIGRATABLE_KEYS } from './schema';
import type { StorageAdapter } from './types';

export type { StorageAdapter } from './types';
export * from './schema';

const adapters = new Map<string, StorageAdapter>();

/**
 * Single place that decides which persistence backend is live.
 * `scope` namespaces the data ('dr.' legacy single-user, 'dr.u.<id>.' per user).
 * Swap to `new SupabaseStorageAdapter(scope)` here when the app graduates to
 * Vercel + Supabase — nothing else changes.
 */
export function getStorage(scope = 'dr.'): StorageAdapter {
  let a = adapters.get(scope);
  if (!a) {
    a = new LocalStorageAdapter(scope);
    adapters.set(scope, a);
  }
  return a;
}

/**
 * One-time: copy legacy top-level `dr.<key>` workspace data into `targetScope`
 * if that scope is still empty. Used when the first login-wrapper user is
 * created, so an existing tester keeps their work.
 */
export function migrateLegacyWorkspace(targetScope: string): void {
  if (targetScope === 'dr.') return;
  try {
    const alreadyHasData = MIGRATABLE_KEYS.some(
      (k) => localStorage.getItem(targetScope + k) != null,
    );
    if (alreadyHasData) return;
    for (const k of MIGRATABLE_KEYS) {
      const legacy = localStorage.getItem('dr.' + k);
      if (legacy != null) localStorage.setItem(targetScope + k, legacy);
    }
  } catch {
    /* ignore */
  }
}
