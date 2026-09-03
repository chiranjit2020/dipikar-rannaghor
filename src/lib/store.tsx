import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { checklists } from '../content/checklists';
import { documents } from '../content/documents';
import { phases } from '../content/phases';
import { taskSeeds } from '../content/todos';
import type {
  CollectionKey,
  DailyLog,
  DecisionEntry,
  Expense,
  Ingredient,
  PhaseId,
  Recipe,
  StockMove,
  Supplier,
  Task,
  TaskSeed,
  TaskStatus,
} from '../types';
import { pct } from './format';
import {
  DEFAULT_SETTINGS,
  getStorage,
  type CalculatorState,
  type ChecklistState,
  type DocProgressMap,
  type Settings,
  type TaskOverrideMap,
} from './storage';

interface StoreValue {
  ready: boolean;
  storageName: string;

  tasks: Task[];
  setTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  setTaskNotes: (id: string, notes: string) => Promise<void>;
  addTask: (seed: Omit<TaskSeed, 'id' | 'status'> & { status?: TaskStatus }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  checklistState: ChecklistState;
  toggleChecklistItem: (checklistId: string, itemId: string, done: boolean) => Promise<void>;

  docProgress: DocProgressMap;
  setDocRead: (docId: string, read: boolean) => Promise<void>;

  decisions: DecisionEntry[];
  saveDecision: (entry: DecisionEntry) => Promise<void>;
  deleteDecision: (id: string) => Promise<void>;

  settings: Settings;
  setSettings: (patch: Partial<Settings>) => Promise<void>;

  calculatorState: CalculatorState;
  setCalculatorState: (id: string, value: unknown) => Promise<void>;

  ingredients: Ingredient[];
  suppliers: Supplier[];
  recipes: Recipe[];
  dailyLogs: DailyLog[];
  expenses: Expense[];
  stockMoves: StockMove[];
  saveItem: <T extends { id: string }>(key: CollectionKey, item: T) => Promise<void>;
  saveItems: <T extends { id: string }>(key: CollectionKey, items: T[]) => Promise<void>;
  deleteItem: (key: CollectionKey, id: string) => Promise<void>;

  refresh: () => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

function mergeTasks(overrides: TaskOverrideMap, custom: TaskSeed[]): Task[] {
  const base: Task[] = taskSeeds.map((seed) => {
    const o = overrides[seed.id];
    return o
      ? { ...seed, status: o.status ?? seed.status, notes: o.notes ?? seed.notes, dueDate: o.dueDate ?? seed.dueDate, updatedAt: o.updatedAt }
      : { ...seed };
  });
  const customTasks: Task[] = custom.map((c) => {
    const o = overrides[c.id];
    return { ...c, custom: true, ...(o ? { status: o.status ?? c.status, notes: o.notes ?? c.notes, dueDate: o.dueDate ?? c.dueDate, updatedAt: o.updatedAt } : {}) };
  });
  return [...base, ...customTasks];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const storage = useMemo(() => getStorage(), []);
  const [ready, setReady] = useState(false);
  const [overrides, setOverrides] = useState<TaskOverrideMap>({});
  const [custom, setCustom] = useState<TaskSeed[]>([]);
  const [checklistState, setChecklistState] = useState<ChecklistState>({});
  const [docProgress, setDocProgress] = useState<DocProgressMap>({});
  const [decisions, setDecisions] = useState<DecisionEntry[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [calculatorState, setCalcState] = useState<CalculatorState>({});
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stockMoves, setStockMoves] = useState<StockMove[]>([]);

  const refresh = useCallback(async () => {
    const [ov, cu, cl, dp, de, se, ca, ing, sup, rec, dl, ex, sm] = await Promise.all([
      storage.getTaskOverrides(),
      storage.getCustomTasks(),
      storage.getChecklistState(),
      storage.getDocProgress(),
      storage.getDecisions(),
      storage.getSettings(),
      storage.getCalculatorState(),
      storage.getList<Ingredient>('ingredients'),
      storage.getList<Supplier>('suppliers'),
      storage.getList<Recipe>('recipes'),
      storage.getList<DailyLog>('dailyLogs'),
      storage.getList<Expense>('expenses'),
      storage.getList<StockMove>('stockMoves'),
    ]);
    setOverrides(ov);
    setCustom(cu);
    setChecklistState(cl);
    setDocProgress(dp);
    setDecisions(de);
    setSettingsState(se);
    setCalcState(ca);
    setIngredients(ing);
    setSuppliers(sup);
    setRecipes(rec);
    setDailyLogs(dl);
    setExpenses(ex);
    setStockMoves(sm);
    setReady(true);
  }, [storage]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const tasks = useMemo(() => mergeTasks(overrides, custom), [overrides, custom]);

  const setTaskStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      const prev = overrides[id];
      const patch = { ...prev, status, updatedAt: new Date().toISOString() };
      setOverrides((o) => ({ ...o, [id]: patch }));
      await storage.setTaskOverride(id, patch);
    },
    [overrides, storage],
  );

  const setTaskNotes = useCallback(
    async (id: string, notes: string) => {
      const prev = overrides[id];
      const patch = { ...prev, notes, updatedAt: new Date().toISOString() };
      setOverrides((o) => ({ ...o, [id]: patch }));
      await storage.setTaskOverride(id, patch);
    },
    [overrides, storage],
  );

  const addTask = useCallback<StoreValue['addTask']>(
    async (seed) => {
      const task: TaskSeed = {
        id: `t-custom-${Date.now().toString(36)}`,
        status: seed.status ?? 'todo',
        ...seed,
      };
      setCustom((c) => [...c, task]);
      await storage.saveCustomTask(task);
    },
    [storage],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      setCustom((c) => c.filter((t) => t.id !== id));
      setOverrides((o) => {
        const next = { ...o };
        delete next[id];
        return next;
      });
      await storage.deleteCustomTask(id);
      await storage.setTaskOverride(id, null);
    },
    [storage],
  );

  const toggleChecklistItem = useCallback<StoreValue['toggleChecklistItem']>(
    async (checklistId, itemId, done) => {
      setChecklistState((s) => ({ ...s, [checklistId]: { ...(s[checklistId] ?? {}), [itemId]: done } }));
      await storage.toggleChecklistItem(checklistId, itemId, done);
    },
    [storage],
  );

  const setDocRead = useCallback<StoreValue['setDocRead']>(
    async (docId, read) => {
      setDocProgress((p) => ({ ...p, [docId]: { read, readAt: read ? new Date().toISOString() : undefined } }));
      await storage.setDocRead(docId, read);
    },
    [storage],
  );

  const saveDecision = useCallback<StoreValue['saveDecision']>(
    async (entry) => {
      setDecisions((d) => {
        const idx = d.findIndex((x) => x.id === entry.id);
        if (idx >= 0) {
          const next = [...d];
          next[idx] = entry;
          return next;
        }
        return [entry, ...d];
      });
      await storage.saveDecision(entry);
    },
    [storage],
  );

  const deleteDecision = useCallback<StoreValue['deleteDecision']>(
    async (id) => {
      setDecisions((d) => d.filter((x) => x.id !== id));
      await storage.deleteDecision(id);
    },
    [storage],
  );

  const setSettings = useCallback<StoreValue['setSettings']>(
    async (patch) => {
      setSettingsState((s) => ({ ...s, ...patch }));
      await storage.setSettings(patch);
    },
    [storage],
  );

  const setCalculatorState = useCallback<StoreValue['setCalculatorState']>(
    async (id, value) => {
      setCalcState((s) => ({ ...s, [id]: value }));
      await storage.setCalculatorState(id, value);
    },
    [storage],
  );

  const applyLocal = useCallback(
    (key: CollectionKey, fn: (prev: { id: string }[]) => { id: string }[]) => {
      const setters: Record<CollectionKey, (fn: (p: never[]) => never[]) => void> = {
        ingredients: setIngredients as never,
        suppliers: setSuppliers as never,
        recipes: setRecipes as never,
        dailyLogs: setDailyLogs as never,
        expenses: setExpenses as never,
        stockMoves: setStockMoves as never,
      };
      setters[key]((p) => fn(p as { id: string }[]) as never);
    },
    [],
  );

  const saveItem = useCallback<StoreValue['saveItem']>(
    async (key, item) => {
      applyLocal(key, (prev) => {
        const idx = prev.findIndex((x) => x.id === item.id);
        if (idx < 0) return [...prev, item];
        const next = [...prev];
        next[idx] = item;
        return next;
      });
      await storage.saveListItem(key, item);
    },
    [applyLocal, storage],
  );

  const saveItems = useCallback<StoreValue['saveItems']>(
    async (key, items) => {
      applyLocal(key, (prev) => {
        const next = [...prev];
        for (const item of items) {
          const idx = next.findIndex((x) => x.id === item.id);
          if (idx < 0) next.push(item);
          else next[idx] = item;
        }
        return next;
      });
      await storage.saveListItems(key, items);
    },
    [applyLocal, storage],
  );

  const deleteItem = useCallback<StoreValue['deleteItem']>(
    async (key, id) => {
      applyLocal(key, (prev) => prev.filter((x) => x.id !== id));
      await storage.deleteListItem(key, id);
    },
    [applyLocal, storage],
  );

  const value: StoreValue = {
    ready,
    storageName: storage.name,
    tasks,
    setTaskStatus,
    setTaskNotes,
    addTask,
    deleteTask,
    checklistState,
    toggleChecklistItem,
    docProgress,
    setDocRead,
    decisions,
    saveDecision,
    deleteDecision,
    settings,
    setSettings,
    calculatorState,
    setCalculatorState,
    ingredients,
    suppliers,
    recipes,
    dailyLogs,
    expenses,
    stockMoves,
    saveItem,
    saveItems,
    deleteItem,
    refresh,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within <StoreProvider>');
  return ctx;
}

// --- Derived selectors ----------------------------------------------------

export interface ProgressSummary {
  learningPct: number;
  executionPct: number;
  docsRead: number;
  docsTotal: number;
  tasksDone: number;
  tasksTotal: number;
  openTasks: number;
  criticalOpen: number;
  inProgress: number;
  checklistDone: number;
  checklistTotal: number;
}

export function useProgress(): ProgressSummary {
  const { tasks, docProgress, checklistState } = useStore();

  return useMemo(() => {
    const docsTotal = documents.length;
    const docsRead = documents.filter((d) => docProgress[d.id]?.read).length;

    const executable = tasks;
    const tasksTotal = executable.length;
    const tasksDone = executable.filter((t) => t.status === 'done').length;
    const openTasks = executable.filter((t) => t.status !== 'done').length;
    const criticalOpen = executable.filter((t) => t.status !== 'done' && t.priority === 'critical').length;
    const inProgress = executable.filter((t) => t.status === 'in-progress').length;

    let checklistTotal = 0;
    let checklistDone = 0;
    for (const c of checklists) {
      checklistTotal += c.items.length;
      const st = checklistState[c.id] ?? {};
      checklistDone += c.items.filter((i) => st[i.id]).length;
    }

    return {
      learningPct: pct(docsRead, docsTotal),
      executionPct: pct(tasksDone, tasksTotal),
      docsRead,
      docsTotal,
      tasksDone,
      tasksTotal,
      openTasks,
      criticalOpen,
      inProgress,
      checklistDone,
      checklistTotal,
    };
  }, [tasks, docProgress, checklistState]);
}

export interface PhaseProgress {
  phase: PhaseId;
  code: string;
  title: string;
  tasksTotal: number;
  tasksDone: number;
  docsTotal: number;
  docsRead: number;
  pctValue: number;
}

export function usePhaseProgress(): PhaseProgress[] {
  const { tasks, docProgress } = useStore();

  return useMemo(
    () =>
      phases.map((p) => {
        const pt = tasks.filter((t) => t.phase === p.id);
        const pd = documents.filter((d) => d.phase === p.id);
        const tasksDone = pt.filter((t) => t.status === 'done').length;
        const docsRead = pd.filter((d) => docProgress[d.id]?.read).length;
        const total = pt.length + pd.length;
        const done = tasksDone + docsRead;
        return {
          phase: p.id,
          code: p.code,
          title: p.title,
          tasksTotal: pt.length,
          tasksDone,
          docsTotal: pd.length,
          docsRead,
          pctValue: pct(done, total),
        };
      }),
    [tasks, docProgress],
  );
}

/** Current phase = first phase that is not fully complete. */
export function useCurrentPhase(): PhaseProgress {
  const phaseProgress = usePhaseProgress();
  return useMemo(
    () => phaseProgress.find((p) => p.pctValue < 100) ?? phaseProgress[phaseProgress.length - 1],
    [phaseProgress],
  );
}
