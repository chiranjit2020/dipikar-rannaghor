import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressRing';
import { milestones, roadmap } from '../content/milestones';
import { phaseById } from '../content/phases';
import { usePhaseProgress, useCurrentPhase } from '../lib/store';

const STATUS_STYLE = {
  current: 'border-saffron/50 bg-saffron/10 text-saffron-soft',
  next: 'border-info/40 bg-info/10 text-info',
  planned: 'border-white/10 bg-white/[0.03] text-ink-muted',
} as const;

export function Roadmap() {
  const phaseProgress = usePhaseProgress();
  const current = useCurrentPhase();
  const currentMilestoneId = phaseById[current.phase]?.milestone;
  const currentMilestoneIdx = milestones.findIndex((m) => m.id === currentMilestoneId);

  return (
    <div className="space-y-8">
      <PageHeader title="Roadmap" subtitle="Business milestone M0–M11 এবং app-এর version roadmap।" />

      <section>
        <h2 className="mb-4 text-lg">Business milestones</h2>
        <ol className="relative space-y-1 border-l border-hairline pl-6">
          {milestones.map((m, i) => {
            const reached = i < currentMilestoneIdx;
            const isCurrent = i === currentMilestoneIdx;
            return (
              <li key={m.id} className="relative pb-4">
                <span
                  className={`absolute -left-[1.65rem] top-1 grid h-4 w-4 place-items-center rounded-full border ${
                    reached
                      ? 'border-good bg-good/30'
                      : isCurrent
                        ? 'border-saffron bg-saffron/30'
                        : 'border-white/15 bg-surface'
                  }`}
                />
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isCurrent ? 'text-saffron-soft' : reached ? 'text-good' : 'text-ink'}`}>
                    {m.id}
                  </span>
                  <span className="text-sm font-medium text-ink">{m.title}</span>
                  {isCurrent && <span className="chip chip-active">You are here</span>}
                </div>
                <p className="mt-0.5 text-sm text-ink-muted">{m.description}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-lg">Phase progress</h2>
        <div className="space-y-3">
          {phaseProgress.map((p) => (
            <div key={p.phase} className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{p.code} — {p.title}</span>
                <span className="text-xs text-ink-muted">
                  {p.docsRead}/{p.docsTotal} docs · {p.tasksDone}/{p.tasksTotal} tasks · {p.pctValue}%
                </span>
              </div>
              <ProgressBar value={p.pctValue} tone={p.pctValue === 100 ? 'good' : 'saffron'} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg">App version roadmap</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {roadmap.map((v) => (
            <div key={v.version} className="card p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">{v.version}</span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[0.7rem] font-medium ${STATUS_STYLE[v.status]}`}>
                  {v.status}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-ink-soft">{v.title}</p>
              <ul className="mt-2 space-y-1 text-xs text-ink-muted">
                {v.scope.map((s) => (
                  <li key={s} className="flex gap-1.5">
                    <span className="text-saffron/70">·</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
