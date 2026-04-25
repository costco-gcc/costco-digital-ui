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
          {/* Rings — pushed further out to give the central globe real
              breathing room. Each rotates gently in opposing directions. */}
          {[
            { r: 130, c: 'url(#o1)', dur: 24, dash: '4 6' },
            { r: 165, c: 'url(#o2)', dur: 32, dash: '6 4' },
            { r: 195, c: 'url(#o3)', dur: 40, dash: '2 8' },
          ].map((o, i) => (
            <circle key={i} r={o.r} stroke={o.c} strokeDasharray={o.dash} opacity="0.55">
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

          {/* Planets — each in its own rotating group so it actually orbits
              the centre instead of just wobbling. Different starting angles
              (0°, 120°, 240°) keep them spaced; different durations make
              them feel like distinct bodies in distinct orbits. */}
          {!reduce ? (
            <>
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0"   to="360" dur="20s" repeatCount="indefinite" />
                <circle cx="0" cy="-130" r="11" fill="url(#o1)" />
              </g>
              <g>
                <animateTransform attributeName="transform" type="rotate" from="120" to="480" dur="28s" repeatCount="indefinite" />
                <circle cx="0" cy="-165" r="10" fill="url(#o2)" />
              </g>
              <g>
                <animateTransform attributeName="transform" type="rotate" from="240" to="600" dur="36s" repeatCount="indefinite" />
                <circle cx="0" cy="-195" r="9" fill="url(#o3)" />
              </g>
            </>
          ) : (
            // Static fallback honouring prefers-reduced-motion
            <>
              <circle cx="0"      cy="-130" r="11" fill="url(#o1)" />
              <circle cx="142.9"  cy="82.5" r="10" fill="url(#o2)" />
              <circle cx="-168.9" cy="97.5" r="9"  fill="url(#o3)" />
            </>
          )}
        </g>
      </svg>

      {/* HTML labels at fixed compass stations the planets pass through.
          Kept inside the container at every viewport (verified by UI test). */}
      <PillarLabel
        text="People"
        style={{ top: '2%', left: '50%', transform: 'translate(-50%, 0)' }}
      />
      <PillarLabel
        text="Technology"
        style={{ top: '78%', left: '82%', transform: 'translate(-50%, 0)' }}
      />
      <PillarLabel
        text="Process"
        style={{ top: '78%', left: '18%', transform: 'translate(-50%, 0)' }}
      />

      {/* Central globe — the Costco Wholesale GCC sphere logo. The artwork has
          a soft drop shadow baked in that reads as a halo on dark backgrounds,
          so we sit it on a clean white circle (its intended canvas) and let
          the orbital rings provide all the on-bg colour. Rotates slowly
          (the lockup itself is a globe) unless the user prefers reduced motion. */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className={`rounded-full bg-white grid place-items-center w-[40%] h-[40%] shadow-[0_18px_45px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/5 ${reduce ? '' : 'orbital-globe-spin'}`}
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
