import type { ReactNode } from 'react';

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-hairline bg-white/[0.03] text-xl">
        🍚
      </div>
      <p className="text-base font-medium text-ink">{title}</p>
      {hint && <p className="max-w-sm text-sm text-ink-muted">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
