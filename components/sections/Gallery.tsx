'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import content from '@/data/content/gallery.json';

/**
 * "Inside the campus" gallery. Six abstract scenes rendered as inline SVG
 * — no photography, no stock images, no fake captions. Each tile illustrates
 * a real space type (atrium, focus zone, huddle room, café, war-room,
 * outdoor terrace). When real photos arrive, swap a tile's <Scene> for an
 * <img>. The component contract stays the same.
 */
export default function Gallery() {
  return (
    <section id="gallery" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.scenes.map((s, i) => (
            <motion.figure
              key={s.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card overflow-hidden group"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Scene which={s.key} />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/85 dark:bg-black/40 backdrop-blur text-[color:var(--ink)]">
                  {s.label}
                </span>
              </div>
              <figcaption className="px-4 py-3 text-sm text-[color:var(--muted)]">{s.caption}</figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-6 text-[11px] text-[color:var(--muted)]">{content.footnote}</p>
      </div>
    </section>
  );
}

function Scene({ which }: { which: string }) {
  switch (which) {
    case 'atrium': return <Atrium />;
    case 'focus': return <Focus />;
    case 'huddle': return <Huddle />;
    case 'cafe': return <Cafe />;
    case 'warroom': return <Warroom />;
    case 'terrace': return <Terrace />;
    default: return null;
  }
}

/* All scenes share the same viewBox (400×300) and use brand CSS variables
   so they recolour with palette changes. Solid shapes only — no gradients
   that depend on a specific theme. */

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-2)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--brand-1)" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#sky)" />
      {children}
    </svg>
  );
}

function Atrium() {
  return (
    <Frame>
      {/* Tall double-height atrium with skylight grid */}
      <g fill="none" stroke="var(--ink)" strokeOpacity="0.2" strokeWidth="1.5">
        <path d="M0 240 L400 240" />
      </g>
      <g fill="var(--brand-2)" fillOpacity="0.18">
        <rect x="40" y="60" width="320" height="180" rx="2" />
      </g>
      <g fill="var(--brand-2)" fillOpacity="0.35">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={48 + i * 40} y="60" width="2" height="180" />
        ))}
      </g>
      <g fill="var(--brand-1)" fillOpacity="0.5">
        <rect x="180" y="200" width="40" height="40" />
      </g>
      <g fill="var(--ink)" fillOpacity="0.7">
        <circle cx="120" cy="230" r="6" />
        <circle cx="280" cy="232" r="6" />
        <rect x="116" y="232" width="8" height="20" />
        <rect x="276" y="234" width="8" height="20" />
      </g>
    </Frame>
  );
}

function Focus() {
  return (
    <Frame>
      {/* Row of desks with monitors */}
      <g fill="var(--ink)" fillOpacity="0.12">
        <rect x="0" y="200" width="400" height="100" />
      </g>
      {[40, 130, 220, 310].map((x, i) => (
        <g key={i}>
          <rect x={x - 8} y="160" width="60" height="6" fill="var(--ink)" fillOpacity="0.6" />
          <rect x={x + 18} y="166" width="4" height="20" fill="var(--ink)" fillOpacity="0.6" />
          <rect x={x + 8} y="184" width="24" height="3" fill="var(--ink)" fillOpacity="0.6" />
          <rect x={x - 4} y="190" width="48" height="14" fill="var(--ink)" fillOpacity="0.18" />
          <rect x={x + 14} y="200" width="12" height="40" fill="var(--brand-2)" fillOpacity="0.5" />
        </g>
      ))}
      <g fill="var(--brand-3)" fillOpacity="0.45">
        <circle cx="60" cy="158" r="5" />
        <circle cx="240" cy="158" r="5" />
      </g>
    </Frame>
  );
}

function Huddle() {
  return (
    <Frame>
      {/* Round table with chairs and a wall display */}
      <g fill="var(--ink)" fillOpacity="0.2">
        <rect x="60" y="60" width="280" height="80" rx="3" />
      </g>
      <g fill="var(--brand-2)" fillOpacity="0.35">
        <rect x="80" y="76" width="240" height="48" />
      </g>
      <g fill="var(--ink)" fillOpacity="0.6">
        <ellipse cx="200" cy="220" rx="100" ry="22" />
      </g>
      {[100, 160, 200, 240, 300].map((x, i) => (
        <g key={i} fill="var(--ink)" fillOpacity="0.7">
          <circle cx={x} cy="200" r="9" />
        </g>
      ))}
      <g fill="var(--brand-1)" fillOpacity="0.55">
        <circle cx="200" cy="220" r="3" />
      </g>
    </Frame>
  );
}

function Cafe() {
  return (
    <Frame>
      {/* Café bar + bistro tables */}
      <g fill="var(--ink)" fillOpacity="0.15">
        <rect x="0" y="200" width="400" height="100" />
      </g>
      <g fill="var(--brand-3)" fillOpacity="0.45">
        <rect x="20" y="120" width="160" height="80" rx="3" />
      </g>
      <g fill="var(--ink)" fillOpacity="0.5">
        {[60, 100, 140, 160].map((x, i) => (
          <rect key={i} x={x} y="100" width="6" height="20" />
        ))}
      </g>
      {[220, 290, 360].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy="240" rx="22" ry="6" fill="var(--ink)" fillOpacity="0.6" />
          <rect x={x - 1} y="240" width="2" height="30" fill="var(--ink)" fillOpacity="0.6" />
        </g>
      ))}
      <g fill="var(--brand-1)" fillOpacity="0.55">
        <circle cx="40" cy="155" r="6" />
        <rect x="65" y="150" width="30" height="14" rx="2" />
      </g>
    </Frame>
  );
}

function Warroom() {
  // Deterministic per-cell pseudo-random so SSR and client render identically.
  const rand = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1;
  return (
    <Frame>
      {/* Wall of dashboards + standing console */}
      <g fill="var(--ink)" fillOpacity="0.1">
        <rect x="0" y="0" width="400" height="300" />
      </g>
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2, 3].map((col) => {
          const seed = row * 4 + col + 1;
          const r1 = Math.abs(rand(seed));
          const r2 = Math.abs(rand(seed + 100));
          const r3 = Math.abs(rand(seed + 200));
          return (
            <g key={`${row}-${col}`}>
              <rect
                x={20 + col * 90}
                y={30 + row * 60}
                width="80"
                height="50"
                rx="2"
                fill="var(--brand-2)"
                fillOpacity={(0.18 + r1 * 0.18).toFixed(3)}
              />
              <rect
                x={26 + col * 90}
                y={36 + row * 60}
                width={Math.round(20 + r2 * 40)}
                height="3"
                fill="var(--brand-1)"
                fillOpacity="0.6"
              />
              <rect
                x={26 + col * 90}
                y={42 + row * 60}
                width={Math.round(10 + r3 * 50)}
                height="3"
                fill="var(--brand-3)"
                fillOpacity="0.7"
              />
            </g>
          );
        })
      )}
      <g fill="var(--ink)" fillOpacity="0.7">
        <rect x="160" y="240" width="80" height="40" rx="3" />
        <rect x="195" y="220" width="10" height="20" />
      </g>
    </Frame>
  );
}

function Terrace() {
  return (
    <Frame>
      {/* Outdoor wood deck with greenery */}
      <g fill="var(--brand-3)" fillOpacity="0.25">
        <rect x="0" y="200" width="400" height="100" />
      </g>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={i * 34} y="200" width="2" height="100" fill="var(--ink)" fillOpacity="0.2" />
      ))}
      <g fill="var(--brand-2)" fillOpacity="0.4">
        <circle cx="80" cy="180" r="34" />
        <circle cx="320" cy="170" r="42" />
      </g>
      <g fill="var(--ink)" fillOpacity="0.55">
        <rect x="170" y="210" width="60" height="14" rx="2" />
        <rect x="174" y="224" width="6" height="22" />
        <rect x="220" y="224" width="6" height="22" />
        <ellipse cx="200" cy="208" rx="18" ry="3" fill="var(--ink)" fillOpacity="0.4" />
      </g>
      <g fill="var(--brand-1)" fillOpacity="0.55">
        <circle cx="180" cy="120" r="22" />
      </g>
    </Frame>
  );
}
