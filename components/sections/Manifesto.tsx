'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import content from '@/data/content/manifesto.json';

/**
 * "The Operating Standard" — manifesto rendered as three numbered
 * principles laid out like a printed doctrine. Each row has a large
 * monospaced number on the left, a verb (gradient-coloured) and a
 * fragment to its right, and a smaller annotation below. The whole
 * section sits on a faint blueprint-grid backdrop with a slow-rotating
 * compass decoration to telegraph "operations / standards / ledger".
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Subtle parallax on the compass: it drifts as the user scrolls past.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const compassY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);
  const compassRot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-12, 12]);

  return (
    <section
      ref={sectionRef}
      aria-label="Operating standard"
      className="relative py-24 sm:py-36 overflow-hidden"
    >
      <BlueprintGrid />
      <m.div
        aria-hidden
        style={{ y: compassY, rotate: compassRot }}
        className="absolute right-[-6rem] top-1/2 -translate-y-1/2 w-[36rem] h-[36rem] pointer-events-none opacity-[0.06] text-[color:var(--ink)]"
      >
        <Compass />
      </m.div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        {/* Kicker rule */}
        <div className="flex items-center gap-3">
          <span className="block w-10 h-px bg-costco-red" aria-hidden />
          <p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-costco-red">
            {content.kicker}
          </p>
        </div>

        <h2 className="mt-4 font-extrabold tracking-tight leading-[1.05] text-[clamp(2rem,1.4rem+3.4vw,4.2rem)] max-w-3xl text-balance">
          {content.lead}
        </h2>

        <ol className="mt-12 sm:mt-16 divide-y divide-[color:var(--line)]">
          {content.principles.map((p, i) => (
            <Principle key={p.n} index={i} {...p} />
          ))}
        </ol>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 flex items-center gap-3"
        >
          <span aria-hidden className="text-costco-red text-xl">◆</span>
          <p className="text-base sm:text-lg text-[color:var(--ink)] font-medium">{content.footer}</p>
        </m.div>
      </div>
    </section>
  );
}

function Principle({
  n, verb, rest, note, index,
}: { n: string; verb: string; rest: string; note: string; index: number }) {
  return (
    <m.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-8 py-7 sm:py-9"
    >
      <div
        className="font-extrabold tabular-nums leading-none text-[color:var(--muted)]/40 text-[clamp(2.4rem,1.8rem+2.6vw,4rem)] select-none"
        aria-hidden
      >
        {n}
      </div>
      <div>
        <p className="font-extrabold tracking-tight leading-[1.05] text-[clamp(1.6rem,1.1rem+2.2vw,2.8rem)]">
          <span className="gradient-text">{verb}</span>{' '}
          <span>{rest}</span>
        </p>
        <p className="mt-3 text-[color:var(--muted)] max-w-2xl text-[15px] sm:text-base leading-relaxed">
          {note}
        </p>
      </div>
    </m.li>
  );
}

/* Faint blueprint grid — a 40px square pattern that fades at the section
   edges so it doesn't fight neighbouring sections. */
function BlueprintGrid() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="blueprint" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--ink)" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
          <linearGradient id="bp-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bg)" stopOpacity="1" />
            <stop offset="20%" stopColor="var(--bg)" stopOpacity="0" />
            <stop offset="80%" stopColor="var(--bg)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint)" />
        <rect width="100%" height="100%" fill="url(#bp-fade)" />
      </svg>
    </div>
  );
}

/* Decorative compass / standards mark. Pure decoration; never visible
   beyond ~6% opacity. Aria-hidden by parent. */
function Compass() {
  return (
    <svg viewBox="-100 -100 200 200" className="w-full h-full">
      {/* outer ring */}
      <circle r="92" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle r="74" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="0.6 3" />
      <circle r="40" fill="none" stroke="currentColor" strokeWidth="0.4" />
      {/* tick marks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x1 = Math.cos(a) * 74, y1 = Math.sin(a) * 74;
        const x2 = Math.cos(a) * (i % 6 === 0 ? 60 : 68), y2 = Math.sin(a) * (i % 6 === 0 ? 60 : 68);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 6 === 0 ? 1 : 0.5} />;
      })}
      {/* needle */}
      <path d="M 0 -55 L 8 0 L 0 55 L -8 0 Z" fill="currentColor" opacity="0.6" />
      <circle r="3" fill="currentColor" />
      {/* cardinal letters */}
      <text x="0" y="-80" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor"
            style={{ fontFamily: 'system-ui' }}>N</text>
      <text x="0" y="86"  textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor"
            style={{ fontFamily: 'system-ui' }}>S</text>
      <text x="86" y="3"  textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor"
            style={{ fontFamily: 'system-ui' }}>E</text>
      <text x="-86" y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor"
            style={{ fontFamily: 'system-ui' }}>W</text>
    </svg>
  );
}
