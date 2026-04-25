// Six named palettes. Each defines a LIGHT and a DARK brand set with SIX
// brand colours (was three) so the design has more room to breathe and
// the wordmark can carry an animated multi-stop gradient.
//
// Conceptual roles for the six tokens:
//   brand-1  — primary  (people / hero red)
//   brand-2  — secondary (technology / corporate blue)
//   brand-3  — accent   (process / signal amber)
//   brand-4  — sustain  (members / fresh green)
//   brand-5  — innovate (innovation / vivid purple)
//   brand-6  — clarity  (digital / cyan-teal)
//
// Each `*Text` variant is tuned for ≥4.5:1 contrast against that mode's
// page background — used wherever a brand colour appears as text.

export type ThemeId = 'costco' | 'costco-web' | 'sunset' | 'forest' | 'ocean' | 'mono';

export type BrandSet = {
  brand1: string; brand1Deep: string; brand1Text: string;
  brand2: string; brand2Deep: string; brand2Text: string;
  brand3: string;                     brand3Text: string;
  brand4: string;                     brand4Text: string;
  brand5: string;                     brand5Text: string;
  brand6: string;                     brand6Text: string;
};

export type Theme = {
  id: ThemeId;
  label: string;
  description: string;
  light: BrandSet;
  dark: BrandSet;
};

export const themes: Theme[] = [
  {
    id: 'costco',
    label: 'Costco',
    description: 'Official PMS brand: 199 C red, 7455 C blue.',
    light: {
      brand1: '#E31837', brand1Deep: '#B7142C', brand1Text: '#B7142C',
      brand2: '#005DAA', brand2Deep: '#003B73', brand2Text: '#003B73',
      brand3: '#F5A623',                        brand3Text: '#8C5C00',
      brand4: '#0FA66B',                        brand4Text: '#047857',
      brand5: '#7C3AED',                        brand5Text: '#5B21B6',
      brand6: '#0891B2',                        brand6Text: '#0E7490',
    },
    dark: {
      brand1: '#FF4D6A', brand1Deep: '#E5304E', brand1Text: '#FF7A8C',
      brand2: '#5BA3E8', brand2Deep: '#3679C2', brand2Text: '#80BDFA',
      brand3: '#FFC857',                        brand3Text: '#FFC857',
      brand4: '#34D399',                        brand4Text: '#6EE7B7',
      brand5: '#A78BFA',                        brand5Text: '#C4B5FD',
      brand6: '#22D3EE',                        brand6Text: '#67E8F9',
    },
  },
  {
    id: 'costco-web',
    label: 'Costco.com',
    description: 'Web-flavored: deeper navy, vivid yellow, fresh accents.',
    light: {
      brand1: '#E31837', brand1Deep: '#B7142C', brand1Text: '#B7142C',
      brand2: '#003594', brand2Deep: '#001A4D', brand2Text: '#001A4D',
      brand3: '#FFC72C',                        brand3Text: '#856100',
      brand4: '#16A34A',                        brand4Text: '#166534',
      brand5: '#7C3AED',                        brand5Text: '#5B21B6',
      brand6: '#0E7490',                        brand6Text: '#155E75',
    },
    dark: {
      brand1: '#FF4D6A', brand1Deep: '#E5304E', brand1Text: '#FF7A8C',
      brand2: '#5A88E0', brand2Deep: '#3B6BC3', brand2Text: '#82A8F0',
      brand3: '#FFD25E',                        brand3Text: '#FFD25E',
      brand4: '#4ADE80',                        brand4Text: '#86EFAC',
      brand5: '#A78BFA',                        brand5Text: '#C4B5FD',
      brand6: '#22D3EE',                        brand6Text: '#67E8F9',
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    description: 'Warm sunset oranges, purples, and corals.',
    light: {
      brand1: '#F0573B', brand1Deep: '#C13F26', brand1Text: '#C13F26',
      brand2: '#7C3AED', brand2Deep: '#5B21B6', brand2Text: '#5B21B6',
      brand3: '#FFC857',                        brand3Text: '#8C6315',
      brand4: '#EC4899',                        brand4Text: '#9D174D',
      brand5: '#DC2626',                        brand5Text: '#991B1B',
      brand6: '#F59E0B',                        brand6Text: '#92400E',
    },
    dark: {
      brand1: '#FF7E5F', brand1Deep: '#E55A3D', brand1Text: '#FFA68A',
      brand2: '#A78BFA', brand2Deep: '#7C5BE0', brand2Text: '#C4B5FD',
      brand3: '#FFD37A',                        brand3Text: '#FFD37A',
      brand4: '#F472B6',                        brand4Text: '#FBCFE8',
      brand5: '#FB7185',                        brand5Text: '#FCA5A5',
      brand6: '#FBBF24',                        brand6Text: '#FCD34D',
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    description: 'Deep greens with golden moss and bark notes.',
    light: {
      brand1: '#0EA561', brand1Deep: '#0A7A48', brand1Text: '#047857',
      brand2: '#0B5C5A', brand2Deep: '#063937', brand2Text: '#063937',
      brand3: '#E0B43A',                        brand3Text: '#856B0E',
      brand4: '#65A30D',                        brand4Text: '#3F6212',
      brand5: '#92400E',                        brand5Text: '#7C2D12',
      brand6: '#166534',                        brand6Text: '#14532D',
    },
    dark: {
      brand1: '#34D399', brand1Deep: '#10B981', brand1Text: '#6EE7B7',
      brand2: '#5EEAD4', brand2Deep: '#2DD4BF', brand2Text: '#99F6E4',
      brand3: '#FACC15',                        brand3Text: '#FACC15',
      brand4: '#A3E635',                        brand4Text: '#BEF264',
      brand5: '#FB923C',                        brand5Text: '#FDBA74',
      brand6: '#86EFAC',                        brand6Text: '#BBF7D0',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Calming blues, teals, and deep currents.',
    light: {
      brand1: '#0EA5E9', brand1Deep: '#0369A1', brand1Text: '#075985',
      brand2: '#1E3A8A', brand2Deep: '#0F1E5C', brand2Text: '#0F1E5C',
      brand3: '#22D3EE',                        brand3Text: '#155E75',
      brand4: '#3B82F6',                        brand4Text: '#1E40AF',
      brand5: '#06B6D4',                        brand5Text: '#155E75',
      brand6: '#0F766E',                        brand6Text: '#134E4A',
    },
    dark: {
      brand1: '#38BDF8', brand1Deep: '#0EA5E9', brand1Text: '#7DD3FC',
      brand2: '#7AA0F0', brand2Deep: '#5B7FE0', brand2Text: '#A5C5F8',
      brand3: '#67E8F9',                        brand3Text: '#67E8F9',
      brand4: '#60A5FA',                        brand4Text: '#93C5FD',
      brand5: '#22D3EE',                        brand5Text: '#67E8F9',
      brand6: '#5EEAD4',                        brand6Text: '#99F6E4',
    },
  },
  {
    id: 'mono',
    label: 'Mono',
    description: 'High-contrast neutral palette across six tones.',
    light: {
      brand1: '#111827', brand1Deep: '#000000', brand1Text: '#111827',
      brand2: '#4B5563', brand2Deep: '#1F2937', brand2Text: '#1F2937',
      brand3: '#9CA3AF',                        brand3Text: '#4B5563',
      brand4: '#374151',                        brand4Text: '#1F2937',
      brand5: '#6B7280',                        brand5Text: '#374151',
      brand6: '#D1D5DB',                        brand6Text: '#6B7280',
    },
    dark: {
      brand1: '#F3F4F6', brand1Deep: '#E5E7EB', brand1Text: '#F3F4F6',
      brand2: '#D1D5DB', brand2Deep: '#9CA3AF', brand2Text: '#E5E7EB',
      brand3: '#6B7280',                        brand3Text: '#D1D5DB',
      brand4: '#9CA3AF',                        brand4Text: '#E5E7EB',
      brand5: '#4B5563',                        brand5Text: '#9CA3AF',
      brand6: '#374151',                        brand6Text: '#D1D5DB',
    },
  },
];

// Default to the web-flavoured palette (deeper navy, Costco.com yellow,
// classic red) so first-paint reads as Costco.com proper.
export const DEFAULT_THEME: ThemeId = 'costco-web';
export const THEME_KEY = 'costco-gcc-theme';
export const MODE_KEY = 'costco-gcc-mode';

export function isDarkNow(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

const VAR_MAP: Array<[string, keyof BrandSet]> = [
  ['--brand-1',      'brand1'],
  ['--brand-1-deep', 'brand1Deep'],
  ['--brand-1-text', 'brand1Text'],
  ['--brand-2',      'brand2'],
  ['--brand-2-deep', 'brand2Deep'],
  ['--brand-2-text', 'brand2Text'],
  ['--brand-3',      'brand3'],
  ['--brand-3-text', 'brand3Text'],
  ['--brand-4',      'brand4'],
  ['--brand-4-text', 'brand4Text'],
  ['--brand-5',      'brand5'],
  ['--brand-5-text', 'brand5Text'],
  ['--brand-6',      'brand6'],
  ['--brand-6-text', 'brand6Text'],
];

export function applyTheme(id: ThemeId) {
  const t = themes.find((x) => x.id === id) ?? themes[0];
  const set = isDarkNow() ? t.dark : t.light;
  const root = document.documentElement;
  for (const [cssVar, key] of VAR_MAP) root.style.setProperty(cssVar, set[key]);
  root.dataset.theme = id;
}

export function reapplyForMode(id: ThemeId) { applyTheme(id); }
