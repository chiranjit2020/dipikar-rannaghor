import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { search } from '../lib/search';
import { useStore } from '../lib/store';
import { KindBadge } from './badges';
import { IconSearch } from './icons';

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { tasks, decisions } = useStore();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => (open ? search(q, { tasks, decisions }) : []),
    [q, open, tasks, decisions],
  );

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === 'Enter' && results[active]) {
        navigate(results[active].to);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, navigate, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[10vh] backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="card w-full max-w-xl overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
          <IconSearch className="h-5 w-5 shrink-0 text-ink-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documentation, TODO, checklist, glossary…"
            className="w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-muted"
          />
          <kbd className="hidden shrink-0 rounded-md border border-hairline px-1.5 py-0.5 text-[0.7rem] text-ink-muted sm:block">
            Esc
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {q.length < 2 && (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">
              অন্তত ২টি অক্ষর লিখুন। Documentation, TODO, checklist, glossary ও calculator একসাথে খোঁজা হবে।
            </p>
          )}
          {q.length >= 2 && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">কিছু পাওয়া গেল না।</p>
          )}
          {results.map((r, i) => (
            <button
              key={`${r.kind}-${r.id}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                navigate(r.to);
                onClose();
              }}
              className={`flex w-full flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition-colors ${
                i === active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
              }`}
            >
              <span className="flex items-center gap-2">
                <KindBadge kind={r.kind} />
                <span className="line-clamp-1 text-sm font-medium text-ink">{r.title}</span>
              </span>
              <span className="line-clamp-1 text-xs text-ink-muted">
                {r.category ? `${r.category} · ` : ''}
                {r.excerpt}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
