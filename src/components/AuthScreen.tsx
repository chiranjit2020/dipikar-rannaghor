import { useState } from 'react';

import { useAuth } from '../lib/auth';
import { Brand } from './Brand';

type Tab = 'login' | 'register';

export function AuthScreen() {
  const { register, login, accounts } = useAuth();
  const [tab, setTab] = useState<Tab>(accounts.length > 0 ? 'login' : 'register');
  const [error, setError] = useState<string | null>(null);

  // form state
  const [businessName, setBusinessName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const reset = () => {
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res =
      tab === 'register'
        ? register({ businessName, username, password, confirmPassword })
        : login(username, password);
    if (!res.ok) setError(res.error);
    // on success the AuthProvider sets a session → App swaps to the app.
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Brand />
        </div>

        <div className="card overflow-hidden">
          <div className="grid grid-cols-2 border-b border-hairline text-sm font-medium">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  reset();
                }}
                className={`py-3 transition-colors ${
                  tab === t ? 'bg-saffron/10 text-saffron-soft' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3 p-5">
            {tab === 'register' && (
              <label className="block text-xs text-ink-muted">
                Business Name
                <input
                  className="field mt-1"
                  autoFocus
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="যেমন: Dipikar Rannghor"
                />
              </label>
            )}

            <label className="block text-xs text-ink-muted">
              Username
              <input
                className="field mt-1"
                autoFocus={tab === 'login'}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="block text-xs text-ink-muted">
              Password
              <input
                type="password"
                className="field mt-1"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {tab === 'register' && (
              <label className="block text-xs text-ink-muted">
                Confirm Password
                <input
                  type="password"
                  className="field mt-1"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            )}

            {error && (
              <p className="rounded-lg border border-bad/30 bg-bad/10 px-3 py-2 text-xs text-bad">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full">
              {tab === 'register' ? 'Register & enter dashboard' : 'Login'}
            </button>

            {tab === 'login' && accounts.length > 0 && (
              <p className="text-center text-xs text-ink-muted">
                {accounts.length} local profile{accounts.length > 1 ? 's' : ''}:{' '}
                {accounts.map((a) => a.businessName).join(', ')}
              </p>
            )}
          </form>
        </div>

        <p className="mt-4 rounded-xl border border-warn/25 bg-warn/[0.07] px-4 py-3 text-xs leading-relaxed text-warn">
          ⚠ <strong>Temporary local authentication for testing only.</strong> This is not secure
          auth — profiles &amp; passwords are stored in plain text in this browser's localStorage,
          nothing is sent anywhere. It will be replaced by Supabase Auth later.
        </p>
      </div>
    </div>
  );
}
