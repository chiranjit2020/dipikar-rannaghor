import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { useCurrentPhase, useProgress } from '../lib/store';
import { Brand } from './Brand';
import { ProgressBar } from './ProgressRing';
import { SearchModal } from './SearchModal';
import { MOBILE_NAV, NAV, NAV_GROUPS } from './nav';
import { IconClose, IconGrid, IconSearch } from './icons';

function DesktopSidebar() {
  const progress = useProgress();
  const phase = useCurrentPhase();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-hairline bg-surface/60 backdrop-blur-md lg:flex">
      <div className="px-5 py-5">
        <Brand />
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((g) => (
          <div key={g}>
            <p className="px-3 pb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              {g}
            </p>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === g).map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-saffron/12 text-saffron-soft'
                        : 'text-ink-soft hover:bg-tint/[0.04] hover:text-ink'
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-hairline bg-tint/[0.02] p-3.5">
        <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Current phase</p>
        <p className="mt-1 text-sm font-medium text-ink">
          {phase.code} — {phase.title}
        </p>
        <div className="mt-2.5 space-y-2">
          <div>
            <div className="mb-1 flex justify-between text-[0.7rem] text-ink-muted">
              <span>Learning</span>
              <span>{progress.learningPct}%</span>
            </div>
            <ProgressBar value={progress.learningPct} tone="info" />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[0.7rem] text-ink-muted">
              <span>Execution</span>
              <span>{progress.executionPct}%</span>
            </div>
            <ProgressBar value={progress.executionPct} tone="saffron" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-base/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <Brand />
        <button onClick={onClose} className="btn-subtle p-2" aria-label="Close">
          <IconClose className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {NAV_GROUPS.map((g) => (
          <div key={g}>
            <p className="section-title mb-2">{g}</p>
            <div className="grid grid-cols-2 gap-2">
              {NAV.filter((n) => n.group === g).map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl border border-hairline px-3 py-3 text-sm font-medium ${
                      isActive ? 'bg-saffron/12 text-saffron-soft' : 'bg-surface-2/50 text-ink-soft'
                    }`
                  }
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

function MobileTabBar({ onMore }: { onMore: () => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-hairline bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      {MOBILE_NAV.map(({ to, label, short, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[0.68rem] font-medium transition-colors ${
              isActive ? 'text-saffron-soft' : 'text-ink-muted'
            }`
          }
        >
          <Icon className="h-[20px] w-[20px]" />
          <span className="max-w-full truncate">{short ?? label}</span>
        </NavLink>
      ))}
      <button
        onClick={onMore}
        className="flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[0.68rem] font-medium text-ink-muted"
      >
        <IconGrid className="h-[20px] w-[20px]" />
        <span>More</span>
      </button>
    </nav>
  );
}

export function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMoreOpen(false);
  }, [pathname]);

  const title = [...NAV]
    .sort((a, b) => b.to.length - a.to.length)
    .find((n) => (n.end ? n.to === pathname : pathname.startsWith(n.to)))?.label;

  return (
    <div className="min-h-dvh overflow-x-hidden lg:pl-64">
      <DesktopSidebar />

      <header className="sticky top-0 z-20 border-b border-hairline bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          <div className="lg:hidden">
            <Brand compact />
          </div>
          <span className="hidden text-sm font-medium text-ink-soft lg:block">{title}</span>
          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto flex items-center gap-2.5 rounded-xl border border-hairline bg-surface-2/60 px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-tint/15 hover:text-ink-soft"
          >
            <IconSearch className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden rounded-md border border-hairline px-1.5 text-[0.7rem] md:inline">
              Ctrl K
            </kbd>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-28 pt-6 sm:px-6 lg:pb-16">
        <Outlet />
      </main>

      <MobileTabBar onMore={() => setMoreOpen(true)} />
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
