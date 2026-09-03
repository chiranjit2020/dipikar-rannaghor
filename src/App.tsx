import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell';
import { UpdatePrompt } from './components/UpdatePrompt';
import { StoreProvider, useStore } from './lib/store';
import { Calculators } from './pages/Calculators';
import { Checklists } from './pages/Checklists';
import { Dashboard } from './pages/Dashboard';
import { DecisionLog } from './pages/DecisionLog';
import { DocDetail } from './pages/DocDetail';
import { DocsList } from './pages/DocsList';
import { Glossary } from './pages/Glossary';
import { Ingredients } from './pages/Ingredients';
import { RecipeDetail } from './pages/RecipeDetail';
import { Recipes } from './pages/Recipes';
import { Resources } from './pages/Resources';
import { Roadmap } from './pages/Roadmap';
import { Settings } from './pages/Settings';
import { Suppliers } from './pages/Suppliers';
import { Todos } from './pages/Todos';

function Gate({ children }: { children: React.ReactNode }) {
  const { ready } = useStore();
  if (!ready) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="animate-pulse text-2xl">🍚</div>
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <StoreProvider>
      <Gate>
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
              <Route path="glossary" element={<Glossary />} />
              <Route path="decisions" element={<DecisionLog />} />
              <Route path="resources" element={<Resources />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
        <UpdatePrompt />
      </Gate>
    </StoreProvider>
  );
}
