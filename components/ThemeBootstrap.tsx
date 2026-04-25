// Inline pre-hydration script: applies the user's saved palette + mode
// synchronously so there's no FOUC. The script content lives in
// lib/theme-script.ts so its SHA-256 hash can be reused by the CSP meta tag.

import { THEME_SCRIPT } from '@/lib/theme-script';

export default function ThemeBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
