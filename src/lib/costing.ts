import type { Ingredient, Recipe, RecipeLine } from '../types';

/** Cost of a single recipe line, using the ingredient library where linked. */
export function lineCost(line: RecipeLine, ingredientById: Record<string, Ingredient>): number {
  if (line.ingredientId) {
    const ing = ingredientById[line.ingredientId];
    if (ing) {
      switch (ing.unit) {
        case 'kg':
        case 'litre':
          return (line.qty / 1000) * ing.price; // qty in g / ml
        case 'dozen':
          return (line.qty / 12) * ing.price; // qty in pieces
        default:
          return line.qty * ing.price; // piece / packet
      }
    }
  }
  return line.manualCost ?? 0;
}

export interface RecipeCosting {
  foodCost: number;
  packaging: number;
  commission: number;
  overhead: number;
  variableCost: number;
  contribution: number;
  foodCostPct: number;
  contributionMarginPct: number;
  /** true when a linked ingredient is missing a price (>0). */
  hasZeroPricedIngredient: boolean;
}

export function costRecipe(
  recipe: Recipe,
  ingredientById: Record<string, Ingredient>,
): RecipeCosting {
  const foodCost = recipe.lines.reduce((s, l) => s + lineCost(l, ingredientById), 0);
  const commission = (recipe.sellingPrice * recipe.commissionPct) / 100;
  const variableCost = foodCost + recipe.packagingCost + commission + recipe.overheadCost;
  const contribution = recipe.sellingPrice - variableCost;
  const foodCostPct = recipe.sellingPrice > 0 ? (foodCost / recipe.sellingPrice) * 100 : 0;
  const contributionMarginPct =
    recipe.sellingPrice > 0 ? (contribution / recipe.sellingPrice) * 100 : 0;

  const hasZeroPricedIngredient = recipe.lines.some((l) => {
    if (!l.ingredientId) return false;
    const ing = ingredientById[l.ingredientId];
    return ing != null && ing.price <= 0;
  });

  return {
    foodCost,
    packaging: recipe.packagingCost,
    commission,
    overhead: recipe.overheadCost,
    variableCost,
    contribution,
    foodCostPct,
    contributionMarginPct,
    hasZeroPricedIngredient,
  };
}

export const rupee = (n: number) =>
  `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export function foodCostTone(pct: number): string {
  if (pct > 38) return 'text-bad';
  if (pct > 32) return 'text-warn';
  return 'text-good';
}
