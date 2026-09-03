import type {
  DailyLog,
  Expense,
  ExpenseCategory,
  Ingredient,
  StockMove,
} from '../types';

// --- Date ranges --------------------------------------------------------

export type PeriodKey = 'week' | 'month' | 'last30' | 'all';

export interface Period {
  key: PeriodKey;
  label: string;
  from: string; // inclusive YYYY-MM-DD ('' = open)
  to: string; // inclusive YYYY-MM-DD
  days: number;
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function makePeriod(key: PeriodKey, today = new Date()): Period {
  const to = iso(today);
  if (key === 'all') return { key, label: 'All time', from: '', to, days: 0 };
  if (key === 'last30') {
    const f = new Date(today);
    f.setDate(f.getDate() - 29);
    return { key, label: 'Last 30 days', from: iso(f), to, days: 30 };
  }
  if (key === 'week') {
    const f = new Date(today);
    const dow = (f.getDay() + 6) % 7; // Monday = 0
    f.setDate(f.getDate() - dow);
    return { key, label: 'This week', from: iso(f), to, days: dow + 1 };
  }
  // month
  const f = new Date(today.getFullYear(), today.getMonth(), 1);
  return { key, label: 'This month', from: iso(f), to, days: today.getDate() };
}

export const PERIODS: PeriodKey[] = ['week', 'month', 'last30', 'all'];

function inPeriod(date: string, p: Period): boolean {
  if (p.from && date < p.from) return false;
  if (date > p.to) return false;
  return true;
}

// --- P&L ---------------------------------------------------------------

export interface PnL {
  orders: number;
  ordersByPlatform: { zomato: number; swiggy: number; direct: number };
  grossSales: number;
  discountOwn: number;
  refunds: number;
  netSales: number; // gross - discount - refunds
  estCommission: number; // netSales * commissionPct (platform orders share)
  estNetRevenue: number;
  aov: number;
  expensesByCategory: Record<string, number>;
  totalExpenses: number;
  marketingFromLogs: number;
  estProfit: number; // estNetRevenue - totalExpenses
  daysWithData: number;
}

export function buildPnL(
  logs: DailyLog[],
  expenses: Expense[],
  period: Period,
  commissionPct: number,
): PnL {
  const pl = logs.filter((l) => inPeriod(l.date, period));
  const ex = expenses.filter((e) => inPeriod(e.date, period));

  const z = sum(pl, (l) => l.ordersZomato);
  const s = sum(pl, (l) => l.ordersSwiggy);
  const d = sum(pl, (l) => l.ordersDirect);
  const orders = z + s + d;
  const grossSales = sum(pl, (l) => l.grossSales);
  const discountOwn = sum(pl, (l) => l.discountOwn);
  const refunds = sum(pl, (l) => l.refunds);
  const marketingFromLogs = sum(pl, (l) => l.marketingSpend);
  const netSales = grossSales - discountOwn - refunds;

  // Commission only applies to the platform-order share of gross sales.
  const platformShare = orders > 0 ? (z + s) / orders : 0;
  const estCommission = (netSales * platformShare * commissionPct) / 100;
  const estNetRevenue = netSales - estCommission;

  const expensesByCategory: Record<string, number> = {};
  for (const e of ex) {
    expensesByCategory[e.category] = (expensesByCategory[e.category] ?? 0) + e.amount;
  }
  const totalExpenses = ex.reduce((a, e) => a + e.amount, 0);

  return {
    orders,
    ordersByPlatform: { zomato: z, swiggy: s, direct: d },
    grossSales,
    discountOwn,
    refunds,
    netSales,
    estCommission,
    estNetRevenue,
    aov: orders > 0 ? grossSales / orders : 0,
    expensesByCategory,
    totalExpenses,
    marketingFromLogs,
    estProfit: estNetRevenue - totalExpenses,
    daysWithData: pl.length,
  };
}

function sum<T>(arr: T[], f: (x: T) => number): number {
  return arr.reduce((a, x) => a + (f(x) || 0), 0);
}

// --- Inventory --------------------------------------------------------

export interface StockLevel {
  ingredient: Ingredient;
  onHand: number;
  reorderLevel: number;
  low: boolean;
  lastMove?: string;
}

const SIGN: Record<StockMove['kind'], number> = {
  purchase: 1,
  adjustment: 1, // qty may be negative for corrections
  consumption: -1,
  wastage: -1,
};

export function stockLevels(
  ingredients: Ingredient[],
  moves: StockMove[],
): StockLevel[] {
  const byIng = new Map<string, StockMove[]>();
  for (const m of moves) {
    if (!byIng.has(m.ingredientId)) byIng.set(m.ingredientId, []);
    byIng.get(m.ingredientId)!.push(m);
  }
  return ingredients
    .map((ing) => {
      const ms = (byIng.get(ing.id) ?? []).sort((a, b) => a.date.localeCompare(b.date));
      const onHand = ms.reduce((a, m) => a + SIGN[m.kind] * m.qty, 0);
      const reorderLevel = ing.reorderLevel ?? 0;
      return {
        ingredient: ing,
        onHand,
        reorderLevel,
        low: reorderLevel > 0 && onHand <= reorderLevel,
        lastMove: ms.at(-1)?.date,
      };
    })
    .sort((a, b) => Number(b.low) - Number(a.low) || a.ingredient.name.localeCompare(b.ingredient.name));
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Rent',
  'Salary',
  'Utilities',
  'Ingredients / Purchase',
  'Packaging',
  'Equipment',
  'Marketing',
  'Platform / Ads',
  'Licenses',
  'Maintenance',
  'Miscellaneous',
];
