import type { ComponentType, SVGProps } from 'react';
import {
  IconBook,
  IconCalc,
  IconCheckSquare,
  IconDashboard,
  IconDocs,
  IconFlag,
  IconLink,
  IconList,
  IconRoadmap,
  IconSettings,
} from './icons';

export interface NavItem {
  to: string;
  label: string;
  short?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
}

export const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/docs', label: 'Documentation', short: 'Docs', icon: IconDocs },
  { to: '/roadmap', label: 'Roadmap', icon: IconRoadmap },
  { to: '/todo', label: 'TODO', icon: IconList },
  { to: '/checklists', label: 'Checklists', short: 'Checks', icon: IconCheckSquare },
  { to: '/calculators', label: 'Calculators', short: 'Calc', icon: IconCalc },
  { to: '/glossary', label: 'Glossary', icon: IconBook },
  { to: '/decisions', label: 'Decision Log', icon: IconFlag },
  { to: '/resources', label: 'Resources', icon: IconLink },
  { to: '/settings', label: 'Settings', icon: IconSettings },
];

/** Bottom bar keeps the 5 highest-traffic destinations. */
export const MOBILE_NAV = NAV.filter((n) =>
  ['/', '/docs', '/todo', '/checklists', '/calculators'].includes(n.to),
);
