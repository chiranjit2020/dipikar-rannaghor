import { useMemo, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { IconPlus, IconTrash } from '../components/icons';
import { starterIngredients } from '../content/starters';
import { formatDate, uid } from '../lib/format';
import { useStore } from '../lib/store';
import type { Ingredient, IngredientUnit } from '../types';

const UNITS: IngredientUnit[] = ['kg', 'litre', 'dozen', 'piece', 'packet'];

export function Ingredients() {
  const { ingredients, suppliers, saveItem, saveItems, deleteItem } = useStore();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...ingredients]
      .filter((i) => !s || i.name.toLowerCase().includes(s))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [ingredients, q]);

  const zeroPriced = ingredients.filter((i) => i.price <= 0).length;

  const add = () =>
    void saveItem('ingredients', {
      id: uid('ing'),
      name: '',
      unit: 'kg',
      price: 0,
      updatedAt: new Date().toISOString(),
    } satisfies Ingredient);

  const patch = (i: Ingredient, p: Partial<Ingredient>) =>
    void saveItem('ingredients', { ...i, ...p, updatedAt: new Date().toISOString() });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ingredients"
        subtitle={
          ingredients.length
            ? `${ingredients.length} item · ${zeroPriced} item-এ এখনো দাম বসানো হয়নি`
            : 'Raw material library — একবার দাম বসাও, সব recipe-তে কাজে লাগবে।'
        }
        actions={
          <button className="btn-ghost" onClick={add}>
            <IconPlus className="h-4 w-4" /> Add
          </button>
        }
      />

      {ingredients.length === 0 ? (
        <EmptyState
          title="Ingredient library খালি"
          hint="নিজের raw material যোগ করো, অথবা একটি starter list দিয়ে শুরু করো (সব দাম ০ — নিজের দাম বসাবে)।"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button
                className="btn-primary"
                onClick={() => void saveItems('ingredients', starterIngredients())}
              >
                Starter list যোগ করো
              </button>
              <button className="btn-ghost" onClick={add}>
                একটা একটা করে যোগ করো
              </button>
            </div>
          }
        />
      ) : (
        <>
          <input
            className="field"
            placeholder="Ingredient খুঁজুন…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="card divide-y divide-white/5">
            <div className="hidden grid-cols-[1fr_5.5rem_6rem_9rem_2rem] gap-3 px-4 py-2 text-[0.7rem] uppercase tracking-wider text-ink-muted sm:grid">
              <span>Name</span><span>Unit</span><span>₹ / unit</span><span>Supplier</span><span />
            </div>
            {filtered.map((i) => (
              <div
                key={i.id}
                className="grid grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-[1fr_5.5rem_6rem_9rem_2rem] sm:items-center sm:gap-3"
              >
                <input
                  className="field sm:border-transparent sm:bg-transparent sm:px-0"
                  placeholder="নাম"
                  value={i.name}
                  onChange={(e) => patch(i, { name: e.target.value })}
                />
                <select
                  className="field sm:px-2"
                  value={i.unit}
                  onChange={(e) => patch(i, { unit: e.target.value as IngredientUnit })}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <input
                  className="field"
                  type="number"
                  inputMode="decimal"
                  value={i.price}
                  onChange={(e) => patch(i, { price: parseFloat(e.target.value) || 0 })}
                />
                <select
                  className="field sm:px-2"
                  value={i.supplierId ?? ''}
                  onChange={(e) => patch(i, { supplierId: e.target.value || null })}
                >
                  <option value="">—</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name || 'Unnamed'}</option>
                  ))}
                </select>
                <button
                  onClick={() => void deleteItem('ingredients', i.id)}
                  className="hidden justify-self-end text-ink-muted hover:text-bad sm:block"
                  aria-label="Delete"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
                <div className="col-span-2 flex items-center justify-between sm:hidden">
                  <span className="text-[0.7rem] text-ink-muted">
                    updated {formatDate(i.updatedAt)}
                  </span>
                  <button
                    onClick={() => void deleteItem('ingredients', i.id)}
                    className="text-ink-muted hover:text-bad"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-subtle text-xs" onClick={add}>
            <IconPlus className="h-4 w-4" /> Ingredient যোগ করো
          </button>
        </>
      )}
    </div>
  );
}
