import type { ComponentType, SVGProps } from 'react';
import {
  IconBook,
  IconCalc,
  IconCheckSquare,
  IconDashboard,
  IconDocs,
  IconFlag,
  IconBox,
  IconCalendar,
  IconChart,
  IconLeaf,
  IconLink,
  IconList,
  IconRecipe,
  IconRoadmap,
  IconSettings,
  IconTruck,
  IconWallet,
} from './icons';

export interface NavItem {
  to: string;
  label: string;
  short?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
  group: 'Plan' | 'Kitchen' | 'Operations' | 'Reference';
}

export const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, end: true, group: 'Plan' },
  { to: '/docs', label: 'Documentation', short: 'Docs', icon: IconDocs, group: 'Plan' },
  { to: '/roadmap', label: 'Roadmap', icon: IconRoadmap, group: 'Plan' },
  { to: '/todo', label: 'TODO', icon: IconList, group: 'Plan' },
  { to: '/checklists', label: 'Checklists', short: 'Checks', icon: IconCheckSquare, group: 'Plan' },

  { to: '/recipes', label: 'Recipes', icon: IconRecipe, group: 'Kitchen' },
  { to: '/ingredients', label: 'Ingredients', icon: IconLeaf, group: 'Kitchen' },
  { to: '/suppliers', label: 'Suppliers', icon: IconTruck, group: 'Kitchen' },
  { to: '/calculators', label: 'Calculators', short: 'Calc', icon: IconCalc, group: 'Kitchen' },

  { to: '/daily', label: 'Daily Log', short: 'Daily', icon: IconCalendar, group: 'Operations' },
  { to: '/expenses', label: 'Expenses', icon: IconWallet, group: 'Operations' },
  { to: '/finance', label: 'Finance', icon: IconChart, group: 'Operations' },
  { to: '/inventory', label: 'Inventory', icon: IconBox, group: 'Operations' },

  { to: '/glossary', label: 'Glossary', icon: IconBook, group: 'Reference' },
  { to: '/decisions', label: 'Decision Log', icon: IconFlag, group: 'Reference' },
  { to: '/resources', label: 'Resources', icon: IconLink, group: 'Reference' },
  { to: '/settings', label: 'Settings', icon: IconSettings, group: 'Reference' },
];

export const NAV_GROUPS = ['Plan', 'Kitchen', 'Operations', 'Reference'] as const;

/** Bottom bar keeps 4 high-traffic destinations; a 5th "More" opens the rest. */
export const MOBILE_NAV = NAV.filter((n) => ['/', '/docs', '/todo', '/recipes'].includes(n.to));
