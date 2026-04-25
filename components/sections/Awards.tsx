'use client';

import { m } from 'framer-motion';
import { icon as iconByName } from '@/lib/icons';
import content from '@/data/content/awards.json';

export default function Awards() {
  return (
    <section aria-label={content.ariaLabel} className="py-12 border-y border-[color:var(--line)] bg-[color:var(--card)]/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {content.items.map((a, i) => {
          const Icon = iconByName(a.icon);
          return (
            <m.div
              key={a.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-xl bg-costco-blue/10 text-costco-blue"><Icon size={18} /></div>
              <div>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-xs text-[color:var(--muted)]">{a.sub}</div>
              </div>
            </m.div>
          );
        })}
      </div>
    </section>
  );
}
