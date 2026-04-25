// Six named palettes. Each defines a LIGHT and a DARK brand set.
// Within each set, `brand1..brand3` are the *visual* brand colours used for
// backgrounds, accents, dots and buttons — these stay true to the brand.
// `brand1Text..brand3Text` are tuned for ≥4.5:1 contrast against that mode's
// canvas — used wherever a brand colour appears as text. In dark mode the
// dark visual colours are already bright enough so text === visual.

export type ThemeId = 'costco' | 'costco-web' | 'sunset' | 'forest' | 'ocean' | 'mono';

export type BrandSet = {
  brand1: string;       brand1Deep: string;     brand1Text: string;
  brand2: string;       brand2Deep: string;     brand2Text: string;
  brand3: string;                               brand3Text: string;
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
    },
    dark: {
      brand1: '#FF4D6A', brand1Deep: '#E5304E', brand1Text: '#FF7A8C',
      brand2: '#5BA3E8', brand2Deep: '#3679C2', brand2Text: '#80BDFA',
      brand3: '#FFC857',                        brand3Text: '#FFC857',
    },
  },
  {
    id: 'costco-web',
    label: 'Costco.com',
    description: 'Web-flavored: deeper navy header, bright yellow tags.',
    light: {
      brand1: '#E31837', brand1Deep: '#B7142C', brand1Text: '#B7142C',
      brand2: '#003594', brand2Deep: '#001A4D', brand2Text: '#001A4D',
      brand3: '#FFC72C',                        brand3Text: '#856100',
    },
    dark: {
      brand1: '#FF4D6A', brand1Deep: '#E5304E', brand1Text: '#FF7A8C',
      brand2: '#5A88E0', brand2Deep: '#3B6BC3', brand2Text: '#82A8F0',
      brand3: '#FFD25E',                        brand3Text: '#FFD25E',
    },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    description: 'Warm sunset oranges and corals.',
    light: {
      brand1: '#F0573B', brand1Deep: '#C13F26', brand1Text: '#C13F26',
      brand2: '#7C3AED', brand2Deep: '#5B21B6', brand2Text: '#5B21B6',
      brand3: '#FFC857',                        brand3Text: '#8C6315',
    },
    dark: {
      brand1: '#FF7E5F', brand1Deep: '#E55A3D', brand1Text: '#FFA68A',
      brand2: '#A78BFA', brand2Deep: '#7C5BE0', brand2Text: '#C4B5FD',
      brand3: '#FFD37A',                        brand3Text: '#FFD37A',
    },
  },
  {
    id: 'forest',
    label: 'Forest',
    description: 'Deep greens with golden moss.',
    light: {
      brand1: '#0EA561', brand1Deep: '#0A7A48', brand1Text: '#047857',
      brand2: '#0B5C5A', brand2Deep: '#063937', brand2Text: '#063937',
      brand3: '#E0B43A',                        brand3Text: '#856B0E',
    },
    dark: {
      brand1: '#34D399', brand1Deep: '#10B981', brand1Text: '#6EE7B7',
      brand2: '#5EEAD4', brand2Deep: '#2DD4BF', brand2Text: '#99F6E4',
      brand3: '#FACC15',                        brand3Text: '#FACC15',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Calming blues and teals.',
    light: {
      brand1: '#0EA5E9', brand1Deep: '#0369A1', brand1Text: '#075985',
      brand2: '#1E3A8A', brand2Deep: '#0F1E5C', brand2Text: '#0F1E5C',
      brand3: '#22D3EE',                        brand3Text: '#155E75',
    },
    dark: {
      brand1: '#38BDF8', brand1Deep: '#0EA5E9', brand1Text: '#7DD3FC',
      brand2: '#7AA0F0', brand2Deep: '#5B7FE0', brand2Text: '#A5C5F8',
      brand3: '#67E8F9',                        brand3Text: '#67E8F9',
    },
  },
  {
    id: 'mono',
    label: 'Mono',
    description: 'High-contrast neutral palette.',
    light: {
      brand1: '#111827', brand1Deep: '#000000', brand1Text: '#111827',
      brand2: '#4B5563', brand2Deep: '#1F2937', brand2Text: '#1F2937',
      brand3: '#9CA3AF',                        brand3Text: '#4B5563',
    },
    dark: {
      brand1: '#F3F4F6', brand1Deep: '#E5E7EB', brand1Text: '#F3F4F6',
      brand2: '#D1D5DB', brand2Deep: '#9CA3AF', brand2Text: '#E5E7EB',
      brand3: '#6B7280',                        brand3Text: '#D1D5DB',
    },
  },
];

export const DEFAULT_THEME: ThemeId = 'costco';
export const THEME_KEY = 'costco-gcc-theme';
export const MODE_KEY = 'costco-gcc-mode';

export function isDarkNow(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function applyTheme(id: ThemeId) {
  const t = themes.find((x) => x.id === id) ?? themes[0];
  const set = isDarkNow() ? t.dark : t.light;
  const root = document.documentElement;
  const map: Array<[string, keyof BrandSet]> = [
    ['--brand-1', 'brand1'],
    ['--brand-1-deep', 'brand1Deep'],
    ['--brand-1-text', 'brand1Text'],
    ['--brand-2', 'brand2'],
    ['--brand-2-deep', 'brand2Deep'],
    ['--brand-2-text', 'brand2Text'],
    ['--brand-3', 'brand3'],
    ['--brand-3-text', 'brand3Text'],
  ];
  for (const [cssVar, key] of map) root.style.setProperty(cssVar, set[key]);
  root.dataset.theme = id;
}

export function reapplyForMode(id: ThemeId) { applyTheme(id); }
