import { checklists } from '../content/checklists';
import { documents } from '../content/documents';
import { glossary } from '../content/glossary';
import { phaseById } from '../content/phases';
import type { DecisionEntry, SearchResult, Task } from '../types';
import { excerpt } from './format';

interface Indexable {
  kind: SearchResult['kind'];
  id: string;
  title: string;
  body: string;
  to: string;
  phase?: SearchResult['phase'];
  category?: string;
}

const CALCULATORS: Indexable[] = [
  {
    kind: 'calculator',
    id: 'calc-breakeven',
    title: 'Break-even Calculator',
    body: 'break-even orders per day month fixed cost AOV contribution average order value revenue',
    to: '/calculators#breakeven',
  },
  {
    kind: 'calculator',
    id: 'calc-foodcost',
    title: 'Food Cost Calculator',
    body: 'food cost percent contribution margin ingredient packaging platform commission selling price dish',
    to: '/calculators#foodcost',
  },
];

function buildStaticIndex(): Indexable[] {
  const docs: Indexable[] = documents.map((d) => ({
    kind: 'documentation',
    id: d.id,
    title: d.title,
    body: `${d.summary} ${d.tags.join(' ')} ${d.category} ${d.content}`,
    to: `/docs/${d.slug}`,
    phase: d.phase,
    category: d.category,
  }));

  const lists: Indexable[] = checklists.map((c) => ({
    kind: 'checklist',
    id: c.id,
    title: c.title,
    body: `${c.description} ${c.items.map((i) => i.label).join(' ')}`,
    to: `/checklists#${c.id}`,
    phase: c.phase,
  }));

  const terms: Indexable[] = glossary.map((g) => ({
    kind: 'glossary',
    id: g.id,
    title: g.full ? `${g.term} — ${g.full}` : g.term,
    body: `${g.term} ${g.full ?? ''} ${g.definition}`,
    to: `/glossary#${g.id}`,
  }));

  return [...docs, ...lists, ...terms, ...CALCULATORS];
}

const STATIC_INDEX = buildStaticIndex();

function scoreOf(hay: string, title: string, terms: string[]): number {
  const h = hay.toLowerCase();
  const t = title.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!term) continue;
    if (t === term) score += 12;
    if (t.includes(term)) score += 6;
    const idx = h.indexOf(term);
    if (idx >= 0) score += 3 + Math.max(0, 2 - idx / 400);
  }
  return score;
}

export function search(
  query: string,
  dynamic: { tasks: Task[]; decisions: DecisionEntry[] },
  limit = 24,
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const dynIndex: Indexable[] = [
    ...dynamic.tasks.map<Indexable>((t) => ({
      kind: 'task',
      id: t.id,
      title: t.task,
      body: `${t.task} ${t.notes ?? ''} ${t.category} ${t.completionCriteria}`,
      to: `/todo#${t.id}`,
      phase: t.phase,
      category: t.category,
    })),
    ...dynamic.decisions.map<Indexable>((d) => ({
      kind: 'decision',
      id: d.id,
      title: d.decision,
      body: `${d.decision} ${d.reason}`,
      to: `/decisions#${d.id}`,
    })),
  ];

  const results: SearchResult[] = [];
  for (const item of [...STATIC_INDEX, ...dynIndex]) {
    const score = scoreOf(`${item.title} ${item.body}`, item.title, terms);
    if (score <= 0) continue;
    results.push({
      kind: item.kind,
      id: item.id,
      title: item.title,
      excerpt: excerpt(item.body, 140),
      to: item.to,
      phase: item.phase,
      category: item.category ?? (item.phase ? phaseById[item.phase]?.code : undefined),
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
