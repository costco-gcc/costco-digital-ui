'use client';

import clsx from 'clsx';
import { useState } from 'react';

type Props = { className?: string; size?: number; showWordmark?: boolean; ariaLabel?: string };

/**
 * Where to drop your custom logo file. If `public/logo.png` (or .svg) exists,
 * <LogoFull> uses it. If not, it falls back to the inline SVG below.
 */
const CUSTOM_LOGO_SRC = '/logo.png';

/**
 * Compact navbar logo. Replaces the previous people/gear/chip illustration
 * + 6-stop rainbow wordmark with a cleaner Costco.com-inspired lockup:
 *
 *   [mark]   Costco·India
 *            GLOBAL CAPABILITY CENTRE
 *
 * The mark is a single geometric glyph — a navy "wholesale" stripe stack
 * with a red dot on top — that calls back to Costco's stripe + serif
 * trademark without re-using copyrighted assets. Two brand colours total
 * (red + navy), driven by CSS vars so the theme picker still recolours.
 */
export default function Logo({ className, size = 36, showWordmark = true, ariaLabel = 'Costco India GCC' }: Props) {
  return (
    <div className={clsx('flex items-center gap-2.5', className)} aria-label={ariaLabel}>
      <LogoSymbol size={size} />
      {showWordmark && (
        <div className="leading-tight">
          {/* Mobile — compact wordmark only. */}
          <div className="sm:hidden font-costco italic text-[15px] leading-none whitespace-nowrap" style={{ color: 'var(--brand-1)' }}>
            Costco<span style={{ color: 'var(--brand-2)' }}>·India</span>
          </div>
          {/* sm+ — wordmark + GCC subtitle in the navy/red two-tone Costco.com uses. */}
          <div className="hidden sm:block">
            <div className="font-costco italic text-[18px] md:text-[19px] leading-none whitespace-nowrap tracking-tight" style={{ color: 'var(--brand-1)' }}>
              Costco<span style={{ color: 'var(--brand-2)' }}> · India</span>
            </div>
            <div className="text-[10px] tracking-[0.22em] mt-1 whitespace-nowrap font-semibold uppercase text-[color:var(--muted)]">
              Global Capability Centre
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mark — a square red badge with a white italic "C" and a stack of  */
/*  navy stripes echoing Costco's "WHOLESALE" trademark stripe block. */
/*  Two brand colours, single-glyph silhouette, scales perfectly to   */
/*  favicon size. Theme-aware via var(--brand-1) and var(--brand-2).  */
/* ------------------------------------------------------------------ */
export function LogoSymbol({ size = 40, decorative = false, className }: { size?: number; decorative?: boolean; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : 'Costco India GCC'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Red badge */}
      <rect x="0" y="0" width="100" height="100" rx="20" fill="var(--brand-1)" />

      {/* White italic C — the Costco glyph reduced to one letter. Uses
          the same Sansita-italic stack the wordmark renders in. */}
      <text
        x="20" y="74"
        fontFamily="'Sansita', 'Cooper Black', 'Bookman Old Style', Georgia, serif"
        fontSize="76"
        fontWeight="900"
        fontStyle="italic"
        letterSpacing="-2"
        fill="#FFFFFF"
      >
        C
      </text>

      {/* Three navy stripes — direct callback to Costco's "WHOLESALE"
          trademark stripe block, anchored to the right side of the badge. */}
      <g fill="var(--brand-2)">
        <rect x="64" y="32" width="22" height="6" rx="1.5" />
        <rect x="64" y="42" width="22" height="6" rx="1.5" />
        <rect x="64" y="52" width="22" height="6" rx="1.5" />
      </g>

      {/* Saffron dot — small India accent below the stripes. Uses
          brand-3 (warm gold in costco-web; saffron in default costco). */}
      <circle cx="75" cy="68" r="4" fill="var(--brand-3)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Full lockup matching the user's reference image:                  */
/*    [People  •  Process  •  Technology] — connected by ribbon        */
/*               COSTCO     (huge italic red wordmark)                 */
/*    ≡≡≡≡  WHOLESALE       (4 stripes + italic blue wordmark)         */
/*       — GLOBAL CAPABILITY CENTRE —                                  */
/*  Wordmark uses Google Font "Sansita" (Cooper Black-alike).          */
/* ------------------------------------------------------------------ */
/**
 * LogoFull — renders the custom logo image at /logo.png if it exists,
 * otherwise falls back to the inline SVG composition below.
 *
 * To use your reference image: save it as `public/logo.png` (PNG works,
 * SVG is even better — change the constant above to `/logo.svg`). It will
 * be served at the site root and replaces the SVG fallback automatically.
 *
 * Trade-off: a raster image won't recolour with the theme picker. Vector
 * (`.svg`) sources keep their original colours too, but you can post-process
 * a vector to use `currentColor` if you want it theme-aware.
 */
export function LogoFull({ size = 220, className }: { size?: number; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return (
      <img
        src={CUSTOM_LOGO_SRC}
        alt="Costco Wholesale — Global Capability Centre"
        onError={() => setFailed(true)}
        style={{ height: `${size}px`, width: 'auto' }}
        className={className}
      />
    );
  }
  // Fallback: inline SVG lockup
  return <LogoFullSvg size={size} className={className} />;
}

function LogoFullSvg({ size = 220, className }: { size?: number; className?: string }) {
  const w = (size * 600) / 420;
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 600 420"
      role="img"
      aria-label="Costco Wholesale — Global Capability Centre"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top symbol — re-traced inline (kept as one unit for SSR-safety) */}
      <g transform="translate(60 0) scale(1)">
        {/* Ribbon */}
        <path
          d="M 100 150 C 145 110, 200 130, 230 110 C 265 88, 305 88, 340 105 C 375 122, 410 110, 450 90 L 460 95 C 420 130, 380 138, 340 130 C 305 124, 270 134, 240 152 C 200 172, 150 172, 100 160 Z"
          fill="var(--brand-2)"
        />
        {/* People */}
        <g fill="var(--brand-1)">
          <path d="M 30 145 C 60 105, 140 105, 170 145 L 170 158 C 140 130, 60 130, 30 158 Z" />
          <circle cx="42" cy="103" r="9" />
          <path d="M 30 113 Q 42 109 54 113 L 56 138 L 28 138 Z" />
          <circle cx="65" cy="86" r="11" />
          <path d="M 51 99 Q 65 94 79 99 L 82 132 L 48 132 Z" />
          <circle cx="98" cy="68" r="14" />
          <path d="M 80 84 Q 98 78 116 84 L 120 130 L 76 130 Z" />
          <circle cx="131" cy="86" r="11" />
          <path d="M 117 99 Q 131 94 145 99 L 148 132 L 114 132 Z" />
          <circle cx="154" cy="103" r="9" />
          <path d="M 142 113 Q 154 109 166 113 L 168 138 L 140 138 Z" />
        </g>
        {/* Gear */}
        <g transform="translate(245 90)">
          <circle r="50" fill="var(--brand-2)" />
          <circle r="40" fill="#fff" />
          <g fill="var(--brand-2)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <path key={a} d="M -6 -34 L 6 -34 L 5 -22 L -5 -22 Z" transform={`rotate(${a})`} />
            ))}
          </g>
          <circle r="22" fill="var(--brand-2)" />
          <circle r="14" fill="#fff" />
          <circle r="6" fill="var(--brand-2)" />
        </g>
        {/* Chip */}
        <g>
          <path
            d="M 320 85 C 322 50, 365 40, 395 50 C 425 60, 435 95, 420 120 C 405 145, 360 148, 335 130 C 318 118, 318 102, 320 85 Z"
            fill="var(--brand-2)"
          />
          <rect x="345" y="68" width="48" height="48" rx="4" fill="#fff" />
          <g fill="var(--brand-2)">
            {[349, 358, 367, 376, 385].map((x) => <rect key={`t${x}`} x={x} y="62" width="4" height="7" rx="1" />)}
            {[349, 358, 367, 376, 385].map((x) => <rect key={`b${x}`} x={x} y="115" width="4" height="7" rx="1" />)}
            {[72, 81, 90, 99, 108].map((y) => <rect key={`l${y}`} x="338" y={y} width="7" height="4" rx="1" />)}
            {[72, 81, 90, 99, 108].map((y) => <rect key={`r${y}`} x="393" y={y} width="7" height="4" rx="1" />)}
          </g>
          <rect x="358" y="80" width="22" height="22" rx="2" fill="var(--brand-2)" />
          <rect x="364" y="86" width="10" height="10" rx="1" fill="#fff" />
          <g fill="var(--brand-2)">
            <rect x="438" y="58" width="8" height="8" />
            <rect x="438" y="78" width="7" height="7" opacity="0.9" />
            <rect x="450" y="68" width="7" height="7" opacity="0.78" />
            <rect x="438" y="98" width="7" height="7" opacity="0.7" />
            <rect x="450" y="88" width="6" height="6" opacity="0.6" />
            <rect x="462" y="62" width="6" height="6" opacity="0.55" />
            <rect x="450" y="108" width="6" height="6" opacity="0.5" />
            <rect x="462" y="80" width="5" height="5" opacity="0.4" />
            <rect x="462" y="100" width="5" height="5" opacity="0.35" />
            <rect x="472" y="70" width="4" height="4" opacity="0.3" />
            <rect x="472" y="90" width="4" height="4" opacity="0.28" />
          </g>
        </g>
      </g>

      {/* COSTCO — Sansita Black Italic (Cooper Black-alike, theme red) */}
      <text
        x="300" y="285"
        fontFamily="'Sansita', 'Cooper Black', 'Bookman Old Style', Georgia, serif"
        fontWeight="900"
        fontStyle="italic"
        fontSize="118"
        textAnchor="middle"
        letterSpacing="-2"
        fill="var(--brand-1)"
      >
        COSTCO
      </text>

      {/* WHOLESALE — 4 stripes left, italic wordmark right */}
      <g>
        <rect x="80" y="305" width="160" height="4" fill="var(--brand-2)" />
        <rect x="80" y="314" width="160" height="4" fill="var(--brand-2)" />
        <rect x="80" y="323" width="160" height="4" fill="var(--brand-2)" />
        <rect x="80" y="332" width="160" height="4" fill="var(--brand-2)" />
        <text
          x="260" y="345"
          fontFamily="'Sansita', 'Cooper Black', 'Bookman Old Style', Georgia, serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="56"
          letterSpacing="-1"
          fill="var(--brand-2)"
        >
          WHOLESALE
        </text>
      </g>

      {/* — GLOBAL CAPABILITY CENTRE — */}
      <g>
        <line x1="120" y1="395" x2="170" y2="395" stroke="var(--brand-1)" strokeWidth="2.5" strokeLinecap="round" />
        <text
          x="300" y="401"
          fontFamily="'Helvetica Neue', system-ui, sans-serif"
          fontWeight="700"
          fontSize="20"
          letterSpacing="6"
          textAnchor="middle"
          fill="var(--brand-2)"
        >
          GLOBAL CAPABILITY CENTRE
        </text>
        <line x1="430" y1="395" x2="480" y2="395" stroke="var(--brand-2)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* Backwards-compat */
export const Mark = LogoSymbol;
