import { PracticeArea, MatterPriority, MatterStatus } from '@/types';

export const PRACTICE_AREAS: {
  name: PracticeArea;
  code: string;
  description: string;
  color: string;
  targetHours: number; // For competency progression benchmark
}[] = [
  {
    name: 'Corporate',
    code: 'CORP',
    description: 'M&A, entity formation, Commercial Code compliance, governance & joint ventures',
    color: '#3B82F6',
    targetHours: 80,
  },
  {
    name: 'Tax',
    code: 'TAX',
    description: 'Direct & indirect taxes, transfer pricing, VAT audits & tax tribunal appeals',
    color: '#10B981',
    targetHours: 60,
  },
  {
    name: 'Employment & Immigration',
    code: 'EMP',
    description: 'Labour Proclamation 1156/2019, expatriate work permits, severance & union relations',
    color: '#8B5CF6',
    targetHours: 50,
  },
  {
    name: 'Litigation & Arbitration',
    code: 'LIT',
    description: 'Federal High/Supreme Court, AACCSA commercial arbitration, injunctions & enforcement',
    color: '#EF4444',
    targetHours: 75,
  },
  {
    name: 'Finance & Projects',
    code: 'FIN',
    description: 'Syndicated lending, project finance, NBE foreign exchange regulations & collateral',
    color: '#F59E0B',
    targetHours: 70,
  },
  {
    name: 'IP & Technology',
    code: 'IP',
    description: 'Trademark registration at EIPO, software licensing, telecom regulation & privacy',
    color: '#06B6D4',
    targetHours: 40,
  },
  {
    name: 'Mining, Energy & Real Estate',
    code: 'MIN',
    description: 'Mining concessions, PPA agreements, land lease titling & ESG compliance',
    color: '#EC4899',
    targetHours: 60,
  },
  {
    name: 'NGO & Civil Society',
    code: 'NGO',
    description: 'CSO Proclamation 1113/2019, operational agreements with ACSO & foreign funding rules',
    color: '#14B8A6',
    targetHours: 40,
  },
];

export const STATUS_CONFIG: Record<
  MatterStatus,
  { label: string; bg: string; color: string; border: string }
> = {
  Ongoing: {
    label: 'Ongoing',
    bg: 'rgba(59, 130, 246, 0.12)',
    color: '#60A5FA',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  Completed: {
    label: 'Completed',
    bg: 'rgba(16, 185, 129, 0.12)',
    color: '#34D399',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  Pending: {
    label: 'Pending Review',
    bg: 'rgba(245, 158, 11, 0.12)',
    color: '#FBBF24',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  'On Hold': {
    label: 'On Hold',
    bg: 'rgba(148, 163, 184, 0.12)',
    color: '#94A3B8',
    border: 'rgba(148, 163, 184, 0.3)',
  },
};

export const PRIORITY_CONFIG: Record<
  MatterPriority,
  { label: string; bg: string; color: string; border: string }
> = {
  High: {
    label: 'High Priority',
    bg: 'rgba(239, 68, 68, 0.12)',
    color: '#F87171',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  Medium: {
    label: 'Medium Priority',
    bg: 'rgba(245, 158, 11, 0.12)',
    color: '#FBBF24',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  Low: {
    label: 'Standard',
    bg: 'rgba(100, 116, 139, 0.12)',
    color: '#94A3B8',
    border: 'rgba(100, 116, 139, 0.3)',
  },
};

export const DEFAULT_SUPERVISORS = [
  'Mehrteab Leul (Managing Partner)',
  'Getu Shiferaw (Partner)',
  'Senior Partner (Corporate & Finance)',
  'Senior Associate (Tax & Regulatory)',
  'Senior Associate (Litigation & Arbitration)',
  'Special Legal Counsel',
];
