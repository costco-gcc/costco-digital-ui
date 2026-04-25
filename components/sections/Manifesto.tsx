'use client';

import { motion } from 'framer-motion';
import content from '@/data/content/manifesto.json';

/**
 * Editorial pause between Capabilities and Locations. One sentence,
 * fragmented across lines, fades in word-by-line as it scrolls into
 * view. Centred, lots of vertical space — deliberate brake on the
 * page rhythm. No CTAs, no icons; just the statement.
 */
export default function Manifesto() {
  return (
    <section
      aria-label="Operating standard"
      className="relative py-28 sm:py-40 overflow-hidden"
    >
      {/* Faint orbital echo — single dotted ring + a brand-tinted glow,
          to thread the page's visual motif through the pause. */}
      <BackdropEcho />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30%' }}
          transition={{ duration: 0.5 }}
          className="text-[11px] uppercase tracking-[0.22em] font-semibold text-costco-red"
        >
          {content.kicker}
        </motion.p>

        <h2 className="mt-6 font-extrabold tracking-tight leading-[1.08] text-[clamp(1.9rem,1.4rem+3.2vw,4.2rem)] text-balance">
          {content.lines.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-25%' }}
              transition={{ duration: 0.55, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {i === content.lines.length - 1
                ? <span className="gradient-text">{line}</span>
                : line}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-25%' }}
          transition={{ duration: 0.55, delay: 0.05 + content.lines.length * 0.08 + 0.05 }}
          className="mt-8 text-[color:var(--muted)] text-base sm:text-lg"
        >
          {content.footer}
        </motion.p>
      </div>
    </section>
  );
}

function BackdropEcho() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center pointer-events-none">
      {/* Single soft brand-coloured glow */}
      <div
        className="absolute w-[80vmin] h-[80vmin] rounded-full blur-3xl opacity-30"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--brand-3) 55%, transparent) 0%, transparent 60%)',
        }}
      />
      {/* Single dotted ring — much fainter than the hero orbital */}
      <svg viewBox="-100 -100 200 200" className="absolute w-[min(86vmin,52rem)] h-[min(86vmin,52rem)]">
        <circle r="84" fill="none" stroke="var(--ink)" strokeOpacity="0.08" strokeWidth="0.6" strokeDasharray="1 4" />
        <circle r="64" fill="none" stroke="var(--ink)" strokeOpacity="0.06" strokeWidth="0.6" strokeDasharray="1 6" />
      </svg>
    </div>
  );
}
