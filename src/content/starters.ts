import type { Ingredient, Recipe } from '../types';
import { uid } from '../lib/format';

/**
 * Optional starter data — common raw materials with **zero price** so the
 * user fills in their own. Nothing here is a claimed market price.
 */
export function starterIngredients(): Ingredient[] {
  const now = new Date().toISOString();
  const mk = (name: string, unit: Ingredient['unit']): Ingredient => ({
    id: uid('ing'),
    name,
    unit,
    price: 0,
    updatedAt: now,
  });
  return [
    mk('Chicken (curry cut)', 'kg'),
    mk('Mutton', 'kg'),
    mk('Basmati rice', 'kg'),
    mk('Onion', 'kg'),
    mk('Tomato', 'kg'),
    mk('Potato', 'kg'),
    mk('Ginger-garlic paste', 'kg'),
    mk('Refined oil', 'litre'),
    mk('Ghee', 'kg'),
    mk('Curd', 'kg'),
    mk('Garam masala / whole spices', 'kg'),
    mk('Salt', 'kg'),
    mk('Egg', 'dozen'),
    mk('Green chilli', 'kg'),
    mk('Coriander leaves', 'kg'),
    mk('Biryani box (container)', 'piece'),
    mk('Carry bag', 'piece'),
    mk('Raita cup + lid', 'piece'),
  ];
}

/** An example recipe — clearly a template to edit, not real numbers. */
export function exampleRecipe(ingredientIdByName: Record<string, string>): Recipe {
  const line = (name: string, qty: number, manualCost?: number) => ({
    id: uid('ln'),
    ingredientId: ingredientIdByName[name] ?? null,
    label: name,
    qty,
    ...(manualCost != null ? { manualCost } : {}),
  });
  return {
    id: uid('rec'),
    name: 'Chicken Biryani (example — edit me)',
    isHero: true,
    lines: [
      line('Chicken (curry cut)', 180),
      line('Basmati rice', 150),
      line('Onion', 80),
      line('Refined oil', 20),
      line('Curd', 30),
      line('Garam masala / whole spices', 6),
      line('Egg', 0.5),
      line('Biryani box (container)', 1),
      line('Raita cup + lid', 1),
    ],
    sellingPrice: 199,
    packagingCost: 0,
    commissionPct: 22,
    overheadCost: 6,
    prepMinutes: 15,
    cookMinutes: 30,
    targetMarginPct: 35,
    sopNotes: 'দমে ২২ মিনিট, তারপর ১০ মিনিট rest — ঢাকনা খুলবে না।',
    updatedAt: new Date().toISOString(),
  };
}
