import { useMemo, useState } from 'react';

import { PageHeader } from '../components/PageHeader';
import { IconPlus, IconTrash } from '../components/icons';

const rupee = (n: number) =>
  `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

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
    <div className="rounded-xl border border-hairline bg-white/[0.02] px-4 py-3">
      <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">{label}</p>
      <p className={`mt-0.5 text-xl font-semibold ${tone ?? 'text-ink'}`}>{value}</p>
    </div>
  );
}

function BreakEven() {
  const [fixed, setFixed] = useState(40000);
  const [aov, setAov] = useState(230);
  const [variable, setVariable] = useState(150);
  const [days, setDays] = useState(26);

  const contribution = aov - variable;
  const monthlyOrders = contribution > 0 ? fixed / contribution : Infinity;
  const dailyOrders = monthlyOrders / Math.max(1, days);
  const revenue = monthlyOrders * aov;

  return (
    <section id="breakeven" className="card p-5">
      <h2 className="text-lg">Break-even Calculator</h2>
      <p className="mt-1 text-sm text-ink-muted">
        দিনে কতগুলো order না হলে ওই মাসে লোকসান — সেটা বের করো।
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <NumField label="Monthly Fixed Cost" value={fixed} onChange={setFixed} step={500} suffix="₹" />
        <NumField label="Average Order Value (AOV)" value={aov} onChange={setAov} step={5} suffix="₹" />
        <NumField label="Variable Cost / order (food + packaging + commission)" value={variable} onChange={setVariable} step={5} suffix="₹" />
        <NumField label="চালু দিন / মাস" value={days} onChange={setDays} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Result
          label="Contribution / order"
          value={rupee(contribution)}
          tone={contribution <= 0 ? 'text-bad' : 'text-good'}
        />
        <Result
          label="Break-even orders / month"
          value={Number.isFinite(monthlyOrders) ? Math.ceil(monthlyOrders).toString() : '— (contribution ≤ 0)'}
        />
        <Result
          label="Break-even orders / day"
          value={Number.isFinite(dailyOrders) ? Math.ceil(dailyOrders).toString() : '—'}
          tone="text-saffron-soft"
        />
        <Result
          label="Break-even revenue / month"
          value={Number.isFinite(revenue) ? rupee(Math.round(revenue)) : '—'}
        />
      </div>

      {contribution <= 0 && (
        <p className="mt-4 rounded-xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-bad">
          Contribution ০ বা তার নিচে — এই দামে যত বিক্রি, তত লোকসান। Variable cost কমাও বা price বাড়াও।
        </p>
      )}
    </section>
  );
}

interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unitCost: number; // ₹ per (kg/L/unit)
  perKg: boolean; // true => qty is grams, unitCost is per kg
}

function FoodCost() {
  const [rows, setRows] = useState<Ingredient[]>([
    { id: 'i1', name: 'Chicken', qty: 180, unitCost: 240, perKg: true },
    { id: 'i2', name: 'Basmati rice', qty: 150, unitCost: 120, perKg: true },
    { id: 'i3', name: 'Onion / oil / spices', qty: 1, unitCost: 22, perKg: false },
  ]);
  const [price, setPrice] = useState(199);
  const [packaging, setPackaging] = useState(12);
  const [commissionPct, setCommissionPct] = useState(22);
  const [overhead, setOverhead] = useState(6);

  const foodCost = useMemo(
    () =>
      rows.reduce((sum, r) => sum + (r.perKg ? (r.qty / 1000) * r.unitCost : r.qty * r.unitCost), 0),
    [rows],
  );
  const commission = (price * commissionPct) / 100;
  const variable = foodCost + packaging + commission + overhead;
  const contribution = price - variable;
  const foodCostPct = price > 0 ? (foodCost / price) * 100 : 0;

  const update = (id: string, patch: Partial<Ingredient>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

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
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_5rem_6rem_4rem_2rem]">
            <input className="field" placeholder="নাম" value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} />
            <input className="field" type="number" value={r.qty} onChange={(e) => update(r.id, { qty: parseFloat(e.target.value) || 0 })} />
            <input className="field" type="number" value={r.unitCost} onChange={(e) => update(r.id, { unitCost: parseFloat(e.target.value) || 0 })} />
            <label className="flex items-center justify-center rounded-xl border border-hairline bg-surface-2/60">
              <input type="checkbox" checked={r.perKg} onChange={(e) => update(r.id, { perKg: e.target.checked })} className="h-4 w-4 accent-saffron" />
            </label>
            <button
              type="button"
              onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
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
            setRows((rs) => [...rs, { id: `i${Date.now().toString(36)}`, name: '', qty: 0, unitCost: 0, perKg: true }])
          }
        >
          <IconPlus className="h-4 w-4" /> Ingredient যোগ করো
        </button>
      </div>

      <p className="mt-2 text-xs text-ink-muted">
        "/kg?" tick থাকলে Qty = গ্রাম এবং Unit cost = ₹/kg। না থাকলে Qty × Unit cost সরাসরি।
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <NumField label="Selling Price (menu)" value={price} onChange={setPrice} step={5} suffix="₹" />
        <NumField label="Packaging cost / order" value={packaging} onChange={setPackaging} suffix="₹" />
        <NumField label="Platform commission" value={commissionPct} onChange={setCommissionPct} suffix="%" />
        <NumField label="Variable overhead (gas ইত্যাদি)" value={overhead} onChange={setOverhead} suffix="₹" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Result label="Food cost / dish" value={rupee(foodCost)} />
        <Result label="Platform commission" value={rupee(commission)} />
        <Result label="Total variable cost" value={rupee(variable)} />
        <Result
          label="Contribution / order"
          value={rupee(contribution)}
          tone={contribution <= 0 ? 'text-bad' : 'text-good'}
        />
        <Result
          label="Food Cost %"
          value={`${foodCostPct.toFixed(1)}%`}
          tone={foodCostPct > 38 ? 'text-bad' : foodCostPct > 32 ? 'text-warn' : 'text-good'}
        />
        <Result
          label="Contribution margin %"
          value={price > 0 ? `${((contribution / price) * 100).toFixed(1)}%` : '—'}
        />
      </div>

      {foodCostPct > 38 && (
        <p className="mt-4 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
          Food Cost % বেশি (&gt;38%)। Portion, sourcing বা price নিয়ে ভাবো।
        </p>
      )}
    </section>
  );
}

export function Calculators() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calculators"
        subtitle="Example সংখ্যা দেওয়া আছে — নিজের সংখ্যা বসাও। কিছু save হয় না, তাই ফল Decision Log বা notes-এ লিখে রাখো।"
      />
      <FoodCost />
      <BreakEven />
    </div>
  );
}
