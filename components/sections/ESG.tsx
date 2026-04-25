'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { icon as iconByName } from '@/lib/icons';
import content from '@/data/content/esg.json';

export default function ESG() {
  return (
    <section id="esg" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {content.goals.map((g, i) => {
            const Icon = iconByName(g.icon);
            return (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card p-6 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent"
              >
                <div className="p-2 rounded-xl inline-flex bg-emerald-500/10 text-emerald-600">
                  <Icon size={18} />
                </div>
                <h3 className="mt-3 font-semibold">{g.title}</h3>
                <p className="text-sm text-[color:var(--muted)] mt-1">{g.body}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {content.pillars.map((p, i) => {
            const Icon = iconByName(p.icon);
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="card card-hover p-6"
              >
                <div className="p-2 rounded-xl inline-flex bg-emerald-500/10 text-emerald-600">
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
