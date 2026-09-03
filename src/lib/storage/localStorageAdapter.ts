import type { CollectionKey, TaskSeed } from '../../types';
import type { StorageAdapter } from './types';
import {
  COLLECTION_KEYS,
  DEFAULT_SETTINGS,
  GLOBAL_SETTINGS_KEY,
  KEYS,
  SCHEMA_VERSION,
  type CalculatorState,
  type ChecklistState,
  type DecisionEntry,
  type DocProgressMap,
  type Settings,
  type TaskOverrideMap,
} from './schema';

function readRaw<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeRaw(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — degrade to in-memory silently */
  }
}

/**
 * Browser-local persistence. Implements the same StorageAdapter contract a
 * Supabase adapter will. Workspace data is namespaced by `scope`
 * (`dr.` legacy, `dr.u.<userId>.` per user); theme/density stay global.
 */
export class LocalStorageAdapter implements StorageAdapter {
  readonly name: string;
  private readonly scope: string;

  constructor(scope = 'dr.') {
    this.scope = scope;
    this.name = scope === 'dr.' ? 'localStorage' : `localStorage · ${scope}`;
  }

  private k(bareKey: string): string {
    return this.scope + bareKey;
  }

  private rd<T>(bareKey: string, fallback: T): T {
    return readRaw(this.k(bareKey), fallback);
  }

  private wr(bareKey: string, value: unknown): void {
    writeRaw(this.k(bareKey), value);
  }

  async getTaskOverrides(): Promise<TaskOverrideMap> {
    return this.rd<TaskOverrideMap>(KEYS.taskOverrides, {});
  }

  async setTaskOverride(id: string, patch: TaskOverrideMap[string] | null): Promise<void> {
    const all = await this.getTaskOverrides();
    if (patch === null) delete all[id];
    else all[id] = patch;
    this.wr(KEYS.taskOverrides, all);
  }

  async getCustomTasks(): Promise<TaskSeed[]> {
    return this.rd<TaskSeed[]>(KEYS.customTasks, []);
  }

  async saveCustomTask(task: TaskSeed): Promise<void> {
    const all = await this.getCustomTasks();
    const idx = all.findIndex((t) => t.id === task.id);
    if (idx >= 0) all[idx] = task;
    else all.push(task);
    this.wr(KEYS.customTasks, all);
  }

  async deleteCustomTask(id: string): Promise<void> {
    this.wr(
      KEYS.customTasks,
      (await this.getCustomTasks()).filter((t) => t.id !== id),
    );
  }

  async getChecklistState(): Promise<ChecklistState> {
    return this.rd<ChecklistState>(KEYS.checklist, {});
  }

  async toggleChecklistItem(checklistId: string, itemId: string, done: boolean): Promise<void> {
    const all = await this.getChecklistState();
    all[checklistId] = { ...(all[checklistId] ?? {}), [itemId]: done };
    this.wr(KEYS.checklist, all);
  }

  async getDocProgress(): Promise<DocProgressMap> {
    return this.rd<DocProgressMap>(KEYS.docProgress, {});
  }

  async setDocRead(docId: string, read_: boolean): Promise<void> {
    const all = await this.getDocProgress();
    all[docId] = { read: read_, readAt: read_ ? new Date().toISOString() : undefined };
    this.wr(KEYS.docProgress, all);
  }

  async getDecisions(): Promise<DecisionEntry[]> {
    return this.rd<DecisionEntry[]>(KEYS.decisions, []);
  }

  async saveDecision(entry: DecisionEntry): Promise<void> {
    const all = await this.getDecisions();
    const idx = all.findIndex((d) => d.id === entry.id);
    if (idx >= 0) all[idx] = entry;
    else all.unshift(entry);
    this.wr(KEYS.decisions, all);
  }

  async deleteDecision(id: string): Promise<void> {
    this.wr(KEYS.decisions, (await this.getDecisions()).filter((d) => d.id !== id));
  }

  // Settings are global (device preference) — not scoped.
  async getSettings(): Promise<Settings> {
    return { ...DEFAULT_SETTINGS, ...readRaw<Partial<Settings>>(GLOBAL_SETTINGS_KEY, {}) };
  }

  async setSettings(patch: Partial<Settings>): Promise<void> {
    writeRaw(GLOBAL_SETTINGS_KEY, { ...(await this.getSettings()), ...patch });
  }

  async getCalculatorState(): Promise<CalculatorState> {
    return this.rd<CalculatorState>(KEYS.calculators, {});
  }

  async setCalculatorState(id: string, value: unknown): Promise<void> {
    const all = await this.getCalculatorState();
    all[id] = value;
    this.wr(KEYS.calculators, all);
  }

  async getList<T = unknown>(key: CollectionKey): Promise<T[]> {
    return this.rd<T[]>(COLLECTION_KEYS[key], []);
  }

  async saveListItem<T extends { id: string }>(key: CollectionKey, item: T): Promise<void> {
    await this.saveListItems(key, [item]);
  }

  async saveListItems<T extends { id: string }>(key: CollectionKey, items: T[]): Promise<void> {
    const all = await this.getList<T>(key);
    for (const item of items) {
      const idx = all.findIndex((x) => x.id === item.id);
      if (idx >= 0) all[idx] = item;
      else all.push(item);
    }
    this.wr(COLLECTION_KEYS[key], all);
  }

  async deleteListItem(key: CollectionKey, id: string): Promise<void> {
    this.wr(
      COLLECTION_KEYS[key],
      (await this.getList<{ id: string }>(key)).filter((x) => x.id !== id),
    );
  }

  async exportAll(): Promise<Record<string, unknown>> {
    return {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      taskOverrides: await this.getTaskOverrides(),
      customTasks: await this.getCustomTasks(),
      checklistState: await this.getChecklistState(),
      docProgress: await this.getDocProgress(),
      decisions: await this.getDecisions(),
      settings: await this.getSettings(),
      calculators: await this.getCalculatorState(),
      ingredients: await this.getList('ingredients'),
      suppliers: await this.getList('suppliers'),
      recipes: await this.getList('recipes'),
      dailyLogs: await this.getList('dailyLogs'),
      expenses: await this.getList('expenses'),
      stockMoves: await this.getList('stockMoves'),
    };
  }

  async importAll(data: Record<string, unknown>): Promise<void> {
    if (data.taskOverrides) this.wr(KEYS.taskOverrides, data.taskOverrides);
    if (data.customTasks) this.wr(KEYS.customTasks, data.customTasks);
    if (data.checklistState) this.wr(KEYS.checklist, data.checklistState);
    if (data.docProgress) this.wr(KEYS.docProgress, data.docProgress);
    if (data.decisions) this.wr(KEYS.decisions, data.decisions);
    if (data.settings) writeRaw(GLOBAL_SETTINGS_KEY, data.settings);
    if (data.calculators) this.wr(KEYS.calculators, data.calculators);
    if (data.ingredients) this.wr(KEYS.ingredients, data.ingredients);
    if (data.suppliers) this.wr(KEYS.suppliers, data.suppliers);
    if (data.recipes) this.wr(KEYS.recipes, data.recipes);
    if (data.dailyLogs) this.wr(KEYS.dailyLogs, data.dailyLogs);
    if (data.expenses) this.wr(KEYS.expenses, data.expenses);
    if (data.stockMoves) this.wr(KEYS.stockMoves, data.stockMoves);
  }

  /** Clears this workspace's data — leaves global settings and the auth layer alone. */
  async clearAll(): Promise<void> {
    Object.values(KEYS).forEach((k) => {
      try {
        localStorage.removeItem(this.k(k));
      } catch {
        /* ignore */
      }
    });
  }
}
