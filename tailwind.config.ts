import type { Config } from 'tailwindcss';

// All "costco-*" color tokens resolve to CSS variables defined in globals.css
// and managed by lib/themes.ts. Selecting a different palette in the theme
// picker re-paints the whole app — no class changes needed.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        costco: {
          red: 'var(--brand-1)',
          'red-deep': 'var(--brand-1-deep)',
          blue: 'var(--brand-2)',
          'blue-deep': 'var(--brand-2-deep)',
          ink: 'var(--ink)',
          parchment: 'var(--bg)',
        },
        accent: {
          people: 'var(--brand-1)',
          tech: 'var(--brand-2)',
          process: 'var(--brand-3)',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
        display: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'pulse-soft': { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
