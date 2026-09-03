export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ffb84d] to-saffron-deep text-lg shadow-glow">
        🍚
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[0.95rem] font-semibold text-ink">Dipikar Rannghor</span>
          <span className="block text-[0.7rem] text-ink-muted">Cloud Kitchen OS · seed</span>
        </span>
      )}
    </div>
  );
}
