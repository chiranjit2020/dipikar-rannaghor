import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../components/PageHeader';
import { IconFlag, IconPlus, IconTrash } from '../components/icons';
import { todayISO, uid } from '../lib/format';
import { useStore } from '../lib/store';

const rupee = (n: number) =>
  `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

/** Debounced write-through so every keystroke doesn't hit storage. */
function usePersist<T>(id: string, state: T) {
  const { setCalculatorState } = useStore();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => void setCalculatorState(id, state), 400);
    return () => clearTimeout(t);
  }, [id, state, setCalculatorState]);
}

function useSaveDecision() {
  const { saveDecision } = useStore();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const save = (decision: string, reason: string) => {
    void saveDecision({
      id: uid('dec'),
      decision,
      reason,
      date: todayISO(),
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  return { save, saved, goToLog: () => navigate('/decisions') };
}

function NumField({
  label,
  value,
  onChange,
  suffix,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="field"
        />
        {suffix && <span className="text-sm text-ink-muted">{suffix}</span>}
      </div>
    </label>
  );
}

function Result({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-tint/[0.02] px-4 py-3">
      <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">{label}</p>
      <p className={`mt-0.5 text-xl font-semibold ${tone ?? 'text-ink'}`}>{value}</p>
    </div>
  );
}

function SaveToLog({
  onSave,
  saved,
  goToLog,
}: {
  onSave: () => void;
  saved: boolean;
  goToLog: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button className="btn-ghost" onClick={onSave}>
        <IconFlag className="h-4 w-4" /> Save result to Decision Log
      </button>
      {saved && (
        <span className="text-xs text-good">
          Saved.{' '}
          <button className="link" onClick={goToLog}>
            Decision Log খোলো →
          </button>
        </span>
      )}
    </div>
  );
}

interface BreakEvenState {
  fixed: number;
  aov: number;
  variable: number;
  days: number;
}
const BE_DEFAULT: BreakEvenState = { fixed: 40000, aov: 230, variable: 150, days: 26 };

function BreakEven({ initial }: { initial?: Partial<BreakEvenState> }) {
  const [s, setS] = useState<BreakEvenState>({ ...BE_DEFAULT, ...initial });
  usePersist('breakEven', s);
  const { save, saved, goToLog } = useSaveDecision();
  const set = (patch: Partial<BreakEvenState>) => setS((p) => ({ ...p, ...patch }));

  const contribution = s.aov - s.variable;
  const monthlyOrders = contribution > 0 ? s.fixed / contribution : Infinity;
  const dailyOrders = monthlyOrders / Math.max(1, s.days);
  const revenue = monthlyOrders * s.aov;

  return (
    <section id="breakeven" className="card p-5">
      <h2 className="text-lg">Break-even Calculator</h2>
      <p className="mt-1 text-sm text-ink-muted">
        দিনে কতগুলো order না হলে ওই মাসে লোকসান — সেটা বের করো।
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <NumField label="Monthly Fixed Cost" value={s.fixed} onChange={(v) => set({ fixed: v })} step={500} suffix="₹" />
        <NumField label="Average Order Value (AOV)" value={s.aov} onChange={(v) => set({ aov: v })} step={5} suffix="₹" />
        <NumField label="Variable Cost / order (food + packaging + commission)" value={s.variable} onChange={(v) => set({ variable: v })} step={5} suffix="₹" />
        <NumField label="চালু দিন / মাস" value={s.days} onChange={(v) => set({ days: v })} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Result label="Contribution / order" value={rupee(contribution)} tone={contribution <= 0 ? 'text-bad' : 'text-good'} />
        <Result
          label="Break-even orders / month"
          value={Number.isFinite(monthlyOrders) ? Math.ceil(monthlyOrders).toString() : '— (contribution ≤ 0)'}
        />
        <Result
          label="Break-even orders / day"
          value={Number.isFinite(dailyOrders) ? Math.ceil(dailyOrders).toString() : '—'}
          tone="text-saffron-soft"
        />
        <Result label="Break-even revenue / month" value={Number.isFinite(revenue) ? rupee(Math.round(revenue)) : '—'} />
      </div>

      {contribution <= 0 && (
        <p className="mt-4 rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
          Contribution ০ বা তার নিচে — এই দামে যত বিক্রি, তত লোকসান। Variable cost কমাও বা price বাড়াও।
        </p>
      )}

      <SaveToLog
        saved={saved}
        goToLog={goToLog}
        onSave={() =>
          save(
            `Break-even ≈ ${Number.isFinite(dailyOrders) ? Math.ceil(dailyOrders) : '—'} orders/day (${
              Number.isFinite(monthlyOrders) ? Math.ceil(monthlyOrders) : '—'
            }/month, ${Number.isFinite(revenue) ? rupee(Math.round(revenue)) : '—'} revenue/month)`,
            `Break-even Calculator: Fixed ${rupee(s.fixed)}/month, AOV ${rupee(s.aov)}, variable ${rupee(
              s.variable,
            )}/order → contribution ${rupee(contribution)}/order over ${s.days} working days. (${todayISO()})`,
          )
        }
      />
    </section>
  );
}

interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unitCost: number;
  perKg: boolean;
}
interface FoodCostState {
  rows: Ingredient[];
  price: number;
  packaging: number;
  commissionPct: number;
  overhead: number;
}
const FC_DEFAULT: FoodCostState = {
  rows: [
    { id: 'i1', name: 'Chicken', qty: 180, unitCost: 240, perKg: true },
    { id: 'i2', name: 'Basmati rice', qty: 150, unitCost: 120, perKg: true },
    { id: 'i3', name: 'Onion / oil / spices', qty: 1, unitCost: 22, perKg: false },
  ],
  price: 199,
  packaging: 12,
  commissionPct: 22,
  overhead: 6,
};

function FoodCost({ initial }: { initial?: Partial<FoodCostState> }) {
  const [s, setS] = useState<FoodCostState>({ ...FC_DEFAULT, ...initial });
  usePersist('foodCost', s);
  const { save, saved, goToLog } = useSaveDecision();

  const foodCost = useMemo(
    () =>
      s.rows.reduce(
        (sum, r) => sum + (r.perKg ? (r.qty / 1000) * r.unitCost : r.qty * r.unitCost),
        0,
      ),
    [s.rows],
  );
  const commission = (s.price * s.commissionPct) / 100;
  const variable = foodCost + s.packaging + commission + s.overhead;
  const contribution = s.price - variable;
  const foodCostPct = s.price > 0 ? (foodCost / s.price) * 100 : 0;

  const update = (id: string, patch: Partial<Ingredient>) =>
    setS((p) => ({ ...p, rows: p.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));

  return (
    <section id="foodcost" className="card p-5">
      <h2 className="text-lg">Food Cost Calculator</h2>
      <p className="mt-1 text-sm text-ink-muted">
        নিজের ingredient দাম বসাও — food cost, contribution ও Food Cost % পাও।
      </p>

      <div className="mt-4 space-y-2">
        <div className="hidden grid-cols-[1fr_5rem_6rem_4rem_2rem] gap-2 px-1 text-[0.7rem] uppercase tracking-wider text-ink-muted sm:grid">
          <span>Ingredient</span><span>Qty</span><span>Unit cost</span><span>/kg?</span><span />
        </div>
        {s.rows.map((r) => (
          <div key={r.id} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_5rem_6rem_4rem_2rem]">
            <input className="field" placeholder="নাম" value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} />
            <input className="field" type="number" value={r.qty} onChange={(e) => update(r.id, { qty: parseFloat(e.target.value) || 0 })} />
            <input className="field" type="number" value={r.unitCost} onChange={(e) => update(r.id, { unitCost: parseFloat(e.target.value) || 0 })} />
            <label className="flex items-center justify-center rounded-xl border border-hairline bg-surface-2/60">
              <input type="checkbox" checked={r.perKg} onChange={(e) => update(r.id, { perKg: e.target.checked })} className="h-4 w-4 accent-saffron" />
            </label>
            <button
              type="button"
              onClick={() => setS((p) => ({ ...p, rows: p.rows.filter((x) => x.id !== r.id) }))}
              className="grid place-items-center text-ink-muted hover:text-bad"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-subtle px-2 py-1 text-xs"
          onClick={() =>
            setS((p) => ({
              ...p,
              rows: [...p.rows, { id: `i${Date.now().toString(36)}`, name: '', qty: 0, unitCost: 0, perKg: true }],
            }))
          }
        >
          <IconPlus className="h-4 w-4" /> Ingredient যোগ করো
        </button>
      </div>

      <p className="mt-2 text-xs text-ink-muted">
        "/kg?" tick থাকলে Qty = গ্রাম এবং Unit cost = ₹/kg। না থাকলে Qty × Unit cost সরাসরি।
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <NumField label="Selling Price (menu)" value={s.price} onChange={(v) => setS((p) => ({ ...p, price: v }))} step={5} suffix="₹" />
        <NumField label="Packaging cost / order" value={s.packaging} onChange={(v) => setS((p) => ({ ...p, packaging: v }))} suffix="₹" />
        <NumField label="Platform commission" value={s.commissionPct} onChange={(v) => setS((p) => ({ ...p, commissionPct: v }))} suffix="%" />
        <NumField label="Variable overhead (gas ইত্যাদি)" value={s.overhead} onChange={(v) => setS((p) => ({ ...p, overhead: v }))} suffix="₹" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Result label="Food cost / dish" value={rupee(foodCost)} />
        <Result label="Platform commission" value={rupee(commission)} />
        <Result label="Total variable cost" value={rupee(variable)} />
        <Result label="Contribution / order" value={rupee(contribution)} tone={contribution <= 0 ? 'text-bad' : 'text-good'} />
        <Result
          label="Food Cost %"
          value={`${foodCostPct.toFixed(1)}%`}
          tone={foodCostPct > 38 ? 'text-bad' : foodCostPct > 32 ? 'text-warn' : 'text-good'}
        />
        <Result label="Contribution margin %" value={s.price > 0 ? `${((contribution / s.price) * 100).toFixed(1)}%` : '—'} />
      </div>

      {foodCostPct > 38 && (
        <p className="mt-4 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          Food Cost % বেশি (&gt;38%)। Portion, sourcing বা price নিয়ে ভাবো।
        </p>
      )}

      <SaveToLog
        saved={saved}
        goToLog={goToLog}
        onSave={() =>
          save(
            `Dish pricing: selling ${rupee(s.price)} → contribution ${rupee(contribution)}/order, Food Cost ${foodCostPct.toFixed(
              1,
            )}%`,
            `Food Cost Calculator: food ${rupee(foodCost)} + packaging ${rupee(s.packaging)} + commission ${rupee(
              commission,
            )} (${s.commissionPct}%) + overhead ${rupee(s.overhead)} = variable ${rupee(variable)}. (${todayISO()})`,
          )
        }
      />
    </section>
  );
}

export function Calculators() {
  const { calculatorState } = useStore();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calculators"
        subtitle="তোমার সংখ্যা এই browser-এ save থাকে। ফলাফল Decision Log-এ পাঠাতে পারো।"
      />
      <FoodCost initial={calculatorState.foodCost as Partial<FoodCostState> | undefined} />
      <BreakEven initial={calculatorState.breakEven as Partial<BreakEvenState> | undefined} />
    </div>
  );
}
