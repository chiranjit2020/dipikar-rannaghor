import { useMemo, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { FilterBar, type FilterGroup } from '../components/FilterBar';
import { PageHeader } from '../components/PageHeader';
import { IconPlus, IconTrash } from '../components/icons';
import { rupee } from '../lib/costing';
import { EXPENSE_CATEGORIES } from '../lib/finance';
import { formatDate, todayISO, uid } from '../lib/format';
import { useStore } from '../lib/store';
import type { Expense, ExpenseCategory } from '../types';

export function Expenses() {
  const { expenses, saveItem, deleteItem } = useStore();
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [editing, setEditing] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    return [...expenses]
      .filter((e) => !filters.category || e.category === filters.category)
      .filter((e) => !filters.recurring || (e.recurring ?? 'one-off') === filters.recurring)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, filters]);

  const total = filtered.reduce((a, e) => a + e.amount, 0);
  const monthTotal = expenses
    .filter((e) => e.date.slice(0, 7) === todayISO().slice(0, 7))
    .reduce((a, e) => a + e.amount, 0);

  const groups: FilterGroup[] = [
    { key: 'category', label: 'Category', options: EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c })) },
    {
      key: 'recurring',
      label: 'Type',
      options: [
        { value: 'one-off', label: 'One-off' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'weekly', label: 'Weekly' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle={`চলতি মাসে মোট ${rupee(monthTotal)}`}
        actions={
          <button
            className="btn-ghost"
            onClick={() =>
              setEditing({
                id: uid('exp'),
                date: todayISO(),
                category: 'Miscellaneous',
                amount: 0,
                recurring: null,
                updatedAt: new Date().toISOString(),
              })
            }
          >
            <IconPlus className="h-4 w-4" /> Add expense
          </button>
        }
      />

      {editing && (
        <ExpenseForm
          key={editing.id}
          expense={editing}
          onCancel={() => setEditing(null)}
          onSave={(e) => {
            void saveItem('expenses', { ...e, updatedAt: new Date().toISOString() });
            setEditing(null);
          }}
        />
      )}

      {expenses.length === 0 && !editing ? (
        <EmptyState
          title="কোনো expense লগ করা হয়নি"
          hint="Rent, salary, utilities, packaging, purchase, marketing — সব এক জায়গায়।"
          action={
            <button
              className="btn-primary"
              onClick={() =>
                setEditing({
                  id: uid('exp'),
                  date: todayISO(),
                  category: 'Rent',
                  amount: 0,
                  recurring: 'monthly',
                  updatedAt: new Date().toISOString(),
                })
              }
            >
              প্রথম expense যোগ করো
            </button>
          }
        />
      ) : (
        <>
          <div className="card p-4">
            <FilterBar
              groups={groups}
              value={filters}
              onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
              onReset={() => setFilters({})}
            />
          </div>

          <div className="card divide-y divide-tint/5">
            {filtered.map((e) => (
              <button
                key={e.id}
                onClick={() => setEditing(e)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-tint/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-medium text-ink">{e.category}</span>
                    {e.recurring && <span className="chip chip-active">{e.recurring}</span>}
                    {e.vendor && <span className="chip">{e.vendor}</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatDate(e.date)}
                    {e.notes ? ` · ${e.notes}` : ''}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink">{rupee(e.amount)}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    void deleteItem('expenses', e.id);
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                      ev.stopPropagation();
                      void deleteItem('expenses', e.id);
                    }
                  }}
                  className="shrink-0 text-ink-muted hover:text-bad"
                  aria-label="Delete"
                >
                  <IconTrash className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>

          <p className="text-right text-sm text-ink-muted">
            Filtered total: <span className="font-semibold text-ink">{rupee(total)}</span>
          </p>
        </>
      )}
    </div>
  );
}

function ExpenseForm({
  expense,
  onSave,
  onCancel,
}: {
  expense: Expense;
  onSave: (e: Expense) => void;
  onCancel: () => void;
}) {
  const [e, setE] = useState(expense);
  return (
    <form
      className="card space-y-3 p-4"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (e.amount <= 0) return;
        onSave(e);
      }}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs text-ink-muted">
          Date
          <input type="date" className="field mt-1" value={e.date} onChange={(ev) => setE({ ...e, date: ev.target.value })} />
        </label>
        <label className="block text-xs text-ink-muted">
          Amount (₹)
          <input
            type="number"
            inputMode="decimal"
            autoFocus
            className="field mt-1"
            value={e.amount}
            onChange={(ev) => setE({ ...e, amount: parseFloat(ev.target.value) || 0 })}
          />
        </label>
        <label className="block text-xs text-ink-muted">
          Category
          <select
            className="field mt-1"
            value={e.category}
            onChange={(ev) => setE({ ...e, category: ev.target.value as ExpenseCategory })}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-ink-muted">
          Recurring
          <select
            className="field mt-1"
            value={e.recurring ?? ''}
            onChange={(ev) => setE({ ...e, recurring: (ev.target.value || null) as Expense['recurring'] })}
          >
            <option value="">One-off</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>
      <input className="field" placeholder="Vendor / payee (optional)" value={e.vendor ?? ''} onChange={(ev) => setE({ ...e, vendor: ev.target.value })} />
      <input className="field" placeholder="Notes (optional)" value={e.notes ?? ''} onChange={(ev) => setE({ ...e, notes: ev.target.value })} />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
      <p className="text-xs text-ink-muted">
        Recurring খরচ শুধু tag হয় — প্রতি মাসে নতুন entry দিতে হবে (auto-generate পরের version-এ)।
      </p>
    </form>
  );
}
