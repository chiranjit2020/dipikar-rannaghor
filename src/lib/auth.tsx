import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { migrateLegacyWorkspace } from './storage';

/**
 * ⚠️ TEMPORARY LOCAL AUTH — FOR TESTING ONLY. NOT SECURE.
 *
 * A thin localStorage-only registration/login wrapper so several people can
 * test the PWA in separate local workspaces on one browser. Passwords are
 * stored in plain text on purpose — a prototype should not fake security with
 * hand-rolled hashing. This whole module is designed to be deleted wholesale
 * when Supabase Auth replaces it; the app only ever receives a `scope` string.
 */

const USERS_KEY = 'dr.auth.users';
const SESSION_KEY = 'dr.auth.session';

export interface AuthAccount {
  userId: string;
  businessName: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface AuthUser {
  userId: string;
  businessName: string;
  username: string;
}

/** The storage scope for a given user's workspace. */
export function scopeFor(userId: string): string {
  return `dr.u.${userId}.`;
}

interface Session {
  userId: string;
  since: string;
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function newUserId(): string {
  const n = loadJSON<AuthAccount[]>(USERS_KEY, []).length + 1;
  return `user_${String(n).padStart(3, '0')}_${Math.random().toString(36).slice(2, 6)}`;
}

export interface RegisterInput {
  businessName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface AuthValue {
  ready: boolean;
  user: AuthUser | null;
  /** Public listing (no passwords) — for the "existing profiles" hint. */
  accounts: AuthUser[];
  register: (input: RegisterInput) => { ok: true } | { ok: false; error: string };
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accounts, setAccounts] = useState<AuthAccount[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setAccounts(loadJSON<AuthAccount[]>(USERS_KEY, []));
    setSession(loadJSON<Session | null>(SESSION_KEY, null));
    setReady(true);
  }, []);

  const persistAccounts = useCallback((next: AuthAccount[]) => {
    setAccounts(next);
    saveJSON(USERS_KEY, next);
  }, []);

  const persistSession = useCallback((next: Session | null) => {
    setSession(next);
    if (next) saveJSON(SESSION_KEY, next);
    else localStorage.removeItem(SESSION_KEY);
  }, []);

  const register = useCallback<AuthValue['register']>(
    ({ businessName, username, password, confirmPassword }) => {
      const b = businessName.trim();
      const u = username.trim();
      if (b.length < 2) return { ok: false, error: 'Business name অন্তত ২ অক্ষর দাও।' };
      if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(u))
        return { ok: false, error: 'Username: ৩–২৪ অক্ষর, শুধু letters, digits, . _ -' };
      if (password.length < 4) return { ok: false, error: 'Password অন্তত ৪ অক্ষর দাও।' };
      if (password !== confirmPassword) return { ok: false, error: 'Password দুটো মিলছে না।' };
      if (accounts.some((a) => a.username.toLowerCase() === u.toLowerCase()))
        return { ok: false, error: 'এই username ইতিমধ্যে আছে।' };

      const isFirstEver = accounts.length === 0;
      const account: AuthAccount = {
        userId: newUserId(),
        businessName: b,
        username: u,
        password,
        createdAt: new Date().toISOString(),
      };
      persistAccounts([...accounts, account]);
      if (isFirstEver) migrateLegacyWorkspace(scopeFor(account.userId));
      persistSession({ userId: account.userId, since: new Date().toISOString() });
      return { ok: true };
    },
    [accounts, persistAccounts, persistSession],
  );

  const login = useCallback<AuthValue['login']>(
    (username, password) => {
      const acc = accounts.find(
        (a) => a.username.toLowerCase() === username.trim().toLowerCase(),
      );
      if (!acc || acc.password !== password)
        return { ok: false, error: 'Username বা password ভুল।' };
      persistSession({ userId: acc.userId, since: new Date().toISOString() });
      return { ok: true };
    },
    [accounts, persistSession],
  );

  const logout = useCallback(() => persistSession(null), [persistSession]);

  const user = useMemo<AuthUser | null>(() => {
    if (!session) return null;
    const acc = accounts.find((a) => a.userId === session.userId);
    return acc
      ? { userId: acc.userId, businessName: acc.businessName, username: acc.username }
      : null;
  }, [session, accounts]);

  const publicAccounts = useMemo<AuthUser[]>(
    () => accounts.map((a) => ({ userId: a.userId, businessName: a.businessName, username: a.username })),
    [accounts],
  );

  const value: AuthValue = {
    ready,
    user,
    accounts: publicAccounts,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
