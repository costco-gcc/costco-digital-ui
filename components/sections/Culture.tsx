'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { icon as iconByName } from '@/lib/icons';
import content from '@/data/content/culture.json';

export default function Culture() {
  return (
    <section id="culture" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="center"
          number={4}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.pillars.map((p, i) => {
            const Icon = iconByName(p.icon);
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="card p-5 hover:translate-y-[-2px] transition-transform"
              >
                <div className="p-2 rounded-xl inline-flex bg-costco-blue/10 text-costco-blue">
                  <Icon size={18} />
                </div>
                <h3 className="mt-3 font-semibold">{p.title}</h3>
                <p className="text-sm text-[color:var(--muted)] mt-1">{p.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
