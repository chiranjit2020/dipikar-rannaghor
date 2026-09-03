export interface FilterGroup {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface Props {
  groups: FilterGroup[];
  value: Record<string, string | null>;
  onChange: (key: string, value: string | null) => void;
  onReset: () => void;
}

export function FilterBar({ groups, value, onChange, onReset }: Props) {
  const anyActive = Object.values(value).some(Boolean);

  return (
    <div className="space-y-2.5">
      {groups.map((g) => (
        <div key={g.key} className="flex items-center gap-1.5">
          <span className="w-16 shrink-0 text-xs font-medium text-ink-muted">{g.label}</span>
          <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {g.options.map((opt) => {
              const active = value[g.key] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange(g.key, active ? null : opt.value)}
                  className={`chip shrink-0 ${active ? 'chip-active' : 'hover:text-ink'}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {anyActive && (
        <button onClick={onReset} className="btn-subtle px-2 py-1 text-xs">
          Reset filters
        </button>
      )}
    </div>
  );
}
