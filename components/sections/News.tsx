'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { icon as iconByName } from '@/lib/icons';
import content from '@/data/content/news.json';

export default function News() {
  return (
    <section id="news" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          number={9}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <div className="grid md:grid-cols-3 gap-5">
          {content.items.map((it, i) => {
            const Icon = iconByName(it.icon);
            return (
              <motion.article
                key={it.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card card-hover overflow-hidden group"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-costco-blue/15 to-costco-red/15 grid place-items-center">
                  <Icon className="text-costco-blue" size={28} />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-wider font-semibold text-costco-red">
                    {it.tag} · <span className="text-[color:var(--muted)]">{it.date}</span>
                  </div>
                  <h3 className="mt-2 font-semibold leading-snug">{it.title}</h3>
                  <p className="text-sm text-[color:var(--muted)] mt-2">{it.excerpt}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
