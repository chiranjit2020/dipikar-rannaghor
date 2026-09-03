import { useState } from 'react';

import { phaseById } from '../content/phases';
import { STATUS_LABEL, STATUS_ORDER, formatDate } from '../lib/format';
import { useStore } from '../lib/store';
import type { Task, TaskStatus } from '../types';
import { PhaseBadge, PriorityBadge, StatusBadge } from './badges';
import { IconChevronRight, IconTrash } from './icons';

export function TaskCard({ task, defaultOpen = false }: { task: Task; defaultOpen?: boolean }) {
  const { setTaskStatus, setTaskNotes, deleteTask, tasks } = useStore();
  const [open, setOpen] = useState(defaultOpen);
  const [notes, setNotes] = useState(task.notes ?? '');

  const dep = task.dependency ? tasks.find((t) => t.id === task.dependency) : undefined;
  const depBlocked = dep && dep.status !== 'done';

  return (
    <div className="card card-hover overflow-hidden" id={task.id}>
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={() => {
            const next: TaskStatus = task.status === 'done' ? 'todo' : 'done';
            void setTaskStatus(task.id, next);
          }}
          aria-label="Toggle done"
          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
            task.status === 'done'
              ? 'border-good bg-good/20 text-good'
              : 'border-tint/20 text-transparent hover:border-tint/40'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </button>

        <div className="min-w-0 flex-1">
          <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-2 text-left">
            <span
              className={`flex-1 text-sm font-medium ${
                task.status === 'done' ? 'text-ink-muted line-through' : 'text-ink'
              }`}
            >
              {task.task}
            </span>
            <IconChevronRight
              className={`mt-0.5 h-4 w-4 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-90' : ''}`}
            />
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            <PhaseBadge code={phaseById[task.phase]?.code ?? task.phase} />
            <span className="chip">{task.category}</span>
            {task.custom && <span className="chip">Custom</span>}
            {depBlocked && (
              <span className="chip border-bad/30 bg-bad/10 text-bad">
                Blocked by: {dep!.task.slice(0, 28)}…
              </span>
            )}
            {task.dueDate && <span className="chip">Due {formatDate(task.dueDate)}</span>}
          </div>
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-hairline bg-tint/[0.015] px-4 py-4">
          <div>
            <p className="section-title mb-1.5">Completion criteria</p>
            <p className="text-sm text-ink-soft">{task.completionCriteria}</p>
          </div>

          <div>
            <p className="section-title mb-1.5">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_ORDER.map((s) => (
                <button
                  key={s}
                  onClick={() => void setTaskStatus(task.id, s)}
                  className={`chip ${task.status === s ? 'chip-active' : 'hover:text-ink'}`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="section-title mb-1.5">Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => notes !== (task.notes ?? '') && void setTaskNotes(task.id, notes)}
              rows={2}
              placeholder="তোমার progress, blocker বা reference এখানে লেখো…"
              className="field resize-y"
            />
          </div>

          {task.custom && (
            <button
              onClick={() => void deleteTask(task.id)}
              className="btn-subtle px-2 py-1 text-xs text-bad hover:bg-bad/10"
            >
              <IconTrash className="h-4 w-4" /> Delete task
            </button>
          )}
        </div>
      )}
    </div>
  );
}
