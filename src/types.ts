// ---------------------------------------------------------------------------
// Domain types. Content shapes (Phase, DocMeta, ...) are authored data;
// user-state shapes (TaskState, ChecklistState, ...) live behind the storage
// abstraction so they can move from localStorage to Supabase unchanged.
// ---------------------------------------------------------------------------

export type PhaseId =
  | 'phase-00'
  | 'phase-01'
  | 'phase-02'
  | 'phase-03'
  | 'phase-04'
  | 'phase-05'
  | 'menu'
  | 'costing'
  | 'operations'
  | 'growth';

export interface Phase {
  id: PhaseId;
  order: number;
  code: string; // e.g. "Phase 03"
  title: string; // Bangla title
  summary: string;
  milestone?: MilestoneId;
}

export type Category =
  | 'Foundation'
  | 'Market Research'
  | 'Location & Kitchen'
  | 'Legal & Compliance'
  | 'Equipment'
  | 'Menu'
  | 'Finance'
  | 'Procurement'
  | 'Operations'
  | 'Marketing'
  | 'Customer';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface DocMeta {
  id: string;
  slug: string;
  title: string;
  summary: string;
  phase: PhaseId;
  category: Category;
  tags: string[];
  difficulty: Difficulty;
  readingMinutes: number;
  relatedDocs?: string[];
  relatedTasks?: string[];
  /** Raw markdown body. */
  content: string;
}

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'blocked' | 'done';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface TaskSeed {
  id: string;
  task: string;
  category: Category;
  phase: PhaseId;
  priority: Priority;
  status: TaskStatus;
  dependency?: string;
  notes?: string;
  completionCriteria: string;
  dueDate?: string;
}

/** Per-task mutable state kept in storage; merged over the seed at read time. */
export interface TaskOverride {
  status?: TaskStatus;
  notes?: string;
  dueDate?: string;
  updatedAt: string;
}

export type Task = TaskSeed & { updatedAt?: string; custom?: boolean };

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Checklist {
  id: string;
  title: string;
  description: string;
  phase: PhaseId;
  items: ChecklistItem[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  full?: string;
  definition: string; // Bangla
  related?: string[];
}

export type MilestoneId =
  | 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5'
  | 'M6' | 'M7' | 'M8' | 'M9' | 'M10' | 'M11';

export interface Milestone {
  id: MilestoneId;
  title: string;
  description: string;
}

export interface RoadmapVersion {
  version: string;
  title: string;
  scope: string[];
  status: 'current' | 'next' | 'planned';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url?: string;
  kind: 'official' | 'tool' | 'reference';
  verifyNote?: string;
}

export interface DecisionEntry {
  id: string;
  decision: string;
  reason: string;
  date: string;
  status: 'active' | 'superseded' | 'reverted';
  createdAt: string;
}

// --- V3: Kitchen data (recipes / ingredients / suppliers) -----------------

export type IngredientUnit = 'kg' | 'litre' | 'dozen' | 'piece' | 'packet';

export interface Ingredient {
  id: string;
  name: string;
  unit: IngredientUnit;
  /** ₹ per unit (per kg, per litre, per dozen, per piece, per packet). */
  price: number;
  supplierId?: string | null;
  notes?: string;
  updatedAt: string;
}

export interface SupplierItem {
  id: string;
  item: string;
  price: number;
  unit: string;
  quality?: string;
  moq?: string;
  deliveryDays?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  paymentTerms?: string;
  /** 1 (poor) – 5 (excellent). */
  reliability: number;
  isBackup?: boolean;
  notes?: string;
  items: SupplierItem[];
  updatedAt: string;
}

export interface RecipeLine {
  id: string;
  /** Ref into the ingredient library; null = ad-hoc line with manualCost. */
  ingredientId: string | null;
  label: string;
  /** grams/ml when the ingredient is priced per kg/litre; otherwise a count. */
  qty: number;
  manualCost?: number;
}

export interface Recipe {
  id: string;
  name: string;
  isHero?: boolean;
  lines: RecipeLine[];
  sellingPrice: number;
  packagingCost: number;
  commissionPct: number;
  overheadCost: number;
  prepMinutes?: number;
  cookMinutes?: number;
  targetMarginPct?: number;
  sopNotes?: string;
  updatedAt: string;
}

/** Keys for the generic list-collection storage API. */
export type CollectionKey = 'ingredients' | 'suppliers' | 'recipes';

// --- Search ---------------------------------------------------------------

export type SearchKind =
  | 'documentation'
  | 'task'
  | 'checklist'
  | 'glossary'
  | 'recipe'
  | 'ingredient'
  | 'supplier'
  | 'calculator'
  | 'decision';

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  excerpt: string;
  to: string;
  phase?: PhaseId;
  category?: string;
  score: number;
}
