import type { Phase } from '../types';

export const phases: Phase[] = [
  {
    id: 'phase-00',
    order: 0,
    code: 'Phase 00',
    title: 'শুরু করা (Getting Started)',
    summary:
      'Dipikar Rannghor কী, Cloud Kitchen কী, এই app কীভাবে ব্যবহার করবে, initial budget আর decision log।',
    milestone: 'M0',
  },
  {
    id: 'phase-01',
    order: 1,
    code: 'Phase 01',
    title: 'Business Foundation',
    summary:
      'Business model, target customer, customer problem, value proposition, cuisine ও niche selection, brand positioning।',
    milestone: 'M1',
  },
  {
    id: 'phase-02',
    order: 2,
    code: 'Phase 02',
    title: 'Market Research',
    summary:
      'Local market, competitor, Zomato/Swiggy research, price ও menu comparison, rating/review analysis, market gap।',
    milestone: 'M1',
  },
  {
    id: 'phase-03',
    order: 3,
    code: 'Phase 03',
    title: 'Location & Kitchen',
    summary:
      'Kitchen location, delivery radius, rent/deposit, kitchen layout ও workflow zones, safety।',
    milestone: 'M3',
  },
  {
    id: 'phase-04',
    order: 4,
    code: 'Phase 04',
    title: 'Legal & Compliance',
    summary:
      'FSSAI, GST, trade/municipal requirements, fire ও LPG safety, hygiene, licenses ও renewal।',
    milestone: 'M4',
  },
  {
    id: 'phase-05',
    order: 5,
    code: 'Phase 05',
    title: 'Equipment & Kitchen Setup',
    summary:
      'Stove, commercial burner, exhaust, refrigeration, work table, storage, utensils, safety equipment।',
    milestone: 'M3',
  },
  {
    id: 'menu',
    order: 6,
    code: 'Menu',
    title: 'Menu Engineering',
    summary:
      'Menu design ও size, hero products, combos, add-ons, portion size, recipe standardization ও SOP।',
    milestone: 'M5',
  },
  {
    id: 'costing',
    order: 7,
    code: 'Costing',
    title: 'Costing, Pricing & Break-even',
    summary:
      'Food Cost %, contribution margin, cost-plus ও market pricing, discount economics, break-even calculation।',
    milestone: 'M5',
  },
  {
    id: 'operations',
    order: 8,
    code: 'Operations',
    title: 'Operations & SOP',
    summary:
      'Order flow, KOT, quality check, packaging, handover, SOP system, supplier ও procurement, inventory।',
    milestone: 'M7',
  },
  {
    id: 'growth',
    order: 9,
    code: 'Growth',
    title: 'Marketing, Finance & Reviews',
    summary:
      'Organic validation তারপর paid acquisition, brand identity, finance tracking, review-driven improvement।',
    milestone: 'M8',
  },
];

export const phaseById = Object.fromEntries(phases.map((p) => [p.id, p])) as Record<
  string,
  Phase
>;
