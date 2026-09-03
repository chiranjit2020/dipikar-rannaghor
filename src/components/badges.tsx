import type { Priority, TaskStatus } from '../types';
import { PRIORITY_LABEL, STATUS_LABEL } from '../lib/format';

const STATUS_STYLE: Record<TaskStatus, string> = {
  backlog: 'text-ink-muted border-white/10 bg-white/[0.03]',
  todo: 'text-info border-info/30 bg-info/10',
  'in-progress': 'text-saffron-soft border-saffron/40 bg-saffron/12',
  blocked: 'text-bad border-bad/30 bg-bad/10',
  done: 'text-good border-good/30 bg-good/10',
};

const PRIORITY_STYLE: Record<Priority, string> = {
  critical: 'text-bad border-bad/40 bg-bad/10',
  high: 'text-saffron-soft border-saffron/40 bg-saffron/10',
  medium: 'text-info border-info/25 bg-info/10',
  low: 'text-ink-muted border-white/10 bg-white/[0.03]',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLE[priority]}`}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

export function Tag({ label }: { label: string }) {
  return <span className="chip">{label}</span>;
}

export function PhaseBadge({ code }: { code: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline bg-white/[0.03] px-2.5 py-0.5 text-xs font-medium text-ink-soft">
      {code}
    </span>
  );
}

const KIND_LABEL: Record<string, string> = {
  documentation: 'Doc',
  task: 'TODO',
  checklist: 'Checklist',
  glossary: 'Glossary',
  calculator: 'Calculator',
  decision: 'Decision',
  recipe: 'Recipe',
  ingredient: 'Ingredient',
  supplier: 'Supplier',
};

export function KindBadge({ kind }: { kind: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-hairline bg-white/[0.04] px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-muted">
      {KIND_LABEL[kind] ?? kind}
    </span>
  );
}
