// Inline pre-hydration script: applies the user's saved palette + mode
// synchronously so there's no FOUC. Mirrors lib/themes.ts — keep in sync.
//
// Each palette stores 8 colour tokens per mode:
//   [brand-1, brand-1-deep, brand-1-text,
//    brand-2, brand-2-deep, brand-2-text,
//    brand-3, brand-3-text]

const VARS = [
  '--brand-1', '--brand-1-deep', '--brand-1-text',
  '--brand-2', '--brand-2-deep', '--brand-2-text',
  '--brand-3', '--brand-3-text',
];

const LIGHT: Record<string, string[]> = {
  costco:        ['#E31837','#B7142C','#B7142C','#005DAA','#003B73','#003B73','#F5A623','#8C5C00'],
  'costco-web':  ['#E31837','#B7142C','#B7142C','#003594','#001A4D','#001A4D','#FFC72C','#856100'],
  sunset:        ['#F0573B','#C13F26','#C13F26','#7C3AED','#5B21B6','#5B21B6','#FFC857','#8C6315'],
  forest:        ['#0EA561','#0A7A48','#047857','#0B5C5A','#063937','#063937','#E0B43A','#856B0E'],
  ocean:         ['#0EA5E9','#0369A1','#075985','#1E3A8A','#0F1E5C','#0F1E5C','#22D3EE','#155E75'],
  mono:          ['#111827','#000000','#111827','#4B5563','#1F2937','#1F2937','#9CA3AF','#4B5563'],
};

const DARK: Record<string, string[]> = {
  costco:        ['#FF4D6A','#E5304E','#FF7A8C','#5BA3E8','#3679C2','#80BDFA','#FFC857','#FFC857'],
  'costco-web':  ['#FF4D6A','#E5304E','#FF7A8C','#5A88E0','#3B6BC3','#82A8F0','#FFD25E','#FFD25E'],
  sunset:        ['#FF7E5F','#E55A3D','#FFA68A','#A78BFA','#7C5BE0','#C4B5FD','#FFD37A','#FFD37A'],
  forest:        ['#34D399','#10B981','#6EE7B7','#5EEAD4','#2DD4BF','#99F6E4','#FACC15','#FACC15'],
  ocean:         ['#38BDF8','#0EA5E9','#7DD3FC','#7AA0F0','#5B7FE0','#A5C5F8','#67E8F9','#67E8F9'],
  mono:          ['#F3F4F6','#E5E7EB','#F3F4F6','#D1D5DB','#9CA3AF','#E5E7EB','#6B7280','#D1D5DB'],
};

const SCRIPT = `
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

export default function ThemeBootstrap() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
