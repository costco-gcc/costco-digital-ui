'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import content from '@/data/content/stats.json';

export default function Stats() {
  return (
    <section aria-label={content.ariaLabel} className="border-y border-[color:var(--line)] bg-[color:var(--card)]/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--muted)] mb-8">
          {content.kicker}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:divide-x md:divide-[color:var(--line)]">
          {content.items.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <CountUp
                value={s.k}
                className="text-4xl sm:text-5xl md:text-[3.25rem] lg:text-6xl font-extrabold tracking-tight gradient-text leading-[1]"
              />
              <div className="font-semibold mt-3 text-[15px]">{s.label}</div>
              <div className="text-xs text-[color:var(--muted)] mt-1 leading-snug">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Counts the numeric portion of a stat string up from 0 to its final
   value when scrolled into view. Preserves prefix ($, ~, etc.) and suffix
   (B, M, K, +, ×7, etc.) so "$254B", "81.4M", "924+", "24×7" all behave
   correctly. Decimal precision is matched from the source value so "81.4M"
   ticks as 0.0 → 81.4. Values whose suffix contains its own digit (e.g.
   "24×7") render statically — they read as labels, not counts.
   Respects prefers-reduced-motion. */
function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const reduce = useReducedMotion();

  const match = value.match(/^([^\d.-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  const suffixHasDigit = match ? /\d/.test(match[3]) : false;
  const target = match && !suffixHasDigit ? parseFloat(match[2]) : NaN;
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0;
  const prefix = match?.[1] ?? '';
  const suffix = match?.[3] ?? '';

  const [display, setDisplay] = useState<string>(reduce || isNaN(target) ? value : `${prefix}0${decimals ? '.' + '0'.repeat(decimals) : ''}${suffix}`);

  useEffect(() => {
    if (!inView || reduce || isNaN(target)) {
      setDisplay(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const n = target * eased;
      setDisplay(`${prefix}${n.toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, prefix, suffix, decimals, value]);

  return (
    <div ref={ref} className={className} aria-label={value}>
      <span aria-hidden>{display}</span>
    </div>
  );
}
