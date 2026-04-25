'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import content from '@/data/content/hero.json';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Top rail: eyebrow on the left, live status on the right —
            anchors both upper corners so the band reads as intentional. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-[color:var(--line)] glass text-xs font-medium">
            <Sparkles size={14} className="text-costco-red" aria-hidden />
            {content.eyebrow}
          </div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--muted)]">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-costco-red opacity-70 animate-ping" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-costco-red" />
            </span>
            Live · Hiring now
          </div>
        </motion.div>

        <div className="mt-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-extrabold tracking-tight leading-[1.05] text-[clamp(2.2rem,1.8rem+3vw,4.6rem)]"
            >
              {content.headlinePrefix}{' '}
              <span className="gradient-text">{content.headlineAccent}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 text-base sm:text-lg text-[color:var(--muted)] max-w-2xl"
            >
              {content.introLead}{' '}
              <strong className="text-[color:var(--ink)]">{content.introHighlights[0]}</strong>
              {content.introJoinerA}{' '}
              <strong className="text-[color:var(--ink)]">{content.introHighlights[1]}</strong>
              {content.introJoinerB}{' '}
              <strong className="text-[color:var(--ink)]">{content.introHighlights[2]}</strong>{' '}
              {content.introTail}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <a href={content.ctaPrimary.href} className="btn btn-primary">
                {content.ctaPrimary.label} <ArrowRight size={16} aria-hidden />
              </a>
              <a href={content.ctaSecondary.href} className="btn btn-ghost">
                {content.ctaSecondary.label}
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <Orbital labels={content.orbital.labels} />
          </div>
        </div>

        {/* Bottom rail: editorial fact-strip that replaces the thin meta line.
            Three cells with vertical dividers fill the lower band so the
            section's ground stops floating. */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 sm:mt-16 pt-8 border-t border-[color:var(--line)] grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:divide-x sm:divide-[color:var(--line)]"
        >
          <FactCell kicker="Campus" value="Madhapur, Hyderabad" sub="Capitaland · single site" />
          <FactCell kicker="Team" value="~1,000 planned" sub="Engineering · Data · Ops" className="sm:px-8" />
          <FactCell
            kicker="Open roles"
            value="Live on Talent500"
            sub="Apply directly"
            href="#careers"
            className="sm:px-8 sm:pr-0"
          />
        </motion.div>
      </div>
    </section>
  );
}

function FactCell({
  kicker, value, sub, href, className = '',
}: {
  kicker: string; value: string; sub: string; href?: string; className?: string;
}) {
  const body = (
    <>
      <div className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--muted)]">
        {kicker}
      </div>
      <div className="mt-2 text-lg sm:text-xl font-semibold tracking-tight text-[color:var(--ink)] inline-flex items-center gap-1.5">
        {value}
        {href && <ArrowRight size={16} aria-hidden className="opacity-60 transition-transform group-hover:translate-x-0.5" />}
      </div>
      <div className="mt-1 text-xs text-[color:var(--muted)]">{sub}</div>
    </>
  );
  if (href) {
    return (
      <a href={href} className={`group block ${className}`}>
        {body}
      </a>
    );
  }
  return <div className={className}>{body}</div>;
}

/**
 * Hero orbital. Three rotating dotted rings with three labelled "pillar" dots
 * and a central badge. Labels are HTML (not SVG <text>) so they wrap with the
 * container, never clip, and inherit theme colors. Each label is anchored to
 * its dot with absolute % positioning relative to the orbital container.
 */
function Orbital({ labels }: { labels: string[] }) {
  const reduce = useReducedMotion();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <div className="orbital relative aspect-square w-full max-w-[28rem] mx-auto" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-mesh blur-3xl opacity-60" />

      {/* viewBox is padded by 75 on each side so the outer-orbit label at
          radius 250 stays inside the drawing area at every angle. */}
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

          {!reduce ? (
            <>
              <PlanetWithLabel radius={137} labelRadius={167} startAngle={0}   dur={22} fill="url(#o1)" textColor="var(--brand-1-text)" label={labels[0]} />
              <PlanetWithLabel radius={162} labelRadius={192} startAngle={120} dur={30} fill="url(#o2)" textColor="var(--brand-2-text)" label={labels[1]} />
              <PlanetWithLabel radius={187} labelRadius={217} startAngle={240} dur={38} fill="url(#o3)" textColor="var(--brand-3-text)" label={labels[2]} />
            </>
          ) : (
            <>
              <StaticPlanetWithLabel radius={137} labelRadius={167} angle={0}   fill="url(#o1)" textColor="var(--brand-1-text)" label={labels[0]} />
              <StaticPlanetWithLabel radius={162} labelRadius={192} angle={120} fill="url(#o2)" textColor="var(--brand-2-text)" label={labels[1]} />
              <StaticPlanetWithLabel radius={187} labelRadius={217} angle={240} fill="url(#o3)" textColor="var(--brand-3-text)" label={labels[2]} />
            </>
          )}
        </g>
      </svg>

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

function SvgPillLabel({ label, textColor }: { label: string; textColor: string }) {
  const charW = 6.4;
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
