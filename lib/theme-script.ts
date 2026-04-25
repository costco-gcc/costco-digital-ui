// The pre-hydration theme bootstrap, extracted from ThemeBootstrap.tsx so its
// hash can be computed and included in the Content-Security-Policy meta tag.
//
// Keeping the script as a single source-of-truth string lets us:
//   1. Render it inline (synchronous, FOUC-free)
//   2. Compute its SHA-256 once at build time
//   3. Whitelist that exact hash in CSP without resorting to 'unsafe-inline'
//
// Mirrors lib/themes.ts — keep palettes in sync.

import { createHash } from 'node:crypto';

const VARS = [
  '--brand-1', '--brand-1-deep', '--brand-1-text',
  '--brand-2', '--brand-2-deep', '--brand-2-text',
  '--brand-3', '--brand-3-text',
  '--brand-4', '--brand-4-text',
  '--brand-5', '--brand-5-text',
  '--brand-6', '--brand-6-text',
];

const LIGHT: Record<string, string[]> = {
  costco:        ['#E31837','#B7142C','#B7142C','#005DAA','#003B73','#003B73','#F5A623','#8C5C00','#0FA66B','#047857','#7C3AED','#5B21B6','#0891B2','#0E7490'],
  'costco-web':  ['#E31837','#B7142C','#B7142C','#003594','#001A4D','#001A4D','#FFC72C','#856100','#16A34A','#166534','#7C3AED','#5B21B6','#0E7490','#155E75'],
  sunset:        ['#F0573B','#C13F26','#C13F26','#7C3AED','#5B21B6','#5B21B6','#FFC857','#8C6315','#EC4899','#9D174D','#DC2626','#991B1B','#F59E0B','#92400E'],
  forest:        ['#0EA561','#0A7A48','#047857','#0B5C5A','#063937','#063937','#E0B43A','#856B0E','#65A30D','#3F6212','#92400E','#7C2D12','#166534','#14532D'],
  ocean:         ['#0EA5E9','#0369A1','#075985','#1E3A8A','#0F1E5C','#0F1E5C','#22D3EE','#155E75','#3B82F6','#1E40AF','#06B6D4','#155E75','#0F766E','#134E4A'],
  mono:          ['#111827','#000000','#111827','#4B5563','#1F2937','#1F2937','#9CA3AF','#4B5563','#374151','#1F2937','#6B7280','#374151','#D1D5DB','#6B7280'],
};

const DARK: Record<string, string[]> = {
  costco:        ['#FF4D6A','#E5304E','#FF7A8C','#5BA3E8','#3679C2','#80BDFA','#FFC857','#FFC857','#34D399','#6EE7B7','#A78BFA','#C4B5FD','#22D3EE','#67E8F9'],
  'costco-web':  ['#FF4D6A','#E5304E','#FF7A8C','#5A88E0','#3B6BC3','#82A8F0','#FFD25E','#FFD25E','#4ADE80','#86EFAC','#A78BFA','#C4B5FD','#22D3EE','#67E8F9'],
  sunset:        ['#FF7E5F','#E55A3D','#FFA68A','#A78BFA','#7C5BE0','#C4B5FD','#FFD37A','#FFD37A','#F472B6','#FBCFE8','#FB7185','#FCA5A5','#FBBF24','#FCD34D'],
  forest:        ['#34D399','#10B981','#6EE7B7','#5EEAD4','#2DD4BF','#99F6E4','#FACC15','#FACC15','#A3E635','#BEF264','#FB923C','#FDBA74','#86EFAC','#BBF7D0'],
  ocean:         ['#38BDF8','#0EA5E9','#7DD3FC','#7AA0F0','#5B7FE0','#A5C5F8','#67E8F9','#67E8F9','#60A5FA','#93C5FD','#22D3EE','#67E8F9','#5EEAD4','#99F6E4'],
  mono:          ['#F3F4F6','#E5E7EB','#F3F4F6','#D1D5DB','#9CA3AF','#E5E7EB','#6B7280','#D1D5DB','#9CA3AF','#E5E7EB','#4B5563','#9CA3AF','#374151','#D1D5DB'],
};

export const THEME_SCRIPT = `
(function () {
  try {
    var vars = ${JSON.stringify(VARS)};
    var L = ${JSON.stringify(LIGHT)};
    var D = ${JSON.stringify(DARK)};
    var t = localStorage.getItem('costco-gcc-theme') || 'costco';
    var m = localStorage.getItem('costco-gcc-mode') || 'system';
    var r = document.documentElement;
    var dark = m === 'dark' || (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) r.classList.add('dark');
    var p = (dark ? D : L)[t] || (dark ? D.costco : L.costco);
    for (var i = 0; i < vars.length; i++) r.style.setProperty(vars[i], p[i]);
    r.dataset.theme = t;
  } catch (e) {}
})();
`;

// CSP `'sha256-…'` matches the literal text content of the <script> element,
// including the leading/trailing whitespace we emit. Hash that exact string.
export const THEME_SCRIPT_HASH = createHash('sha256').update(THEME_SCRIPT).digest('base64');
