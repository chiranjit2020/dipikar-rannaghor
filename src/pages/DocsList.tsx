import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { FilterBar, type FilterGroup } from '../components/FilterBar';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressRing';
import { PhaseBadge } from '../components/badges';
import { documents } from '../content/documents';
import { phases } from '../content/phases';
import { useProgress, useStore } from '../lib/store';
import type { Category, Difficulty } from '../types';

const CATEGORIES: Category[] = [
  'Foundation', 'Market Research', 'Location & Kitchen', 'Legal & Compliance',
  'Equipment', 'Menu', 'Finance', 'Operations', 'Marketing', 'Customer',
];
const DIFFICULTY: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

export function DocsList() {
  const { docProgress } = useStore();
  const progress = useProgress();
  const [filters, setFilters] = useState<Record<string, string | null>>({});

  const groups: FilterGroup[] = [
    { key: 'phase', label: 'Phase', options: phases.map((p) => ({ value: p.id, label: p.code })) },
    { key: 'category', label: 'Category', options: CATEGORIES.map((c) => ({ value: c, label: c })) },
    { key: 'difficulty', label: 'Level', options: DIFFICULTY.map((d) => ({ value: d, label: d })) },
    { key: 'read', label: 'Status', options: [{ value: 'unread', label: 'Unread' }, { value: 'read', label: 'Read' }] },
  ];

  const filtered = useMemo(
    () =>
      documents.filter((d) => {
        if (filters.phase && d.phase !== filters.phase) return false;
        if (filters.category && d.category !== filters.category) return false;
        if (filters.difficulty && d.difficulty !== filters.difficulty) return false;
        const isRead = !!docProgress[d.id]?.read;
        if (filters.read === 'read' && !isRead) return false;
        if (filters.read === 'unread' && isRead) return false;
        return true;
      }),
    [filters, docProgress],
  );

  const byPhase = phases
    .map((p) => ({ phase: p, docs: filtered.filter((d) => d.phase === p.id) }))
    .filter((g) => g.docs.length > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentation"
        subtitle={`Learning Progress ${progress.learningPct}% · ${progress.docsRead}/${progress.docsTotal} পড়া হয়েছে`}
      />

      <div className="card p-4">
        <FilterBar
          groups={groups}
          value={filters}
          onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
          onReset={() => setFilters({})}
        />
      </div>

      <div className="card p-4">
        <ProgressBar value={progress.learningPct} tone="info" />
      </div>

      {byPhase.length === 0 && (
        <EmptyState title="এই filter-এ কোনো documentation নেই" hint="Filter reset করে দেখো।" />
      )}

      {byPhase.map(({ phase, docs }) => (
        <section key={phase.id}>
          <h2 className="mb-1 text-lg">{phase.code} — {phase.title}</h2>
          <p className="mb-3 text-sm text-ink-muted">{phase.summary}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {docs.map((d) => {
              const isRead = !!docProgress[d.id]?.read;
              return (
                <Link
                  key={d.id}
                  to={`/docs/${d.slug}`}
                  className="card card-hover flex flex-col gap-2 p-4"
                >
                  <div className="flex items-center gap-2">
                    <PhaseBadge code={d.category} />
                    {isRead && <span className="chip border-good/30 bg-good/10 text-good">Read</span>}
                    <span className="ml-auto text-xs text-ink-muted">{d.readingMinutes} min</span>
                  </div>
                  <h3 className="text-base leading-snug text-ink">{d.title}</h3>
                  <p className="line-clamp-2 text-sm text-ink-muted">{d.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
