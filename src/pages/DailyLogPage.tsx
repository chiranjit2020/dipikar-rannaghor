import { useMemo, useState } from 'react';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { IconChevronRight, IconPlus, IconTrash } from '../components/icons';
import { rupee } from '../lib/costing';
import { formatDate, todayISO } from '../lib/format';
import { useStore } from '../lib/store';
import type { DailyLog } from '../types';

const empty = (date: string): DailyLog => ({
  id: date,
  date,
  ordersZomato: 0,
  ordersSwiggy: 0,
  ordersDirect: 0,
  grossSales: 0,
  discountOwn: 0,
  refunds: 0,
  complaints: 0,
  marketingSpend: 0,
  updatedAt: new Date().toISOString(),
});

export function DailyLogPage() {
  const { dailyLogs, saveItem, deleteItem } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () => [...dailyLogs].sort((a, b) => b.date.localeCompare(a.date)),
    [dailyLogs],
  );

  const logToday = () => {
    const t = todayISO();
    if (!dailyLogs.some((l) => l.id === t)) void saveItem('dailyLogs', empty(t));
    setOpenId(t);
  };

  const save = (l: DailyLog) =>
    void saveItem('dailyLogs', { ...l, updatedAt: new Date().toISOString() });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Log"
        subtitle="প্রতিদিন close-এর সময় ৫ মিনিট — orders, sales, discount, refund, complaint।"
        actions={
          <button className="btn-ghost" onClick={logToday}>
            <IconPlus className="h-4 w-4" /> Log today
          </button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          title="এখনো কোনো দিন লগ করা হয়নি"
          hint="Soft launch-এর আগেও শুরু করো — setup ও purchase দিনগুলোও কাজে লাগবে।"
          action={
            <button className="btn-primary" onClick={logToday}>
              আজকের দিন লগ করো
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {rows.map((l) => {
            const orders = l.ordersZomato + l.ordersSwiggy + l.ordersDirect;
            const net = l.grossSales - l.discountOwn - l.refunds;
            const open = openId === l.id;
            return (
              <div key={l.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : l.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-ink">{formatDate(l.date)}</span>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="chip">{orders} orders</span>
                      <span className="chip">{rupee(l.grossSales)} gross</span>
                      <span className="chip">{rupee(net)} net</span>
                      {l.complaints > 0 && (
                        <span className="chip border-bad/30 bg-bad/10 text-bad">{l.complaints} complaint</span>
                      )}
                    </div>
                  </div>
                  <IconChevronRight className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${open ? 'rotate-90' : ''}`} />
                </button>

                {open && (
                  <div className="space-y-3 border-t border-hairline bg-tint/[0.015] p-4">
                    <label className="block text-xs text-ink-muted">
                      Date
                      <input
                        type="date"
                        className="field mt-1"
                        value={l.date}
                        onChange={(e) => {
                          const nd = e.target.value;
                          if (!nd || nd === l.date) return;
                          void deleteItem('dailyLogs', l.id);
                          void saveItem('dailyLogs', { ...l, id: nd, date: nd, updatedAt: new Date().toISOString() });
                          setOpenId(nd);
                        }}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <Num label="Zomato orders" v={l.ordersZomato} on={(n) => save({ ...l, ordersZomato: n })} />
                      <Num label="Swiggy orders" v={l.ordersSwiggy} on={(n) => save({ ...l, ordersSwiggy: n })} />
                      <Num label="Direct orders" v={l.ordersDirect} on={(n) => save({ ...l, ordersDirect: n })} />
                      <Num label="Gross sales (₹)" v={l.grossSales} on={(n) => save({ ...l, grossSales: n })} step={50} />
                      <Num label="Own discount (₹)" v={l.discountOwn} on={(n) => save({ ...l, discountOwn: n })} step={10} />
                      <Num label="Refunds / cancel (₹)" v={l.refunds} on={(n) => save({ ...l, refunds: n })} step={10} />
                      <Num label="Complaints" v={l.complaints} on={(n) => save({ ...l, complaints: n })} />
                      <Num label="Marketing spend (₹)" v={l.marketingSpend} on={(n) => save({ ...l, marketingSpend: n })} step={50} />
                    </div>
                    <textarea
                      className="field resize-y"
                      rows={2}
                      placeholder="Notes — বড় অভিযোগ, নতুন dish, weather, ইত্যাদি"
                      value={l.notes ?? ''}
                      onChange={(e) => save({ ...l, notes: e.target.value })}
                    />
                    <button
                      onClick={() => {
                        void deleteItem('dailyLogs', l.id);
                        setOpenId(null);
                      }}
                      className="btn-subtle px-2 py-1 text-xs text-bad hover:bg-bad/10"
                    >
                      <IconTrash className="h-4 w-4" /> Delete entry
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Num({
  label,
  v,
  on,
  step = 1,
}: {
  label: string;
  v: number;
  on: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="block text-xs text-ink-muted">
      {label}
      <input
        type="number"
        inputMode="decimal"
        step={step}
        className="field mt-1"
        value={v}
        onChange={(e) => on(parseFloat(e.target.value) || 0)}
      />
    </label>
  );
}
