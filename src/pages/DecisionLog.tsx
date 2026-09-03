import { useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { IconPlus, IconTrash } from '../components/icons';
import { formatDate, todayISO, uid } from '../lib/format';
import { useStore } from '../lib/store';
import type { DecisionEntry } from '../types';

const STATUS_STYLE = {
  active: 'border-good/30 bg-good/10 text-good',
  superseded: 'border-warn/30 bg-warn/10 text-warn',
  reverted: 'border-bad/30 bg-bad/10 text-bad',
} as const;

export function DecisionLog() {
  const { decisions, saveDecision, deleteDecision } = useStore();
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Decision Log"
        subtitle="গুরুত্বপূর্ণ সিদ্ধান্ত + কারণ + তারিখ। Future business tracker-এর জন্য এটি অমূল্য।"
        actions={
          <button className="btn-ghost" onClick={() => setAdding((a) => !a)}>
            <IconPlus className="h-4 w-4" /> New decision
          </button>
        }
      />

      {adding && (
        <DecisionForm
          onCancel={() => setAdding(false)}
          onSave={(d) => {
            void saveDecision(d);
            setAdding(false);
          }}
        />
      )}

      {decisions.length === 0 && !adding ? (
        <EmptyState
          title="এখনও কোনো decision লেখা হয়নি"
          hint="যেমন: cuisine, area, price ceiling, primary supplier — প্রতিটা কারণসহ লেখো।"
          action={
            <button className="btn-primary" onClick={() => setAdding(true)}>
              প্রথম decision লেখো
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => (
            <article key={d.id} id={d.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-medium text-ink">{d.decision}</h3>
                <button
                  onClick={() => void deleteDecision(d.id)}
                  className="shrink-0 text-ink-muted hover:text-bad"
                  aria-label="Delete"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                <span className="text-ink-muted">Reason: </span>
                {d.reason}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-medium ${STATUS_STYLE[d.status]}`}>
                  {d.status}
                </span>
                <span className="text-xs text-ink-muted">{formatDate(d.date)}</span>
                <select
                  value={d.status}
                  onChange={(e) => void saveDecision({ ...d, status: e.target.value as DecisionEntry['status'] })}
                  className="ml-auto rounded-lg border border-hairline bg-surface-2/60 px-2 py-1 text-xs text-ink-soft"
                >
                  <option value="active">active</option>
                  <option value="superseded">superseded</option>
                  <option value="reverted">reverted</option>
                </select>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function DecisionForm({
  onSave,
  onCancel,
}: {
  onSave: (d: DecisionEntry) => void;
  onCancel: () => void;
}) {
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(todayISO());

  return (
    <form
      className="card space-y-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!decision.trim()) return;
        onSave({
          id: uid('dec'),
          decision: decision.trim(),
          reason: reason.trim(),
          date,
          status: 'active',
          createdAt: new Date().toISOString(),
        });
      }}
    >
      <textarea autoFocus className="field resize-y" rows={2} placeholder="সিদ্ধান্ত — যেমন: Chicken Biryani-র selling price ₹179 রাখা হবে।" value={decision} onChange={(e) => setDecision(e.target.value)} />
      <textarea className="field resize-y" rows={2} placeholder="কারণ — competitor research + food cost + target margin…" value={reason} onChange={(e) => setReason(e.target.value)} />
      <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
