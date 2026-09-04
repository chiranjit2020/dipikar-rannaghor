import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { IconArrowLeft, IconFlag, IconPlus, IconTrash } from '../components/icons';
import { costRecipe, foodCostTone, lineCost, rupee } from '../lib/costing';
import { todayISO, uid } from '../lib/format';
import { useStore } from '../lib/store';
import type { Recipe, RecipeLine } from '../types';

export function RecipeDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { recipes, ingredients, saveItem, deleteItem, saveDecision } = useStore();
  const recipe = recipes.find((r) => r.id === id);
  const [savedMsg, setSavedMsg] = useState(false);

  if (!recipe) return <Navigate to="/recipes" replace />;

  const ingredientById = Object.fromEntries(ingredients.map((i) => [i.id, i]));
  const c = costRecipe(recipe, ingredientById);
  const r = recipe;

  const save = (p: Partial<Recipe>) =>
    void saveItem('recipes', { ...r, ...p, updatedAt: new Date().toISOString() });
  const setLine = (lid: string, p: Partial<RecipeLine>) =>
    save({ lines: r.lines.map((l) => (l.id === lid ? { ...l, ...p } : l)) });

  const addLine = () =>
    save({
      lines: [...r.lines, { id: uid('ln'), ingredientId: null, label: '', qty: 0, manualCost: 0 }],
    });

  const saveToLog = () => {
    void saveDecision({
      id: uid('dec'),
      decision: `${r.name || 'Recipe'}: selling ${rupee(r.sellingPrice)} → contribution ${rupee(
        c.contribution,
      )}/order, Food Cost ${c.foodCostPct.toFixed(1)}%`,
      reason: `Recipe costing: food ${rupee(c.foodCost)} + packaging ${rupee(c.packaging)} + commission ${rupee(
        c.commission,
      )} (${r.commissionPct}%) + overhead ${rupee(c.overhead)} = variable ${rupee(c.variableCost)}. (${todayISO()})`,
      date: todayISO(),
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const num = (label: string, value: number, key: keyof Recipe, step = 1, suffix?: string) => (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-muted">{label}</span>
      <div className="flex items-center gap-2">
        <input
          className="field"
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(e) => save({ [key]: parseFloat(e.target.value) || 0 } as Partial<Recipe>)}
        />
        {suffix && <span className="text-sm text-ink-muted">{suffix}</span>}
      </div>
    </label>
  );

  return (
    <div className="space-y-6">
      <Link to="/recipes" className="btn-subtle -ml-2 px-2 text-sm">
        <IconArrowLeft className="h-4 w-4" /> Recipes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <input
            className="field text-lg font-semibold"
            placeholder="Dish name"
            value={r.name}
            onChange={(e) => save({ name: e.target.value })}
          />
          <label className="mt-2 inline-flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={!!r.isHero}
              onChange={(e) => save({ isHero: e.target.checked })}
              className="h-4 w-4 accent-saffron"
            />
            Hero product
          </label>
        </div>
        <button
          onClick={() => {
            if (confirm('এই recipe মুছে ফেলা হবে?')) {
              void deleteItem('recipes', r.id);
              navigate('/recipes');
            }
          }}
          className="btn-subtle px-2 py-1 text-xs text-bad hover:bg-bad/10"
        >
          <IconTrash className="h-4 w-4" /> Delete
        </button>
      </div>

      {/* Ingredient lines */}
      <section className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="section-title">Ingredients</p>
          <span className="text-xs text-ink-muted">Food cost {rupee(c.foodCost)}</span>
        </div>
        <div className="hidden grid-cols-[1.4fr_1fr_5rem_6rem_2.25rem] gap-2 px-1 pb-1 text-[0.7rem] uppercase tracking-wider text-ink-muted sm:grid">
          <span>Ingredient</span><span>Library link</span><span>Qty (g / ct)</span><span>Line cost</span><span />
        </div>
        <div className="space-y-2">
          {r.lines.map((l) => {
            const linked = l.ingredientId ? ingredientById[l.ingredientId] : undefined;
            return (
              <div
                key={l.id}
                className="rounded-xl border border-hairline bg-tint/[0.02] p-2 sm:grid sm:grid-cols-[1.4fr_1fr_5rem_6rem_2.25rem] sm:items-center sm:gap-2 sm:border-0 sm:bg-transparent sm:p-0"
              >
                <input
                  className="field"
                  placeholder="Ingredient label"
                  value={l.label}
                  onChange={(e) => setLine(l.id, { label: e.target.value })}
                />
                <select
                  className="field mt-2 sm:mt-0 sm:px-2"
                  value={l.ingredientId ?? ''}
                  onChange={(e) => {
                    const ing = ingredients.find((x) => x.id === e.target.value);
                    setLine(l.id, {
                      ingredientId: e.target.value || null,
                      label: l.label || ing?.name || l.label,
                    });
                  }}
                >
                  <option value="">— manual —</option>
                  {ingredients.map((i) => (
                    <option key={i.id} value={i.id}>{i.name || 'Unnamed'} ({i.unit})</option>
                  ))}
                </select>
                <div className="mt-2 grid grid-cols-[1fr_1fr_auto] items-center gap-2 sm:contents sm:mt-0">
                  <input
                    className="field"
                    type="number"
                    inputMode="decimal"
                    placeholder="Qty"
                    value={l.qty}
                    onChange={(e) => setLine(l.id, { qty: parseFloat(e.target.value) || 0 })}
                  />
                  {linked ? (
                    <span className="flex h-10 items-center justify-end px-1 text-sm text-ink-soft sm:h-auto sm:justify-start sm:px-0">
                      {rupee(lineCost(l, ingredientById))}
                    </span>
                  ) : (
                    <input
                      className="field"
                      type="number"
                      inputMode="decimal"
                      placeholder="₹ cost"
                      value={l.manualCost ?? 0}
                      onChange={(e) => setLine(l.id, { manualCost: parseFloat(e.target.value) || 0 })}
                    />
                  )}
                  <button
                    aria-label="Remove line"
                    onClick={() => save({ lines: r.lines.filter((x) => x.id !== l.id) })}
                    className="grid h-10 w-10 place-items-center rounded-xl text-ink-muted hover:bg-tint/5 hover:text-bad"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button className="btn-subtle mt-2 px-2 py-1 text-xs" onClick={addLine}>
          <IconPlus className="h-4 w-4" /> Ingredient line যোগ করো
        </button>
        <p className="mt-2 text-xs text-ink-muted">
          Library-linked line: Qty = গ্রাম/মিলি (kg/litre) বা count (piece/dozen)। Manual line: Qty উপেক্ষিত, সরাসরি ₹ বসাও।
        </p>
        {c.hasZeroPricedIngredient && (
          <p className="mt-2 rounded-lg border border-warn/25 bg-warn/[0.08] px-3 py-2 text-xs text-warn">
            ⚠ কিছু linked ingredient-এ দাম ০ — <Link to="/ingredients" className="link">Ingredients</Link>-এ গিয়ে দাম বসাও।
          </p>
        )}
      </section>

      {/* Pricing inputs */}
      <section className="card grid gap-3 p-4 sm:grid-cols-2">
        {num('Selling Price (menu)', r.sellingPrice, 'sellingPrice', 5, '₹')}
        {num('Packaging cost / order', r.packagingCost, 'packagingCost', 1, '₹')}
        {num('Platform commission', r.commissionPct, 'commissionPct', 1, '%')}
        {num('Variable overhead (gas ইত্যাদি)', r.overheadCost, 'overheadCost', 1, '₹')}
        {num('Prep time', r.prepMinutes ?? 0, 'prepMinutes', 1, 'min')}
        {num('Cooking time', r.cookMinutes ?? 0, 'cookMinutes', 1, 'min')}
        {num('Target margin', r.targetMarginPct ?? 0, 'targetMarginPct', 1, '%')}
      </section>

      {/* Costing summary — the dish template */}
      <section className="card p-5">
        <p className="section-title mb-3">Costing summary</p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          <Row label="Ingredient cost" value={rupee(c.foodCost)} />
          <Row label="Packaging" value={rupee(c.packaging)} />
          <Row label="Platform commission" value={rupee(c.commission)} />
          <Row label="Overhead" value={rupee(c.overhead)} />
          <Row label="Total variable cost" value={rupee(c.variableCost)} strong />
          <Row label="Selling price" value={rupee(r.sellingPrice)} strong />
          <Row
            label="Contribution / order"
            value={rupee(c.contribution)}
            tone={c.contribution <= 0 ? 'text-bad' : 'text-good'}
            strong
          />
          <Row
            label="Food Cost %"
            value={`${c.foodCostPct.toFixed(1)}%`}
            tone={foodCostTone(c.foodCostPct)}
            strong
          />
          <Row
            label="Contribution margin %"
            value={`${c.contributionMarginPct.toFixed(1)}%`}
            tone={
              r.targetMarginPct && c.contributionMarginPct < r.targetMarginPct
                ? 'text-warn'
                : 'text-ink'
            }
          />
        </dl>

        {r.targetMarginPct != null && r.targetMarginPct > 0 && c.contributionMarginPct < r.targetMarginPct && (
          <p className="mt-3 rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
            Contribution margin {c.contributionMarginPct.toFixed(1)}% — target {r.targetMarginPct}%-এর নিচে। Portion / sourcing / price দেখো।
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="btn-ghost" onClick={saveToLog}>
            <IconFlag className="h-4 w-4" /> Save pricing to Decision Log
          </button>
          {savedMsg && (
            <span className="text-xs text-good">
              Saved. <Link to="/decisions" className="link">Decision Log →</Link>
            </span>
          )}
        </div>
      </section>

      {/* SOP notes */}
      <section className="card p-4">
        <p className="section-title mb-2">Recipe SOP notes</p>
        <textarea
          className="field resize-y"
          rows={4}
          placeholder="ধাপ, সময়, quality check, common mistake…"
          value={r.sopNotes ?? ''}
          onChange={(e) => save({ sopNotes: e.target.value })}
        />
        <p className="mt-2 text-xs text-ink-muted">
          পূর্ণ SOP framework: <Link to="/docs/sop-system" className="link">SOP System</Link> doc দেখো।
        </p>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  strong,
}: {
  label: string;
  value: string;
  tone?: string;
  strong?: boolean;
}) {
  return (
    <div>
      <dt className="text-[0.7rem] uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className={`${strong ? 'text-base font-semibold' : 'text-sm'} ${tone ?? 'text-ink'}`}>{value}</dd>
    </div>
  );
}
