import type { Milestone, RoadmapVersion } from '../types';

export const milestones: Milestone[] = [
  { id: 'M0', title: 'Idea', description: 'Business idea আছে, কিন্তু validate করা হয়নি।' },
  { id: 'M1', title: 'Market Validated', description: 'Competitor ও demand research শেষ, market gap চিহ্নিত।' },
  { id: 'M2', title: 'Brand Defined', description: 'Name, positioning, cuisine ও niche final।' },
  { id: 'M3', title: 'Kitchen Ready', description: 'Location, layout ও core equipment তৈরি।' },
  { id: 'M4', title: 'Compliance Ready', description: 'FSSAI, GST ও প্রয়োজনীয় local license সম্পন্ন।' },
  { id: 'M5', title: 'Menu Validated', description: 'Recipe SOP, food cost ও pricing lock, taste test পাস।' },
  { id: 'M6', title: 'Platform Onboarding', description: 'Zomato ও Swiggy listing live, photos ও menu আপলোড।' },
  { id: 'M7', title: 'Soft Launch', description: 'সীমিত এলাকায় real order নেওয়া শুরু।' },
  { id: 'M8', title: 'First 100 Orders', description: '১০০ order সম্পন্ন, প্রথম review batch এসেছে।' },
  { id: 'M9', title: 'Stable Operations', description: 'Consistent quality, SLA ও repeat customer।' },
  { id: 'M10', title: 'Profitable', description: 'Break-even পেরিয়ে টানা positive contribution।' },
  { id: 'M11', title: 'Scale', description: 'দ্বিতীয় kitchen বা নতুন brand/city expansion।' },
];

export const roadmap: RoadmapVersion[] = [
  {
    version: 'V1',
    title: 'Documentation + TODO PWA',
    status: 'current',
    scope: ['Documentation', 'Navigation', 'Search', 'Filters', 'TODO', 'Checklists', 'Progress tracking', 'PWA foundation'],
  },
  {
    version: 'V2',
    title: 'Calculators + Decision Log + Progress',
    status: 'next',
    scope: ['Break-even calculator', 'Food cost calculator', 'Decision Log', 'Learning vs Execution progress', 'Local persistence hardening'],
  },
  {
    version: 'V3',
    title: 'Recipe + Inventory + Supplier',
    status: 'planned',
    scope: ['Recipe & ingredient DB', 'Supplier comparison', 'Inventory: opening/purchase/consumption/closing'],
  },
  {
    version: 'V4',
    title: 'Order + Expense + Revenue',
    status: 'planned',
    scope: ['Daily order log', 'Expense tracking', 'Revenue & payout reconciliation'],
  },
  {
    version: 'V5',
    title: 'Full Cloud Kitchen Business Tracker',
    status: 'planned',
    scope: ['Vercel + Supabase', 'Auth', 'Multi-device sync', 'Customer & review management'],
  },
  {
    version: 'V6',
    title: 'Analytics + Forecasting + BI',
    status: 'planned',
    scope: ['Trend dashboards', 'Demand forecasting', 'Menu engineering analytics'],
  },
];
