import { useMemo, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { glossary, glossaryById } from '../content/glossary';

export function Glossary() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s
      ? glossary.filter(
          (g) =>
            g.term.toLowerCase().includes(s) ||
            g.full?.toLowerCase().includes(s) ||
            g.definition.toLowerCase().includes(s),
        )
      : glossary;
    return [...list].sort((a, b) => a.term.localeCompare(b.term));
  }, [q]);

  return (
    <div className="space-y-6">
      <PageHeader title="Glossary" subtitle="Business ও technical term — সহজ বাংলায়।" />

      <input
        className="field"
        placeholder="Term খুঁজুন — যেমন AOV, Food Cost, FIFO…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {filtered.length === 0 ? (
        <EmptyState title="কোনো term মিলল না" />
      ) : (
        <dl className="grid gap-3 sm:grid-cols-2">
          {filtered.map((g) => (
            <div key={g.id} id={g.id} className="card p-4">
              <dt className="flex items-baseline gap-2">
                <span className="text-base font-semibold text-ink">{g.term}</span>
                {g.full && <span className="text-xs text-ink-muted">{g.full}</span>}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{g.definition}</dd>
              {g.related && g.related.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {g.related
                    .map((id) => glossaryById[id])
                    .filter(Boolean)
                    .map((r) => (
                      <a key={r.id} href={`#${r.id}`} className="chip hover:text-ink">
                        {r.term}
                      </a>
                    ))}
                </div>
              )}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
