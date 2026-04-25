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
                className="card card-hover overflow-hidden group flex flex-col"
              >
                <figure className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-costco-blue/15 to-costco-red/15">
                  {/* Real photography. Fallback gradient + icon stays visible
                      under the image until it loads (alt text used by SR). */}
                  <img
                    src={it.image}
                    alt={it.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Tag pill sits over the image */}
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-white/85 dark:bg-black/55 backdrop-blur text-[color:var(--ink)] font-semibold">
                    <Icon size={11} aria-hidden /> {it.tag}
                  </span>
                  <span className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-full bg-white/85 dark:bg-black/55 backdrop-blur text-[color:var(--muted)]">
                    {it.date}
                  </span>
                </figure>
                <div className="p-5 flex flex-col grow">
                  <h3 className="font-semibold leading-snug">{it.title}</h3>
                  <p className="text-sm text-[color:var(--muted)] mt-2 grow">{it.excerpt}</p>
                  {it.credit && (
                    <p className="mt-3 text-[10px] text-[color:var(--muted)]/70 italic">{it.credit}</p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
