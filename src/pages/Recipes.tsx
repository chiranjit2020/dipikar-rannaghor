import { Link } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { IconChevronRight, IconPlus } from '../components/icons';
import { costRecipe, foodCostTone, rupee } from '../lib/costing';
import { exampleRecipe, starterIngredients } from '../content/starters';
import { uid } from '../lib/format';
import { useStore } from '../lib/store';
import type { Recipe } from '../types';

export function Recipes() {
  const { recipes, ingredients, saveItem, saveItems } = useStore();

  const ingredientById = Object.fromEntries(ingredients.map((i) => [i.id, i]));

  const newRecipe = () => {
    const r: Recipe = {
      id: uid('rec'),
      name: '',
      lines: [],
      sellingPrice: 0,
      packagingCost: 0,
      commissionPct: 22,
      overheadCost: 0,
      updatedAt: new Date().toISOString(),
    };
    void saveItem('recipes', r);
  };

  const addExample = () => {
    let ids = ingredients;
    if (ids.length === 0) {
      const starters = starterIngredients();
      void saveItems('ingredients', starters);
      ids = starters;
    }
    const byName = Object.fromEntries(ids.map((i) => [i.name, i.id]));
    void saveItem('recipes', exampleRecipe(byName));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recipes"
        subtitle="প্রতিটি dish-এর standardized recipe + live food cost। Ingredient library থেকে দাম আসে।"
        actions={
          <button className="btn-ghost" onClick={newRecipe}>
            <IconPlus className="h-4 w-4" /> New recipe
          </button>
        }
      />

      {recipes.length === 0 ? (
        <EmptyState
          title="কোনো recipe নেই"
          hint="একটা hero dish দিয়ে শুরু করো — ingredient, পরিমাণ (গ্রামে), দাম, packaging, commission। Food Cost % ও contribution নিজে থেকেই আসবে।"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button className="btn-primary" onClick={addExample}>Example recipe যোগ করো</button>
              <button className="btn-ghost" onClick={newRecipe}>খালি recipe</button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {recipes.map((r) => {
            const c = costRecipe(r, ingredientById);
            return (
              <Link key={r.id} to={`/recipes/${r.id}`} className="card card-hover flex flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-base font-medium text-ink">{r.name || 'Untitled recipe'}</span>
                  {r.isHero && <span className="chip chip-active">Hero</span>}
                  <IconChevronRight className="h-4 w-4 text-ink-muted" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Price</p>
                    <p className="text-ink">{rupee(r.sellingPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Contribution</p>
                    <p className={c.contribution <= 0 ? 'text-bad' : 'text-good'}>{rupee(c.contribution)}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-wider text-ink-muted">Food Cost %</p>
                    <p className={foodCostTone(c.foodCostPct)}>{c.foodCostPct.toFixed(1)}%</p>
                  </div>
                </div>
                {c.hasZeroPricedIngredient && (
                  <p className="text-xs text-warn">⚠ কিছু ingredient-এ দাম বসানো হয়নি</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
