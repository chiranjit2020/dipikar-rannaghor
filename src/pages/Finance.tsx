import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressRing';
import { rupee } from '../lib/costing';
import { PERIODS, buildPnL, makePeriod, type PeriodKey } from '../lib/finance';
import { useStore } from '../lib/store';

export function Finance() {
  const { dailyLogs, expenses, settings, calculatorState } = useStore();
  const [periodKey, setPeriodKey] = useState<PeriodKey>('month');

  const period = useMemo(() => makePeriod(periodKey), [periodKey]);
  const pnl = useMemo(
    () => buildPnL(dailyLogs, expenses, period, settings.platformCommissionPct),
    [dailyLogs, expenses, period, settings.platformCommissionPct],
  );

  // Break-even reference from the calculator, if the user has run it.
  const be = calculatorState.breakEven as
    | { fixed: number; aov: number; variable: number; days: number }
    | undefined;
  const beMonthlyRevenue =
    be && be.aov - be.variable > 0
      ? (be.fixed / (be.aov - be.variable)) * be.aov
      : undefined;
  const beForPeriod =
    beMonthlyRevenue != null && period.days > 0
      ? (beMonthlyRevenue / 30) * period.days
      : beMonthlyRevenue;

  if (dailyLogs.length === 0 && expenses.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Finance" subtitle="Daily Log + Expenses থেকে P&L।" />
        <EmptyState
          title="P&L-এর জন্য data দরকার"
          hint="কয়েকদিন Daily Log ভরো আর কিছু Expense যোগ করো — এই পাতা নিজে থেকেই হিসাব করবে।"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/daily" className="btn-primary">Daily Log</Link>
              <Link to="/expenses" className="btn-ghost">Expenses</Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance"
        subtitle="Daily Log + Expenses থেকে estimated P&L। Commission একটি estimate।"
      />

      <div className="flex flex-wrap gap-1.5">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriodKey(p)}
            className={`chip ${periodKey === p ? 'chip-active' : 'hover:text-ink'}`}
          >
            {makePeriod(p).label}
          </button>
        ))}
      </div>

      {/* Headline */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Tile label="Orders" value={pnl.orders.toString()} sub={`${pnl.daysWithData} days logged`} />
        <Tile label="Gross sales" value={rupee(pnl.grossSales)} sub={`AOV ${rupee(pnl.aov)}`} />
        <Tile
          label="Est. profit / loss"
          value={rupee(Math.round(pnl.estProfit))}
          tone={pnl.estProfit >= 0 ? 'text-good' : 'text-bad'}
          sub={pnl.estProfit >= 0 ? 'positive' : 'negative'}
        />
      </section>

      {/* P&L statement */}
      <section className="card p-5">
        <p className="section-title mb-3">P&L — {period.label}</p>
        <dl className="space-y-1.5 text-sm">
          <Line label="Gross sales" value={pnl.grossSales} />
          <Line label="− Own discount" value={-pnl.discountOwn} muted />
          <Line label="− Refunds / cancellations" value={-pnl.refunds} muted />
          <Line label="Net sales" value={pnl.netSales} strong />
          <Line
            label={`− Est. platform commission (${settings.platformCommissionPct}%)`}
            value={-pnl.estCommission}
            muted
          />
          <Line label="Est. net revenue" value={pnl.estNetRevenue} strong />
          <div className="my-2 border-t border-hairline" />
          {Object.entries(pnl.expensesByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amt]) => (
              <Line key={cat} label={`− ${cat}`} value={-amt} muted />
            ))}
          <Line label="Total expenses" value={-pnl.totalExpenses} strong />
          <div className="my-2 border-t border-hairline" />
          <Line
            label="Estimated profit / loss"
            value={pnl.estProfit}
            strong
            tone={pnl.estProfit >= 0 ? 'text-good' : 'text-bad'}
          />
        </dl>
      </section>

      {/* Break-even reference */}
      {beForPeriod != null && (
        <section className="card p-5">
          <p className="section-title mb-2">Break-even reference</p>
          <p className="text-sm text-ink-soft">
            {period.label}-এ break-even net sales ≈ <span className="text-ink">{rupee(Math.round(beForPeriod))}</span>.
            তুমি এখন <span className={pnl.netSales >= beForPeriod ? 'text-good' : 'text-warn'}>
              {rupee(Math.round(pnl.netSales))}
            </span> ({beForPeriod > 0 ? Math.round((pnl.netSales / beForPeriod) * 100) : 0}%)।
          </p>
          <div className="mt-2">
            <ProgressBar
              value={beForPeriod > 0 ? (pnl.netSales / beForPeriod) * 100 : 0}
              tone={pnl.netSales >= beForPeriod ? 'good' : 'saffron'}
            />
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            <Link to="/calculators" className="link">Break-even Calculator</Link>-এর সংখ্যা থেকে।
          </p>
        </section>
      )}

      {/* Platform split */}
      <section className="card p-5">
        <p className="section-title mb-3">Order split</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {(['zomato', 'swiggy', 'direct'] as const).map((k) => (
            <div key={k}>
              <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">{k}</p>
              <p className="text-ink">{pnl.ordersByPlatform[k]}</p>
            </div>
          ))}
        </div>
        {pnl.marketingFromLogs > 0 && (
          <p className="mt-3 text-xs text-ink-muted">
            Daily Log-এ লেখা marketing spend: {rupee(pnl.marketingFromLogs)} (Expenses-এ আলাদাভাবে যোগ কোরো না — double count হবে)।
          </p>
        )}
      </section>

      <p className="text-xs text-ink-muted">
        ⚠ Commission ও profit estimate — প্রকৃত food cost জানতে closing-stock adjustment দরকার
        (<Link to="/docs/finance-tracking" className="link">Finance Tracking</Link> doc দেখো)।
        Commission % Settings-এ বদলানো যায়।
      </p>
    </div>
  );
}

function Tile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="card px-4 py-3.5">
      <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone ?? 'text-ink'}`}>{value}</p>
      {sub && <p className="text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}

function Line({
  label,
  value,
  strong,
  muted,
  tone,
}: {
  label: string;
  value: number;
  strong?: boolean;
  muted?: boolean;
  tone?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={`${strong ? 'font-medium text-ink' : muted ? 'text-ink-muted' : 'text-ink-soft'}`}>
        {label}
      </dt>
      <dd
        className={`tabular-nums ${strong ? 'font-semibold' : ''} ${
          tone ?? (strong ? 'text-ink' : muted ? 'text-ink-muted' : 'text-ink-soft')
        }`}
      >
        {value < 0 ? `−${rupee(Math.abs(value))}` : rupee(value)}
      </dd>
    </div>
  );
}
