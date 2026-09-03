import type { TaskOverride } from '../../types';

export type { DecisionEntry } from '../../types';

export type TaskOverrideMap = Record<string, TaskOverride>;

/** checklistId -> itemId -> done */
export type ChecklistState = Record<string, Record<string, boolean>>;

/** docId -> { read, readAt } */
export type DocProgressMap = Record<string, { read: boolean; readAt?: string }>;

/** calculator id -> its serialised input state (shape owned by the page) */
export type CalculatorState = Record<string, unknown>;

export interface Settings {
  /** 'dark' only for MVP; kept for the future light theme. */
  theme: 'dark' | 'light';
  bnHeavy: boolean;
  compact: boolean;
  lastVisitedPhase?: string;
  /** Estimate only — used for P&L commission projections. */
  platformCommissionPct: number;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  bnHeavy: true,
  compact: false,
  platformCommissionPct: 22,
};

/**
 * Bare storage keys. The adapter prepends a scope prefix:
 *  - `dr.`            — legacy / single-user (backwards compatible)
 *  - `dr.u.<userId>.` — a per-user workspace (temporary login wrapper)
 */
export const KEYS = {
  taskOverrides: 'taskOverrides',
  customTasks: 'customTasks',
  checklist: 'checklistState',
  docProgress: 'docProgress',
  decisions: 'decisions',
  calculators: 'calculators',
  ingredients: 'ingredients',
  suppliers: 'suppliers',
  recipes: 'recipes',
  dailyLogs: 'dailyLogs',
  expenses: 'expenses',
  stockMoves: 'stockMoves',
} as const;

/**
 * Theme / density live here, unscoped — they are a device preference, not
 * workspace data, and the pre-paint script in index.html reads this key.
 */
export const GLOBAL_SETTINGS_KEY = 'dr.settings';

/** Maps a CollectionKey to its (bare) storage key. */
export const COLLECTION_KEYS = {
  ingredients: KEYS.ingredients,
  suppliers: KEYS.suppliers,
  recipes: KEYS.recipes,
  dailyLogs: KEYS.dailyLogs,
  expenses: KEYS.expenses,
  stockMoves: KEYS.stockMoves,
} as const;

/** The keys migrated from a legacy `dr.*` layout into a user's first workspace. */
export const MIGRATABLE_KEYS = Object.values(KEYS);

export const SCHEMA_VERSION = 4;
