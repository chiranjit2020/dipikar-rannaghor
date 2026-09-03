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

/** Storage keys — namespaced so a future multi-tenant Supabase row maps cleanly. */
export const KEYS = {
  taskOverrides: 'dr.taskOverrides',
  customTasks: 'dr.customTasks',
  checklist: 'dr.checklistState',
  docProgress: 'dr.docProgress',
  decisions: 'dr.decisions',
  settings: 'dr.settings',
  calculators: 'dr.calculators',
  ingredients: 'dr.ingredients',
  suppliers: 'dr.suppliers',
  recipes: 'dr.recipes',
  dailyLogs: 'dr.dailyLogs',
  expenses: 'dr.expenses',
  stockMoves: 'dr.stockMoves',
} as const;

/** Maps a CollectionKey to its localStorage key. */
export const COLLECTION_KEYS = {
  ingredients: KEYS.ingredients,
  suppliers: KEYS.suppliers,
  recipes: KEYS.recipes,
  dailyLogs: KEYS.dailyLogs,
  expenses: KEYS.expenses,
  stockMoves: KEYS.stockMoves,
} as const;

export const SCHEMA_VERSION = 3;
