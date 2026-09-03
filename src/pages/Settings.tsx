import { useRef, useState } from 'react';

import { PageHeader } from '../components/PageHeader';
import { IconDownload, IconUpload } from '../components/icons';
import { getStorage } from '../lib/storage';
import { useProgress, useStore } from '../lib/store';

export function Settings() {
  const { storageName, settings, setSettings, refresh } = useStore();
  const progress = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function doExport() {
    const data = await getStorage().exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dipikar-rannghor-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Backup export হয়েছে।');
  }

  async function doImport(file: File) {
    try {
      const data = JSON.parse(await file.text());
      await getStorage().importAll(data);
      await refresh();
      setMsg('Backup import হয়েছে।');
    } catch {
      setMsg('Import ব্যর্থ — ফাইলটি সঠিক backup কিনা দেখো।');
    }
  }

  async function doClear() {
    if (!confirm('সব local data মুছে যাবে (task status, checklist, notes, decisions)। নিশ্চিত?')) return;
    await getStorage().clearAll();
    await refresh();
    setMsg('সব local data মুছে ফেলা হয়েছে।');
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Data, backup ও preferences।" />

      <section className="card p-5">
        <h2 className="text-base font-medium text-ink">Storage</h2>
        <p className="mt-1 text-sm text-ink-muted">
          এখন backend: <span className="text-ink-soft">{storageName}</span>. সব data শুধু এই browser-এ থাকে —
          অন্য device-এ sync হয় না। ভবিষ্যতে Supabase যুক্ত হলে এই layer বদলাবে, বাকি app একই থাকবে।
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div><dt className="text-xs text-ink-muted">Docs read</dt><dd className="text-ink">{progress.docsRead}/{progress.docsTotal}</dd></div>
          <div><dt className="text-xs text-ink-muted">Tasks done</dt><dd className="text-ink">{progress.tasksDone}/{progress.tasksTotal}</dd></div>
          <div><dt className="text-xs text-ink-muted">Checklist</dt><dd className="text-ink">{progress.checklistDone}/{progress.checklistTotal}</dd></div>
          <div><dt className="text-xs text-ink-muted">Open TODO</dt><dd className="text-ink">{progress.openTasks}</dd></div>
        </dl>
      </section>

      <section className="card p-5">
        <h2 className="text-base font-medium text-ink">Backup</h2>
        <p className="mt-1 text-sm text-ink-muted">
          নিয়মিত export করো — browser data clear হলে সব হারাবে।
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => void doExport()}>
            <IconDownload className="h-4 w-4" /> Export backup
          </button>
          <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
            <IconUpload className="h-4 w-4" /> Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = '';
            }}
          />
          <button className="btn-subtle text-bad hover:bg-bad/10" onClick={() => void doClear()}>
            Clear all data
          </button>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-base font-medium text-ink">Preferences</h2>
        <label className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-ink-soft">
            Platform commission %{' '}
            <span className="text-ink-muted">(Finance P&L estimate)</span>
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={settings.platformCommissionPct}
            onChange={(e) =>
              void setSettings({ platformCommissionPct: parseFloat(e.target.value) || 0 })
            }
            className="field w-24"
          />
        </label>
        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-ink-soft">Theme</span>
          <div className="flex gap-1.5">
            {(['dark', 'light'] as const).map((t) => (
              <button
                key={t}
                onClick={() => void setSettings({ theme: t })}
                className={`chip ${settings.theme === t ? 'chip-active' : 'hover:text-ink'}`}
              >
                {t === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
        </div>
        <label className="mt-3 flex items-center justify-between gap-4 text-sm">
          <span className="text-ink-soft">
            Compact density <span className="text-ink-muted">(ছোট text ও spacing)</span>
          </span>
          <input
            type="checkbox"
            checked={settings.compact}
            onChange={(e) => void setSettings({ compact: e.target.checked })}
            className="h-4 w-4 accent-saffron"
          />
        </label>
      </section>

      {msg && (
        <p className="rounded-xl border border-good/30 bg-good/10 px-4 py-3 text-sm text-good">{msg}</p>
      )}

      <p className="text-center text-xs text-ink-muted">
        Dipikar Rannghor · GitHub Pages + localStorage · architected for Supabase
      </p>
    </div>
  );
}
