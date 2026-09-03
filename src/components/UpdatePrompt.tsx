import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 mx-auto w-fit max-w-[92vw] lg:bottom-6">
      <div className="card flex items-center gap-3 px-4 py-3 text-sm">
        <span className="text-ink-soft">
          {needRefresh ? 'নতুন version পাওয়া গেছে।' : 'App এখন offline-এও চলবে।'}
        </span>
        {needRefresh && (
          <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => void updateServiceWorker(true)}>
            Refresh
          </button>
        )}
        <button
          className="btn-subtle px-2 py-1 text-xs"
          onClick={() => {
            setOfflineReady(false);
            setNeedRefresh(false);
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
