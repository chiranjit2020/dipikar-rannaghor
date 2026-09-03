import { useMemo, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { IconChevronRight, IconPlus, IconTrash } from '../components/icons';
import { rupee } from '../lib/costing';
import { uid } from '../lib/format';
import { useStore } from '../lib/store';
import type { Supplier, SupplierItem } from '../types';

export function Suppliers() {
  const { suppliers, saveItem, deleteItem } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const add = () => {
    const s: Supplier = {
      id: uid('sup'),
      name: '',
      reliability: 3,
      items: [],
      updatedAt: new Date().toISOString(),
    };
    void saveItem('suppliers', s);
    setOpenId(s.id);
  };

  const save = (s: Supplier) =>
    void saveItem('suppliers', { ...s, updatedAt: new Date().toISOString() });

  // Compare: item name -> quotes across suppliers
  const comparison = useMemo(() => {
    const map = new Map<string, { supplier: string; q: SupplierItem }[]>();
    for (const s of suppliers) {
      for (const it of s.items) {
        const key = it.item.trim().toLowerCase();
        if (!key) continue;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ supplier: s.name || 'Unnamed', q: it });
      }
    }
    return [...map.entries()]
      .filter(([, rows]) => rows.length > 1)
      .map(([key, rows]) => ({
        item: key,
        rows: rows.sort((a, b) => a.q.price - b.q.price),
      }));
  }, [suppliers]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        subtitle="প্রতিটি supplier ও তাদের quote। অন্তত একজন backup supplier রাখো।"
        actions={
          <button className="btn-ghost" onClick={add}>
            <IconPlus className="h-4 w-4" /> Add supplier
          </button>
        }
      />

      {suppliers.length === 0 ? (
        <EmptyState
          title="কোনো supplier যোগ করা হয়নি"
          hint="মূল ৫টি raw material-এর জন্য অন্তত ২ জন করে supplier compare করো — price, quality, MOQ, delivery।"
          action={
            <button className="btn-primary" onClick={add}>
              প্রথম supplier যোগ করো
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {suppliers.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              open={openId === s.id}
              onToggle={() => setOpenId((o) => (o === s.id ? null : s.id))}
              onSave={save}
              onDelete={() => void deleteItem('suppliers', s.id)}
            />
          ))}
        </div>
      )}

      {comparison.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg">Item comparison</h2>
          <div className="space-y-3">
            {comparison.map(({ item, rows }) => (
              <div key={item} className="card p-4">
                <p className="mb-2 text-sm font-medium capitalize text-ink">{item}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[0.7rem] uppercase tracking-wider text-ink-muted">
                        <th className="py-1 pr-3">Supplier</th>
                        <th className="py-1 pr-3">Price</th>
                        <th className="py-1 pr-3">MOQ</th>
                        <th className="py-1 pr-3">Delivery</th>
                        <th className="py-1">Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(({ supplier, q }, idx) => (
                        <tr key={q.id} className="border-t border-white/5">
                          <td className="py-1.5 pr-3 text-ink-soft">{supplier}</td>
                          <td className={`py-1.5 pr-3 ${idx === 0 ? 'font-semibold text-good' : 'text-ink-soft'}`}>
                            {rupee(q.price)}/{q.unit || 'unit'}
                          </td>
                          <td className="py-1.5 pr-3 text-ink-muted">{q.moq || '—'}</td>
                          <td className="py-1.5 pr-3 text-ink-muted">{q.deliveryDays || '—'}</td>
                          <td className="py-1.5 text-ink-muted">{q.quality || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SupplierCard({
  supplier,
  open,
  onToggle,
  onSave,
  onDelete,
}: {
  supplier: Supplier;
  open: boolean;
  onToggle: () => void;
  onSave: (s: Supplier) => void;
  onDelete: () => void;
}) {
  const s = supplier;
  const set = (p: Partial<Supplier>) => onSave({ ...s, ...p });
  const setItem = (id: string, p: Partial<SupplierItem>) =>
    set({ items: s.items.map((it) => (it.id === id ? { ...it, ...p } : it)) });

  return (
    <div className="card overflow-hidden">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left">
        <div className="min-w-0 flex-1">
          <span className="text-sm font-medium text-ink">{s.name || 'Unnamed supplier'}</span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="chip">{s.items.length} item</span>
            <span className="chip">Reliability {s.reliability}/5</span>
            {s.isBackup && <span className="chip chip-active">Backup</span>}
          </div>
        </div>
        <IconChevronRight className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="space-y-3 border-t border-hairline bg-white/[0.015] p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <input className="field" placeholder="Supplier নাম" value={s.name} onChange={(e) => set({ name: e.target.value })} />
            <input className="field" placeholder="Contact (phone / person)" value={s.contact ?? ''} onChange={(e) => set({ contact: e.target.value })} />
            <input className="field" placeholder="Payment terms (যেমন: 7 দিন credit)" value={s.paymentTerms ?? ''} onChange={(e) => set({ paymentTerms: e.target.value })} />
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              Reliability
              <select className="field" value={s.reliability} onChange={(e) => set({ reliability: Number(e.target.value) })}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="checkbox" checked={!!s.isBackup} onChange={(e) => set({ isBackup: e.target.checked })} className="h-4 w-4 accent-saffron" />
              Backup supplier
            </label>
          </div>

          <div>
            <p className="section-title mb-2">Quotes</p>
            <div className="space-y-2">
              {s.items.map((it) => (
                <div key={it.id} className="grid grid-cols-2 gap-2 sm:grid-cols-[1.3fr_5rem_4rem_5rem_5rem_1fr_2rem]">
                  <input className="field" placeholder="Item" value={it.item} onChange={(e) => setItem(it.id, { item: e.target.value })} />
                  <input className="field" type="number" placeholder="₹" value={it.price} onChange={(e) => setItem(it.id, { price: parseFloat(e.target.value) || 0 })} />
                  <input className="field" placeholder="unit" value={it.unit} onChange={(e) => setItem(it.id, { unit: e.target.value })} />
                  <input className="field" placeholder="MOQ" value={it.moq ?? ''} onChange={(e) => setItem(it.id, { moq: e.target.value })} />
                  <input className="field" placeholder="Delivery" value={it.deliveryDays ?? ''} onChange={(e) => setItem(it.id, { deliveryDays: e.target.value })} />
                  <input className="field" placeholder="Quality note" value={it.quality ?? ''} onChange={(e) => setItem(it.id, { quality: e.target.value })} />
                  <button onClick={() => set({ items: s.items.filter((x) => x.id !== it.id) })} className="grid place-items-center text-ink-muted hover:text-bad">
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn-subtle mt-2 px-2 py-1 text-xs"
              onClick={() =>
                set({ items: [...s.items, { id: uid('sq'), item: '', price: 0, unit: 'kg' }] })
              }
            >
              <IconPlus className="h-4 w-4" /> Quote যোগ করো
            </button>
          </div>

          <textarea className="field resize-y" rows={2} placeholder="Notes" value={s.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} />

          <button onClick={onDelete} className="btn-subtle px-2 py-1 text-xs text-bad hover:bg-bad/10">
            <IconTrash className="h-4 w-4" /> Delete supplier
          </button>
        </div>
      )}
    </div>
  );
}
