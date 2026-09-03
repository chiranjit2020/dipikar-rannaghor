import { Link } from 'react-router-dom';

import { PageHeader } from '../components/PageHeader';
import { ProgressBar, ProgressRing } from '../components/ProgressRing';
import { TaskCard } from '../components/TaskCard';
import { milestones } from '../content/milestones';
import { phases } from '../content/phases';
import { costRecipe, foodCostTone } from '../lib/costing';
import { PRIORITY_RANK, STATUS_LABEL } from '../lib/format';
import {
  useCurrentPhase,
  usePhaseProgress,
  useProgress,
  useStore,
} from '../lib/store';

function StatTile({ label, value, tone }: { label: string; value: number | string; tone?: string }) {
  return (
    <div className="card px-4 py-3.5">
      <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone ?? 'text-ink'}`}>{value}</p>
    </div>
  );
}

export function Dashboard() {
  const progress = useProgress();
  const phaseProgress = usePhaseProgress();
  const current = useCurrentPhase();
  const { tasks, decisions, recipes, ingredients } = useStore();

  const ingredientById = Object.fromEntries(ingredients.map((i) => [i.id, i]));
  const recipeCostings = recipes.map((r) => costRecipe(r, ingredientById));
  const avgFoodCostPct =
    recipeCostings.length > 0
      ? recipeCostings.reduce((s, c) => s + c.foodCostPct, 0) / recipeCostings.length
      : 0;
  const heroCount = recipes.filter((r) => r.isHero).length;

  const currentPhaseMeta = phases.find((p) => p.id === current.phase);
  const currentMilestone = milestones.find((m) => m.id === currentPhaseMeta?.milestone);

  const focus = [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const s = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (s !== 0) return s;
      return (a.status === 'in-progress' ? -1 : 0) - (b.status === 'in-progress' ? -1 : 0);
    })
    .slice(0, 4);

  const upcoming = tasks
    .filter((t) => t.status === 'todo' || t.status === 'in-progress')
    .filter((t) => !focus.includes(t))
    .slice(0, 5);

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        subtitle="আজ কী শিখব, আজ কী করব — এক নজরে।"
      />

      {/* Current phase / milestone */}
      <section className="card overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <ProgressRing value={current.pctValue} label={`${current.pctValue}%`} sublabel="phase" />
          <div className="min-w-0 flex-1">
            <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Current phase</p>
            <h2 className="mt-0.5 text-lg">
              {current.code} — {current.title}
            </h2>
            {currentMilestone && (
              <p className="mt-1 text-sm text-ink-muted">
                Milestone <span className="text-saffron-soft">{currentMilestone.id}</span> · {currentMilestone.title}
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink-soft">
              <span>{current.docsRead}/{current.docsTotal} docs read</span>
              <span>{current.tasksDone}/{current.tasksTotal} tasks done</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two progress tracks */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Learning Progress</p>
            <span className="text-sm text-info">{progress.learningPct}%</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={progress.learningPct} tone="info" />
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {progress.docsRead} / {progress.docsTotal} documentation পড়া হয়েছে
          </p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ink">Execution Progress</p>
            <span className="text-sm text-saffron-soft">{progress.executionPct}%</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={progress.executionPct} tone="saffron" />
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            {progress.tasksDone} / {progress.tasksTotal} task সম্পন্ন — পড়া মানেই কাজ শেষ নয়
          </p>
        </div>
      </section>

      {/* Stat tiles */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Open TODO" value={progress.openTasks} />
        <StatTile label="Critical open" value={progress.criticalOpen} tone={progress.criticalOpen ? 'text-bad' : 'text-ink'} />
        <StatTile label="In progress" value={progress.inProgress} tone="text-saffron-soft" />
        <StatTile label="Checklist" value={`${progress.checklistDone}/${progress.checklistTotal}`} />
      </section>

      {/* Focus tasks */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg">আজকের focus</h2>
          <Link to="/todo" className="link text-sm">সব TODO →</Link>
        </div>
        <div className="space-y-3">
          {focus.length === 0 && (
            <p className="card px-4 py-6 text-center text-sm text-ink-muted">সব task শেষ! 🎉</p>
          )}
          {focus.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </section>

      {/* Upcoming + phase strip */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-medium text-ink">Upcoming tasks</h3>
          <ul className="mt-3 space-y-2.5">
            {upcoming.length === 0 && <li className="text-sm text-ink-muted">কিছু নেই।</li>}
            {upcoming.map((t) => (
              <li key={t.id} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron/70" />
                <Link to={`/todo#${t.id}`} className="flex-1 text-ink-soft hover:text-ink">
                  {t.task}
                </Link>
                <span className="shrink-0 text-xs text-ink-muted">{STATUS_LABEL[t.status]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink">Phase progress</h3>
            <Link to="/roadmap" className="link text-xs">Roadmap →</Link>
          </div>
          <ul className="mt-3 space-y-2.5">
            {phaseProgress.map((p) => (
              <li key={p.phase}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-ink-soft">{p.code} · {p.title}</span>
                  <span className="text-ink-muted">{p.pctValue}%</span>
                </div>
                <ProgressBar value={p.pctValue} tone={p.pctValue === 100 ? 'good' : 'saffron'} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Kitchen snapshot */}
      {recipes.length > 0 && (
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink">Kitchen</h3>
            <Link to="/recipes" className="link text-xs">Recipes →</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Recipes</p>
              <p className="text-xl font-semibold text-ink">{recipes.length}</p>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Hero</p>
              <p className="text-xl font-semibold text-ink">{heroCount}</p>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Ingredients</p>
              <p className="text-xl font-semibold text-ink">{ingredients.length}</p>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Avg Food Cost %</p>
              <p className={`text-xl font-semibold ${foodCostTone(avgFoodCostPct)}`}>
                {avgFoodCostPct.toFixed(0)}%
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recent decisions */}
      {decisions.length > 0 && (
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink">Recent decisions</h3>
            <Link to="/decisions" className="link text-xs">Decision Log →</Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {decisions.slice(0, 3).map((d) => (
              <li key={d.id} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron/70" />
                <span className="text-ink-soft">{d.decision}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
