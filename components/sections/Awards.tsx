'use client';

import { motion } from 'framer-motion';
import { Award, ShieldCheck, Leaf, Star } from 'lucide-react';

const awards = [
  { icon: Award, title: 'Great Place to Work', sub: 'Targeted certification' },
  { icon: Star, title: 'Top Employer', sub: 'Recognized for culture & benefits' },
  { icon: ShieldCheck, title: 'ISO 27001', sub: 'Information security aligned' },
  { icon: Leaf, title: 'Green Campus', sub: 'LEED-aligned workspaces' },
];

export default function Awards() {
  return (
    <section aria-label="Awards and recognition" className="py-12 border-y border-[color:var(--line)] bg-[color:var(--card)]/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {awards.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-costco-blue/10 text-costco-blue"><a.icon size={18} /></div>
            <div>
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="text-xs text-[color:var(--muted)]">{a.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
