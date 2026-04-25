'use client';

import { motion } from 'framer-motion';
import content from '@/data/content/stats.json';

export default function Stats() {
  return (
    <section aria-label={content.ariaLabel} className="border-y border-[color:var(--line)] bg-[color:var(--card)]/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {content.items.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text">{s.k}</div>
            <div className="font-semibold mt-1">{s.label}</div>
            <div className="text-xs text-[color:var(--muted)]">{s.sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
