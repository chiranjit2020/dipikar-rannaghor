import type {
  CalculatorState,
  ChecklistState,
  DecisionEntry,
  Settings,
  TaskOverrideMap,
  DocProgressMap,
} from './schema';

/**
 * The whole persistence contract for the app. The MVP ships a
 * localStorage implementation; a SupabaseStorageAdapter can implement the
 * same interface later without touching application/business logic.
 *
 * All methods are async on purpose so a network-backed adapter is a drop-in.
 */
export interface StorageAdapter {
  readonly name: string;

  getTaskOverrides(): Promise<TaskOverrideMap>;
  setTaskOverride(id: string, patch: TaskOverrideMap[string] | null): Promise<void>;

  getCustomTasks(): Promise<import('../../types').TaskSeed[]>;
  saveCustomTask(task: import('../../types').TaskSeed): Promise<void>;
  deleteCustomTask(id: string): Promise<void>;

  getChecklistState(): Promise<ChecklistState>;
  toggleChecklistItem(checklistId: string, itemId: string, done: boolean): Promise<void>;

  getDocProgress(): Promise<DocProgressMap>;
  setDocRead(docId: string, read: boolean): Promise<void>;

  getDecisions(): Promise<DecisionEntry[]>;
  saveDecision(entry: DecisionEntry): Promise<void>;
  deleteDecision(id: string): Promise<void>;

  getSettings(): Promise<Settings>;
  setSettings(patch: Partial<Settings>): Promise<void>;

  getCalculatorState(): Promise<CalculatorState>;
  setCalculatorState(id: string, value: unknown): Promise<void>;

  /** Generic list collections (ingredients, suppliers, recipes). */
  getList<T = unknown>(key: import('../../types').CollectionKey): Promise<T[]>;
  saveListItem<T extends { id: string }>(
    key: import('../../types').CollectionKey,
    item: T,
  ): Promise<void>;
  /** Upsert many items in one read-merge-write (avoids races on bulk insert). */
  saveListItems<T extends { id: string }>(
    key: import('../../types').CollectionKey,
    items: T[],
  ): Promise<void>;
  deleteListItem(key: import('../../types').CollectionKey, id: string): Promise<void>;

  /** Full export/import for backup + future migration to the cloud. */
  exportAll(): Promise<Record<string, unknown>>;
  importAll(data: Record<string, unknown>): Promise<void>;
  clearAll(): Promise<void>;
}
