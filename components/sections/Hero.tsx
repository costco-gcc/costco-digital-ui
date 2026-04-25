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

      {/* viewBox is padded by 75 on each side so the outer-orbit label at
          radius 250 stays inside the drawing area at every angle. The SVG
          is sized to fill the orbital container, so visually the content
          just sits in a slightly more zoomed-out frame. */}
      <svg viewBox="-75 -75 550 550" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
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
          {/* Rings — uniform 25 vbu spacing. Inner ring pushed out 12 vbu
              from the previous layout to keep clearance after the central
              globe was enlarged 10% (w-[40%] → w-[44%]).
                globe edge   r ≈ 121
                inner ring   r = 137  (gap 16)
                mid ring     r = 162  (gap 25)
                outer ring   r = 187  (gap 25)
              Each rotates gently in opposing directions. */}
          {[
            { r: 137, c: 'url(#o1)', dur: 26, dash: '4 6' },
            { r: 162, c: 'url(#o2)', dur: 34, dash: '6 4' },
            { r: 187, c: 'url(#o3)', dur: 42, dash: '2 8' },
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

          {/* Planets + labels in the SAME rotating group so the label
              follows its planet exactly. Inside, a counter-rotating
              sub-group keeps the label text upright in screen space at
              every orbit angle. */}
          {!reduce ? (
            <>
              <PlanetWithLabel radius={137} labelRadius={167} startAngle={0}   dur={22} fill="url(#o1)" textColor="var(--brand-1-text)" label="People" />
              <PlanetWithLabel radius={162} labelRadius={192} startAngle={120} dur={30} fill="url(#o2)" textColor="var(--brand-2-text)" label="Technology" />
              <PlanetWithLabel radius={187} labelRadius={217} startAngle={240} dur={38} fill="url(#o3)" textColor="var(--brand-3-text)" label="Process" />
            </>
          ) : (
            <>
              <StaticPlanetWithLabel radius={137} labelRadius={167} angle={0}   fill="url(#o1)" textColor="var(--brand-1-text)" label="People" />
              <StaticPlanetWithLabel radius={162} labelRadius={192} angle={120} fill="url(#o2)" textColor="var(--brand-2-text)" label="Technology" />
              <StaticPlanetWithLabel radius={187} labelRadius={217} angle={240} fill="url(#o3)" textColor="var(--brand-3-text)" label="Process" />
            </>
          )}
        </g>
      </svg>

      {/* Central globe — the Costco Wholesale GCC sphere logo. The artwork has
          a soft drop shadow baked in that reads as a halo on dark backgrounds,
          so we sit it on a clean white circle (its intended canvas) and let
          the orbital rings provide all the on-bg colour. Rotates slowly
          (the lockup itself is a globe) unless the user prefers reduced motion. */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className={`rounded-full bg-white grid place-items-center w-[44%] h-[44%] shadow-[0_18px_45px_-18px_rgba(0,0,0,0.45)] ring-1 ring-black/5 ${reduce ? '' : 'orbital-globe-spin'}`}
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

/* Pill label rendered inside SVG so it can ride a rotating group with its
   planet. Sized roughly by character count — good enough for the three
   short pillar names we use. Text colour is the brand-X-text variable so
   contrast holds in light + dark per palette. */
function SvgPillLabel({ label, textColor }: { label: string; textColor: string }) {
  const charW = 6.4; // average glyph width at 11.5 px font in this stack
  const padX = 12;
  const w = Math.max(50, Math.round(label.length * charW + padX * 2));
  return (
    <g>
      <rect
        x={-w / 2} y={-11} width={w} height={22} rx={11}
        fill="var(--card)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <text
        x="0" y="4"
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="700"
        fill={textColor}
        style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', letterSpacing: '-0.005em' }}
      >
        {label}
      </text>
    </g>
  );
}

/* Planet + label pair that orbits the centre. The outer <g> rotates from
   `startAngle` through +360° over `dur`. The label sub-group sits at
   labelRadius (radially outside the planet) and counter-rotates so the
   text stays upright in screen at every angle. */
function PlanetWithLabel({
  radius, labelRadius, startAngle, dur, fill, textColor, label,
}: {
  radius: number; labelRadius: number; startAngle: number;
  dur: number; fill: string; textColor: string; label: string;
}) {
  return (
    <g>
      <animateTransform
        attributeName="transform" type="rotate"
        from={String(startAngle)}
        to={String(startAngle + 360)}
        dur={`${dur}s`} repeatCount="indefinite"
      />
      <circle cx={0} cy={-radius} r={10} fill={fill} />
      <g transform={`translate(0 ${-labelRadius})`}>
        <g>
          <animateTransform
            attributeName="transform" type="rotate"
            from={String(-startAngle)}
            to={String(-startAngle - 360)}
            dur={`${dur}s`} repeatCount="indefinite"
          />
          <SvgPillLabel label={label} textColor={textColor} />
        </g>
      </g>
    </g>
  );
}

/* Reduced-motion equivalent: same geometry, no animations. The label is
   rendered at the matching angle but doesn't need counter-rotation since
   there's no parent rotation to cancel. */
function StaticPlanetWithLabel({
  radius, labelRadius, angle, fill, textColor, label,
}: {
  radius: number; labelRadius: number; angle: number;
  fill: string; textColor: string; label: string;
}) {
  const rad = (angle * Math.PI) / 180;
  return (
    <g>
      <circle cx={radius * Math.sin(rad)} cy={-radius * Math.cos(rad)} r={10} fill={fill} />
      <g transform={`translate(${labelRadius * Math.sin(rad)} ${-labelRadius * Math.cos(rad)})`}>
        <SvgPillLabel label={label} textColor={textColor} />
      </g>
    </g>
  );
}
