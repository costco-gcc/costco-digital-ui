'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Cpu, Workflow } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-[color:var(--line)] glass text-xs font-medium"
          >
            <Sparkles size={14} className="text-costco-red" aria-hidden />
            Costco Wholesale India Private Limited · Global Capability Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-extrabold tracking-tight leading-[1.05] text-[clamp(2.2rem,1.8rem+3vw,4.6rem)]"
          >
            Powering Costco worldwide,{' '}
            <span className="gradient-text">from Hyderabad.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 text-base sm:text-lg text-[color:var(--muted)] max-w-2xl"
          >
            We bring together extraordinary <strong className="text-[color:var(--ink)]">people</strong>,
            modern <strong className="text-[color:var(--ink)]">technology</strong>, and disciplined{' '}
            <strong className="text-[color:var(--ink)]">process</strong> to deliver member-first
            experiences for Costco worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a href="#careers" className="btn btn-primary">
              Explore careers <ArrowRight size={16} aria-hidden />
            </a>
            <a href="#about" className="btn btn-ghost">
              Why we exist
            </a>
          </motion.div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
            {[
              { icon: Users, label: 'People', desc: 'Member-obsessed teams', color: 'brand-1' },
              { icon: Cpu, label: 'Technology', desc: 'AI · Cloud · Data · Security', color: 'brand-2' },
              { icon: Workflow, label: 'Process', desc: 'Lean · Audited · Scalable', color: 'brand-3' },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                className="card p-3"
              >
                <p.icon size={18} aria-hidden style={{ color: `var(--${p.color})` }} />
                <div className="mt-2 text-sm font-semibold">{p.label}</div>
                <div className="text-xs text-[color:var(--muted)]">{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Orbital />
        </div>
      </div>
    </section>
  );
}

/**
 * Hero orbital. Three rotating dotted rings with three labelled "pillar" dots
 * and a central badge. Labels are HTML (not SVG <text>) so they wrap with the
 * container, never clip, and inherit theme colors. Each label is anchored to
 * its dot with absolute % positioning relative to the orbital container.
 */
function Orbital() {
  const reduce = useReducedMotion();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <div className="orbital relative aspect-square w-full max-w-[28rem] mx-auto" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-mesh blur-3xl opacity-60" />

      <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="o1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-1)" />
            <stop offset="100%" stopColor="var(--brand-1-deep)" />
          </linearGradient>
          <linearGradient id="o2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-2)" />
            <stop offset="100%" stopColor="var(--brand-2-deep)" />
          </linearGradient>
          <linearGradient id="o3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand-3)" />
            <stop offset="100%" stopColor="var(--brand-3)" />
          </linearGradient>
        </defs>

        <g transform="translate(200 200)" fill="none" strokeWidth="2">
          {[
            { r: 110, c: 'url(#o1)', dur: 18, dash: '4 6' },
            { r: 145, c: 'url(#o2)', dur: 22, dash: '6 4' },
            { r: 175, c: 'url(#o3)', dur: 28, dash: '2 8' },
          ].map((o, i) => (
            <circle key={i} r={o.r} stroke={o.c} strokeDasharray={o.dash} opacity="0.7">
              {!reduce && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={i % 2 ? '0' : '360'}
                  to={i % 2 ? '360' : '0'}
                  dur={`${o.dur}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          ))}

          {/* Pillar dots — labels live as HTML below */}
          <g>
            <circle data-pillar="people"  cx="0"   cy="-110" r="11" fill="url(#o1)">
              {!reduce && <animate attributeName="cy" values="-110;-104;-110" dur="3s" repeatCount="indefinite" />}
            </circle>
            <circle data-pillar="tech"    cx="110" cy="50"   r="11" fill="url(#o2)">
              {!reduce && <animate attributeName="cx" values="110;104;110" dur="3.5s" repeatCount="indefinite" />}
            </circle>
            <circle data-pillar="process" cx="-95" cy="80"   r="11" fill="url(#o3)">
              {!reduce && <animate attributeName="cy" values="80;86;80" dur="4s" repeatCount="indefinite" />}
            </circle>
          </g>
        </g>
      </svg>

      {/* HTML labels — anchored as % of container so they never clip the SVG. */}
      <PillarLabel
        text="People"
        // dot at (0,-110) → (50%, 50% - 110/400*100 = 22.5%) → top 22.5%
        style={{ top: '17%', left: '50%', transform: 'translate(-50%, -100%)' }}
      />
      <PillarLabel
        text="Technology"
        // dot at (110,50) → (50%+27.5%, 50%+12.5%) = (77.5%, 62.5%)
        style={{ top: '62.5%', left: '77.5%', transform: 'translate(-50%, 8px)' }}
      />
      <PillarLabel
        text="Process"
        // dot at (-95,80) → (50%-23.75%, 50%+20%) = (26.25%, 70%)
        style={{ top: '70%', left: '26%', transform: 'translate(-50%, 8px)' }}
      />

      {/* Central globe — the Costco Wholesale GCC sphere logo. The artwork has
          a soft drop shadow baked in that reads as a halo on dark backgrounds,
          so we sit it on a clean white circle (its intended canvas) and let
          the orbital rings provide all the on-bg colour. Rotates slowly
          (the lockup itself is a globe) unless the user prefers reduced motion. */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className={`rounded-full bg-white grid place-items-center w-[50%] h-[50%] shadow-[0_18px_45px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/5 ${reduce ? '' : 'orbital-globe-spin'}`}
        >
          <img
            src={`${basePath}/logo-globe.png`}
            alt=""
            aria-hidden
            className="w-[88%] h-[88%] object-contain"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function PillarLabel({ text, style }: { text: string; style: React.CSSProperties }) {
  return (
    <span
      className="orbital-label absolute text-[11px] sm:text-xs font-bold tracking-tight whitespace-nowrap text-[color:var(--ink)] bg-[color:var(--card)] border border-[color:var(--line)] rounded-full px-2 py-0.5 shadow-sm"
      style={style}
    >
      {text}
    </span>
  );
}
