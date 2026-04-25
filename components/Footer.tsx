'use client';

import { useEffect, useState } from 'react';
import { LogoFull } from './Logo';
import { MapPin, ArrowUpRight, ExternalLink } from 'lucide-react';
import content from '@/data/content/footer.json';

/**
 * Manifesto footer — gradient hairline rule, tone-setting line, four-column
 * grid (Company / Engage / Visit / Now in Hyderabad), legal strip, and a
 * faint outline-typography backdrop word for visual depth. Includes a small
 * live-clock card that ticks each minute from the user's machine but renders
 * the office time zone (IST). The clock hydrates client-side so SSR/SSG
 * output is identical for everyone.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-12 overflow-hidden">
      {/* Brand gradient hairline replaces the usual flat border-top */}
      <div
        className="h-px w-full"
        style={{
          backgroundImage:
            'linear-gradient(to right, transparent 0%, var(--brand-1) 18%, var(--brand-3) 50%, var(--brand-2) 82%, transparent 100%)',
          opacity: 0.55,
        }}
        aria-hidden
      />

      {/* Outline-typography backdrop word — sits behind the columns and
          fades into the page at the bottom. Hidden on mobile where it would
          steal screen space. */}
      <BackdropWord word={content.backdropWord} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-8">
        {/* Manifesto */}
        <p className="max-w-3xl text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.15]">
          {content.manifesto}
        </p>

        {/* Brand row + columns */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="inline-block bg-white rounded-xl p-2.5 shadow-sm ring-1 ring-black/5">
              <LogoFull size={130} />
            </div>
            <p className="text-sm text-[color:var(--muted)] mt-4 max-w-xs">
              {content.brandStatement}
            </p>
          </div>

          <nav className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm" aria-label="Footer">
            {content.columns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[color:var(--muted)] mb-3">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5 text-[color:var(--ink)]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target={l.external ? '_blank' : undefined}
                        rel={l.external ? 'noopener noreferrer' : undefined}
                        className="fx-link inline-flex items-center gap-1"
                      >
                        {l.label}
                        {l.external && <ExternalLink size={11} aria-hidden className="opacity-60" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <VisitColumn />
            <NowColumn />
          </nav>
        </div>

        {/* Legal strip */}
        <div className="mt-12 pt-6 border-t border-[color:var(--line)]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[color:var(--muted)]">
              {content.legal.heading}
            </span>
            {content.legal.links.map((l, i) => (
              <span key={l.href} className="inline-flex items-center gap-3">
                <a href={l.href} className="fx-link text-[color:var(--ink)]">{l.label}</a>
                {i < content.legal.links.length - 1 && <span aria-hidden className="text-[color:var(--muted)]/50">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-3 text-[11px] text-[color:var(--muted)]">
          <p className="max-w-3xl">{content.copyrightTemplate.replace('{year}', String(year))}</p>
          <p>{content.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function VisitColumn() {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[color:var(--muted)] mb-3">
        {content.visit.heading}
      </h3>
      <p className="text-[color:var(--ink)] flex items-start gap-2">
        <MapPin size={14} className="mt-0.5 text-costco-blue shrink-0" />
        <span>
          <strong className="font-semibold">{content.visit.name}</strong>
          <br />
          <span className="text-[color:var(--muted)]">{content.visit.cityLine}</span>
        </span>
      </p>
      <a
        href={content.visit.mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fx-link inline-flex items-center gap-1 mt-3 text-costco-blue text-sm"
      >
        {content.visit.mapsLabel}
        <ArrowUpRight size={13} aria-hidden />
      </a>
    </div>
  );
}

function NowColumn() {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[color:var(--muted)] mb-3">
        {content.now.heading}
      </h3>
      <LiveClock ianaTimeZone={content.now.ianaTimeZone} tzAbbrev={content.now.timezoneAbbrev} statusLabel={content.now.statusLabel} />
    </div>
  );
}

/* Live IST clock — ticks once a minute and renders the office time zone
   regardless of where the visitor sits. Renders a stable placeholder for
   SSR/SSG so hydration doesn't mismatch. */
function LiveClock({ ianaTimeZone, tzAbbrev, statusLabel }: { ianaTimeZone: string; tzAbbrev: string; statusLabel: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // Align ticks to wall-clock minute so all visitors see the same number.
    const msToNextMinute = 60_000 - (Date.now() % 60_000);
    let interval: number | undefined;
    const align = window.setTimeout(() => {
      setNow(new Date());
      interval = window.setInterval(() => setNow(new Date()), 60_000);
    }, msToNextMinute);
    return () => {
      window.clearTimeout(align);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const time = now
    ? new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ianaTimeZone }).format(now)
    : '—';
  const day = now
    ? new Intl.DateTimeFormat('en-IN', { weekday: 'short', month: 'short', day: 'numeric', timeZone: ianaTimeZone }).format(now)
    : '';

  return (
    <div className="rounded-xl border border-[color:var(--line)] p-3 bg-[color:var(--card)]/40">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold tracking-tight tabular-nums">{time}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">{tzAbbrev}</span>
      </div>
      <div className="text-xs text-[color:var(--muted)] mt-0.5">{day}</div>
      <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-600">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" aria-hidden />
        {statusLabel}
      </div>
    </div>
  );
}

/* Massive low-contrast outlined word that sits behind the footer columns
   for visual depth. Pure decoration — aria-hidden, hidden on small screens.
   Uses SVG so the stroke can scale with viewport without going blurry. */
function BackdropWord({ word }: { word: string }) {
  return (
    <div
      aria-hidden
      className="hidden md:block pointer-events-none absolute inset-x-0 bottom-0 h-[60%] overflow-hidden select-none"
    >
      <svg
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-0 w-full h-full"
      >
        <text
          x="50%"
          y="100%"
          textAnchor="middle"
          dominantBaseline="alphabetic"
          fontSize="220"
          fontWeight="900"
          letterSpacing="-0.03em"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="1"
          opacity="0.07"
          style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}
        >
          {word}
        </text>
      </svg>
      {/* Subtle vertical fade so the word melts into the page bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, var(--bg) 0%, transparent 30%, transparent 70%, var(--bg) 100%)',
        }}
      />
    </div>
  );
}
