'use client';

import SectionHeader from '@/components/SectionHeader';
import { m } from 'framer-motion';
import { icon as iconByName } from '@/lib/icons';
import content from '@/data/content/capabilities.json';

// Static class maps so Tailwind sees full strings at build time.
const tints: Record<string, string> = {
  p: 'bg-[color:color-mix(in_srgb,var(--brand-1)_10%,transparent)] text-costco-red',
  t: 'bg-[color:color-mix(in_srgb,var(--brand-2)_10%,transparent)] text-costco-blue',
  r: 'bg-[color:color-mix(in_srgb,var(--brand-3)_18%,transparent)] text-[color:var(--brand-3)]',
};

const dots: Record<string, string> = {
  p: 'bg-[color:var(--brand-1)]',
  t: 'bg-[color:var(--brand-2)]',
  r: 'bg-[color:var(--brand-3)]',
};

const blobs: Record<string, string> = {
  p: 'bg-[color:color-mix(in_srgb,var(--brand-1)_30%,transparent)]',
  t: 'bg-[color:color-mix(in_srgb,var(--brand-2)_30%,transparent)]',
  r: 'bg-[color:color-mix(in_srgb,var(--brand-3)_30%,transparent)]',
};

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="center"
          number={2}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {content.pillars.map((p, idx) => {
            const PillarIcon = iconByName(p.icon);
            return (
              <m.article
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="card card-hover p-6 relative overflow-hidden"
              >
                <div className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl opacity-50 ${blobs[p.swatch]}`} aria-hidden />
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${tints[p.swatch]}`}>
                    <PillarIcon size={22} />
                  </div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                </div>
                <p className="text-sm text-[color:var(--muted)] mt-3">{p.blurb}</p>

                <ul className="mt-5 space-y-2">
                  {p.capabilities.map((c) => {
                    const CapIcon = iconByName(c.icon);
                    return (
                      <li key={c.label} className="flex items-center gap-2.5 text-sm">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dots[p.swatch]}`} aria-hidden />
                        <CapIcon size={16} />
                        {c.label}
                      </li>
                    );
                  })}
                </ul>
              </m.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
