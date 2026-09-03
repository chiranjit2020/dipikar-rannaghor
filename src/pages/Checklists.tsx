import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressRing';
import { PhaseBadge } from '../components/badges';
import { checklists } from '../content/checklists';
import { phaseById } from '../content/phases';
import { pct } from '../lib/format';
import { useStore } from '../lib/store';

export function Checklists() {
  const { checklistState, toggleChecklistItem } = useStore();

  return (
    <div className="space-y-6">
      <PageHeader title="Checklists" subtitle="Launch, opening, closing ও compliance — tick করো, progress দেখো।" />

      {checklists.map((c) => {
        const st = checklistState[c.id] ?? {};
        const done = c.items.filter((i) => st[i.id]).length;
        const percentage = pct(done, c.items.length);
        return (
          <section key={c.id} id={c.id} className="card overflow-hidden">
            <div className="border-b border-hairline p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg">{c.title}</h2>
                <PhaseBadge code={phaseById[c.phase]?.code ?? c.phase} />
                <span className="ml-auto text-sm text-ink-muted">{done}/{c.items.length} · {percentage}%</span>
              </div>
              <p className="mt-1 text-sm text-ink-muted">{c.description}</p>
              <div className="mt-3">
                <ProgressBar value={percentage} tone={percentage === 100 ? 'good' : 'saffron'} />
              </div>
            </div>
            <ul className="divide-y divide-white/5">
              {c.items.map((item) => {
                const checked = !!st[item.id];
                return (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => void toggleChecklistItem(c.id, item.id, e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-saffron"
                      />
                      <span className={`text-sm ${checked ? 'text-ink-muted line-through' : 'text-ink-soft'}`}>
                        {item.label}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
