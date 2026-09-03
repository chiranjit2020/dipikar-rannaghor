import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { IconPlus, IconTrash } from '../components/icons';
import { rupee } from '../lib/costing';
import { stockLevels } from '../lib/finance';
import { formatDate, todayISO, uid } from '../lib/format';
import { useStore } from '../lib/store';
import type { StockMove, StockMoveKind } from '../types';

const KIND_LABEL: Record<StockMoveKind, string> = {
  purchase: 'Purchase',
  consumption: 'Consumption',
  wastage: 'Wastage',
  adjustment: 'Adjustment',
};
const KIND_TONE: Record<StockMoveKind, string> = {
  purchase: 'text-good',
  consumption: 'text-ink-soft',
  wastage: 'text-bad',
  adjustment: 'text-info',
};

export function Inventory() {
  const { ingredients, stockMoves, saveItem, deleteItem } = useStore();
  const [adding, setAdding] = useState(false);

  const levels = useMemo(() => stockLevels(ingredients, stockMoves), [ingredients, stockMoves]);
  const lowCount = levels.filter((l) => l.low).length;
  const recentMoves = useMemo(
    () => [...stockMoves].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 40),
    [stockMoves],
  );
  const ingById = Object.fromEntries(ingredients.map((i) => [i.id, i]));

  if (ingredients.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Inventory" subtitle="Stock on hand, reorder alert ও stock movement।" />
        <EmptyState
          title="আগে ingredient library দরকার"
          hint="Inventory ingredient-এর উপর দাঁড়ায়। প্রথমে Ingredients-এ raw material যোগ করো।"
          action={<Link to="/ingredients" className="btn-primary">Ingredients-এ যাও</Link>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        subtitle={lowCount > 0 ? `${lowCount} item reorder level-এ` : 'সব item reorder level-এর উপরে'}
        actions={
          <button className="btn-ghost" onClick={() => setAdding((a) => !a)}>
            <IconPlus className="h-4 w-4" /> Stock move
          </button>
        }
      />

      {adding && (
        <MoveForm
          ingredients={ingredients}
          onCancel={() => setAdding(false)}
          onSave={(m) => {
            void saveItem('stockMoves', m);
            setAdding(false);
          }}
        />
      )}

      {/* Stock levels */}
      <section className="card divide-y divide-white/5">
        <div className="hidden grid-cols-[1fr_6rem_6rem_5rem] gap-3 px-4 py-2 text-[0.7rem] uppercase tracking-wider text-ink-muted sm:grid">
          <span>Ingredient</span><span>On hand</span><span>Reorder at</span><span>Status</span>
        </div>
        {levels.map((l) => (
          <div key={l.ingredient.id} className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-[1fr_6rem_6rem_5rem] sm:items-center sm:gap-3">
            <span className="text-sm text-ink">{l.ingredient.name || 'Unnamed'}</span>
            <span className="text-sm text-ink-soft">
              {round(l.onHand)} {l.ingredient.unit}
            </span>
            <input
              type="number"
              inputMode="decimal"
              className="field sm:py-1.5"
              value={l.reorderLevel}
              onChange={(e) =>
                void saveItem('ingredients', {
                  ...l.ingredient,
                  reorderLevel: parseFloat(e.target.value) || 0,
                  updatedAt: new Date().toISOString(),
                })
              }
            />
            <span className={`text-xs font-medium ${l.low ? 'text-bad' : 'text-good'}`}>
              {l.low ? 'Reorder' : 'OK'}
            </span>
          </div>
        ))}
      </section>

      {/* Movement log */}
      <section>
        <h2 className="mb-3 text-lg">Recent stock moves</h2>
        {recentMoves.length === 0 ? (
          <EmptyState
            title="কোনো stock move নেই"
            hint="Purchase, consumption, wastage বা adjustment যোগ করো — on-hand নিজে থেকেই হিসাব হবে।"
          />
        ) : (
          <div className="card divide-y divide-white/5">
            {recentMoves.map((m) => {
              const ing = ingById[m.ingredientId];
              return (
                <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-ink">{ing?.name ?? 'Unknown'}</span>
                    <p className="text-xs text-ink-muted">
                      {formatDate(m.date)}
                      {m.reason ? ` · ${m.reason}` : ''}
                      {m.kind === 'purchase' && m.costPerUnit
                        ? ` · ${rupee(m.costPerUnit)}/${ing?.unit ?? 'unit'}`
                        : ''}
                    </p>
                  </div>
                  <span className={`shrink-0 text-sm ${KIND_TONE[m.kind]}`}>
                    {m.kind === 'consumption' || m.kind === 'wastage' ? '−' : '+'}
                    {round(m.qty)} {ing?.unit ?? ''}
                  </span>
                  <span className="shrink-0 text-[0.7rem] uppercase tracking-wide text-ink-muted">
                    {KIND_LABEL[m.kind]}
                  </span>
                  <button
                    onClick={() => void deleteItem('stockMoves', m.id)}
                    className="shrink-0 text-ink-muted hover:text-bad"
                    aria-label="Delete"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <p className="text-xs text-ink-muted">
        Adjustment দিয়ে opening stock সেট করো (qty ধনাত্মক) বা গণনার ভুল ঠিক করো (ঋণাত্মক দিতে −
        চিহ্ন)। Consumption/wastage সবসময় on-hand কমায়।
      </p>
    </div>
  );
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function MoveForm({
  ingredients,
  onSave,
  onCancel,
}: {
  ingredients: { id: string; name: string; unit: string }[];
  onSave: (m: StockMove) => void;
  onCancel: () => void;
}) {
  const [ingredientId, setIngredientId] = useState(ingredients[0]?.id ?? '');
  const [kind, setKind] = useState<StockMoveKind>('purchase');
  const [qty, setQty] = useState(0);
  const [costPerUnit, setCostPerUnit] = useState(0);
  const [date, setDate] = useState(todayISO());
  const [reason, setReason] = useState('');

  return (
    <form
      className="card space-y-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ingredientId || qty === 0) return;
        onSave({
          id: uid('sm'),
          date,
          ingredientId,
          kind,
          qty: Math.abs(qty) * (kind === 'adjustment' && qty < 0 ? -1 : 1),
          ...(kind === 'purchase' && costPerUnit > 0 ? { costPerUnit } : {}),
          reason: reason || undefined,
          updatedAt: new Date().toISOString(),
        });
      }}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-ink-muted">
          Ingredient
          <select className="field mt-1" value={ingredientId} onChange={(e) => setIngredientId(e.target.value)}>
            {ingredients.map((i) => (
              <option key={i.id} value={i.id}>{i.name || 'Unnamed'} ({i.unit})</option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-ink-muted">
          Type
          <select className="field mt-1" value={kind} onChange={(e) => setKind(e.target.value as StockMoveKind)}>
            {(['purchase', 'consumption', 'wastage', 'adjustment'] as StockMoveKind[]).map((k) => (
              <option key={k} value={k}>{KIND_LABEL[k]}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-ink-muted">
          Quantity ({ingredients.find((i) => i.id === ingredientId)?.unit ?? 'unit'})
          <input
            type="number"
            inputMode="decimal"
            autoFocus
            className="field mt-1"
            value={qty}
            onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
          />
        </label>
        {kind === 'purchase' && (
          <label className="block text-xs text-ink-muted">
            Cost per unit (₹, optional)
            <input
              type="number"
              inputMode="decimal"
              className="field mt-1"
              value={costPerUnit}
              onChange={(e) => setCostPerUnit(parseFloat(e.target.value) || 0)}
            />
          </label>
        )}
        <label className="block text-xs text-ink-muted">
          Date
          <input type="date" className="field mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <input className="field" placeholder="Reason / note (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save move</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
