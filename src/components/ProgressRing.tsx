interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  tone?: 'saffron' | 'info' | 'good';
}

const TONE: Record<NonNullable<Props['tone']>, string> = {
  saffron: '#f5a623',
  info: '#60a5fa',
  good: '#34d399',
};

export function ProgressRing({
  value,
  size = 92,
  stroke = 8,
  label,
  sublabel,
  tone = 'saffron',
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgb(var(--c-tint) / 0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TONE[tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-semibold text-ink">{label ?? `${clamped}%`}</div>
        {sublabel && <div className="text-[0.7rem] text-ink-muted">{sublabel}</div>}
      </div>
    </div>
  );
}

export function ProgressBar({ value, tone = 'saffron' }: { value: number; tone?: Props['tone'] }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-tint/[0.06]">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${clamped}%`, background: TONE[tone ?? 'saffron'] }}
      />
    </div>
  );
}
