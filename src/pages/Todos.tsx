import { useEffect, useMemo, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { FilterBar, type FilterGroup } from '../components/FilterBar';
import { PageHeader } from '../components/PageHeader';
import { TaskCard } from '../components/TaskCard';
import { IconPlus } from '../components/icons';
import { phases } from '../content/phases';
import { PRIORITY_RANK, STATUS_LABEL } from '../lib/format';
import { useStore } from '../lib/store';
import type { Category, Priority, TaskStatus } from '../types';

const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'blocked', 'backlog', 'done'];
const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];
const CATEGORIES: Category[] = [
  'Foundation', 'Market Research', 'Location & Kitchen', 'Legal & Compliance',
  'Equipment', 'Menu', 'Finance', 'Procurement', 'Operations', 'Marketing', 'Customer',
];

export function Todos() {
  const { tasks, addTask } = useStore();
  const [filters, setFilters] = useState<Record<string, string | null>>({});
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.hash) setOpenId(window.location.hash.slice(1));
  }, []);

  const groups: FilterGroup[] = [
    { key: 'phase', label: 'Phase', options: phases.map((p) => ({ value: p.id, label: p.code })) },
    { key: 'status', label: 'Status', options: STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })) },
    { key: 'priority', label: 'Priority', options: PRIORITIES.map((p) => ({ value: p, label: p })) },
    { key: 'category', label: 'Category', options: CATEGORIES.map((c) => ({ value: c, label: c })) },
  ];

  const filtered = useMemo(() => {
    const list = tasks.filter((t) => {
      if (filters.phase && t.phase !== filters.phase) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.category && t.category !== filters.category) return false;
      return true;
    });
    return list.sort((a, b) => {
      if ((a.status === 'done') !== (b.status === 'done')) return a.status === 'done' ? 1 : -1;
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    });
  }, [tasks, filters]);

  const openCount = tasks.filter((t) => t.status !== 'done').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="TODO"
        subtitle={`${openCount} open · ${tasks.length} total`}
        actions={
          <button className="btn-ghost" onClick={() => setAdding((a) => !a)}>
            <IconPlus className="h-4 w-4" /> Add task
          </button>
        }
      />

      {adding && <AddTaskForm onDone={() => setAdding(false)} onAdd={addTask} />}

      <div className="card p-4">
        <FilterBar
          groups={groups}
          value={filters}
          onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
          onReset={() => setFilters({})}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="এই filter-এ কোনো task নেই" hint="Filter reset করো বা নতুন task যোগ করো।" />
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <TaskCard key={t.id} task={t} defaultOpen={openId === t.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddTaskForm({
  onDone,
  onAdd,
}: {
  onDone: () => void;
  onAdd: ReturnType<typeof useStore>['addTask'];
}) {
  const [task, setTask] = useState('');
  const [criteria, setCriteria] = useState('');
  const [phase, setPhase] = useState(phases[0].id);
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Foundation');

  return (
    <form
      className="card space-y-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!task.trim()) return;
        void onAdd({
          task: task.trim(),
          completionCriteria: criteria.trim() || 'নিজে ঠিক করে নেবে।',
          phase,
          priority,
          category,
        });
        onDone();
      }}
    >
      <input autoFocus className="field" placeholder="কী করতে হবে?" value={task} onChange={(e) => setTask(e.target.value)} />
      <input className="field" placeholder="Completion criteria — কীভাবে বুঝব শেষ?" value={criteria} onChange={(e) => setCriteria(e.target.value)} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <select className="field" value={phase} onChange={(e) => setPhase(e.target.value as typeof phase)}>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>{p.code} — {p.title}</option>
          ))}
        </select>
        <select className="field" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="field" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Add</button>
        <button type="button" className="btn-ghost" onClick={onDone}>Cancel</button>
      </div>
    </form>
  );
}
