import type { TaskOverride } from '../../types';

export type { DecisionEntry } from '../../types';

export type TaskOverrideMap = Record<string, TaskOverride>;

/** checklistId -> itemId -> done */
export type ChecklistState = Record<string, Record<string, boolean>>;

/** docId -> { read, readAt } */
export type DocProgressMap = Record<string, { read: boolean; readAt?: string }>;

export interface Settings {
  /** 'dark' only for MVP; kept for the future light theme. */
  theme: 'dark' | 'light';
  bnHeavy: boolean;
  compact: boolean;
  lastVisitedPhase?: string;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  bnHeavy: true,
  compact: false,
};

/** Storage keys — namespaced so a future multi-tenant Supabase row maps cleanly. */
export const KEYS = {
  taskOverrides: 'dr.taskOverrides',
  customTasks: 'dr.customTasks',
  checklist: 'dr.checklistState',
  docProgress: 'dr.docProgress',
  decisions: 'dr.decisions',
  settings: 'dr.settings',
} as const;

export const SCHEMA_VERSION = 1;
