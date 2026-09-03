import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell';
import { AuthScreen } from './components/AuthScreen';
import { UpdatePrompt } from './components/UpdatePrompt';
import { AuthProvider, scopeFor, useAuth } from './lib/auth';
import { StoreProvider, useStore } from './lib/store';
import { Calculators } from './pages/Calculators';
import { Checklists } from './pages/Checklists';
import { Dashboard } from './pages/Dashboard';
import { DecisionLog } from './pages/DecisionLog';
import { DocDetail } from './pages/DocDetail';
import { DocsList } from './pages/DocsList';
import { DailyLogPage } from './pages/DailyLogPage';
import { Expenses } from './pages/Expenses';
import { Finance } from './pages/Finance';
import { Glossary } from './pages/Glossary';
import { Ingredients } from './pages/Ingredients';
import { Inventory } from './pages/Inventory';
import { RecipeDetail } from './pages/RecipeDetail';
import { Recipes } from './pages/Recipes';
import { Resources } from './pages/Resources';
import { Roadmap } from './pages/Roadmap';
import { Settings } from './pages/Settings';
import { Suppliers } from './pages/Suppliers';
import { Todos } from './pages/Todos';

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="animate-pulse text-2xl">🍚</div>
    </div>
  );
}

/** Reflects the theme + density settings onto <html>. */
function ThemeEffect() {
  const { settings } = useStore();
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', settings.theme !== 'light');
    if (settings.compact) root.setAttribute('data-compact', '');
    else root.removeAttribute('data-compact');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', settings.theme === 'light' ? '#fafaf9' : '#0b0b0f');
  }, [settings.theme, settings.compact]);
  return null;
}

function AppRoutes() {
  const { ready } = useStore();
  if (!ready) return <Splash />;
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="docs" element={<DocsList />} />
          <Route path="docs/:slug" element={<DocDetail />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="todo" element={<Todos />} />
          <Route path="checklists" element={<Checklists />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="ingredients" element={<Ingredients />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="calculators" element={<Calculators />} />
          <Route path="daily" element={<DailyLogPage />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="finance" element={<Finance />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="decisions" element={<DecisionLog />} />
          <Route path="resources" element={<Resources />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

/**
 * Temporary local-auth gate. When it (and `AuthProvider`) is removed for
 * Supabase, this collapses back to a bare `<StoreProvider>` + `<AppRoutes />`.
 */
function AuthGate() {
  const { ready, user } = useAuth();
  if (!ready) return <Splash />;
  if (!user) return <AuthScreen />;
  return (
    <StoreProvider key={user.userId} scope={scopeFor(user.userId)}>
      <ThemeEffect />
      <AppRoutes />
    </StoreProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
      <UpdatePrompt />
    </AuthProvider>
  );
}
