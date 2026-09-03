import type { CollectionKey, TaskSeed } from '../../types';
import type { StorageAdapter } from './types';
import {
  COLLECTION_KEYS,
  DEFAULT_SETTINGS,
  KEYS,
  SCHEMA_VERSION,
  type CalculatorState,
  type ChecklistState,
  type DecisionEntry,
  type DocProgressMap,
  type Settings,
  type TaskOverrideMap,
} from './schema';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — degrade to in-memory silently */
  }
}

/**
 * Browser-local persistence for the MVP (GitHub Pages friendly, no backend).
 * Implements the same StorageAdapter contract a Supabase adapter will.
 */
export class LocalStorageAdapter implements StorageAdapter {
  readonly name = 'localStorage';

  async getTaskOverrides(): Promise<TaskOverrideMap> {
    return read<TaskOverrideMap>(KEYS.taskOverrides, {});
  }

  async setTaskOverride(id: string, patch: TaskOverrideMap[string] | null): Promise<void> {
    const all = await this.getTaskOverrides();
    if (patch === null) delete all[id];
    else all[id] = patch;
    write(KEYS.taskOverrides, all);
  }

  async getCustomTasks(): Promise<TaskSeed[]> {
    return read<TaskSeed[]>(KEYS.customTasks, []);
  }

  async saveCustomTask(task: TaskSeed): Promise<void> {
    const all = await this.getCustomTasks();
    const idx = all.findIndex((t) => t.id === task.id);
    if (idx >= 0) all[idx] = task;
    else all.push(task);
    write(KEYS.customTasks, all);
  }

  async deleteCustomTask(id: string): Promise<void> {
    write(
      KEYS.customTasks,
      (await this.getCustomTasks()).filter((t) => t.id !== id),
    );
  }

  async getChecklistState(): Promise<ChecklistState> {
    return read<ChecklistState>(KEYS.checklist, {});
  }

  async toggleChecklistItem(checklistId: string, itemId: string, done: boolean): Promise<void> {
    const all = await this.getChecklistState();
    all[checklistId] = { ...(all[checklistId] ?? {}), [itemId]: done };
    write(KEYS.checklist, all);
  }

  async getDocProgress(): Promise<DocProgressMap> {
    return read<DocProgressMap>(KEYS.docProgress, {});
  }

  async setDocRead(docId: string, read_: boolean): Promise<void> {
    const all = await this.getDocProgress();
    all[docId] = { read: read_, readAt: read_ ? new Date().toISOString() : undefined };
    write(KEYS.docProgress, all);
  }

  async getDecisions(): Promise<DecisionEntry[]> {
    return read<DecisionEntry[]>(KEYS.decisions, []);
  }

  async saveDecision(entry: DecisionEntry): Promise<void> {
    const all = await this.getDecisions();
    const idx = all.findIndex((d) => d.id === entry.id);
    if (idx >= 0) all[idx] = entry;
    else all.unshift(entry);
    write(KEYS.decisions, all);
  }

  async deleteDecision(id: string): Promise<void> {
    write(KEYS.decisions, (await this.getDecisions()).filter((d) => d.id !== id));
  }

  async getSettings(): Promise<Settings> {
    return { ...DEFAULT_SETTINGS, ...read<Partial<Settings>>(KEYS.settings, {}) };
  }

  async setSettings(patch: Partial<Settings>): Promise<void> {
    write(KEYS.settings, { ...(await this.getSettings()), ...patch });
  }

  async getCalculatorState(): Promise<CalculatorState> {
    return read<CalculatorState>(KEYS.calculators, {});
  }

  async setCalculatorState(id: string, value: unknown): Promise<void> {
    const all = await this.getCalculatorState();
    all[id] = value;
    write(KEYS.calculators, all);
  }

  async getList<T = unknown>(key: CollectionKey): Promise<T[]> {
    return read<T[]>(COLLECTION_KEYS[key], []);
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
    write(COLLECTION_KEYS[key], all);
  }

  async deleteListItem(key: CollectionKey, id: string): Promise<void> {
    write(
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
    if (data.taskOverrides) write(KEYS.taskOverrides, data.taskOverrides);
    if (data.customTasks) write(KEYS.customTasks, data.customTasks);
    if (data.checklistState) write(KEYS.checklist, data.checklistState);
    if (data.docProgress) write(KEYS.docProgress, data.docProgress);
    if (data.decisions) write(KEYS.decisions, data.decisions);
    if (data.settings) write(KEYS.settings, data.settings);
    if (data.calculators) write(KEYS.calculators, data.calculators);
    if (data.ingredients) write(KEYS.ingredients, data.ingredients);
    if (data.suppliers) write(KEYS.suppliers, data.suppliers);
    if (data.recipes) write(KEYS.recipes, data.recipes);
    if (data.dailyLogs) write(KEYS.dailyLogs, data.dailyLogs);
    if (data.expenses) write(KEYS.expenses, data.expenses);
    if (data.stockMoves) write(KEYS.stockMoves, data.stockMoves);
  }

  async clearAll(): Promise<void> {
    Object.values(KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    });
  }
}
