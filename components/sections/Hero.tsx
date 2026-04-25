'use client';

import { m } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { icon as iconByName } from '@/lib/icons';
import content from '@/data/content/hero.json';
import capabilities from '@/data/content/capabilities.json';

// Tailwind needs full class strings at build time, so the swatch → tint
// mapping is static. Mirrors the equivalent map in Capabilities.tsx so the
// hero preview reads as the same colour system.
const tints: Record<string, string> = {
  p: 'bg-[color:color-mix(in_srgb,var(--brand-1)_10%,transparent)] text-costco-red',
  t: 'bg-[color:color-mix(in_srgb,var(--brand-2)_10%,transparent)] text-costco-blue',
  r: 'bg-[color:color-mix(in_srgb,var(--brand-3)_18%,transparent)] text-[color:var(--brand-3)]',
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-[color:var(--line)] glass text-xs font-medium"
        >
          <Sparkles size={14} className="text-costco-red" aria-hidden />
          {content.eyebrow}
        </m.div>

        <div className="mt-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <m.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-extrabold tracking-tight leading-[1.05] text-[clamp(2.2rem,1.8rem+3vw,4.6rem)]"
            >
              {content.headlinePrefix}{' '}
              <span className="gradient-text">{content.headlineAccent}</span>
            </m.h1>

            <m.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="prose-justify mt-5 text-base sm:text-lg text-[color:var(--muted)]"
            >
              {content.introLead}{' '}
              <strong className="text-[color:var(--ink)]">{content.introHighlights[0]}</strong>
              {content.introJoinerA}{' '}
              <strong className="text-[color:var(--ink)]">{content.introHighlights[1]}</strong>
              {content.introJoinerB}{' '}
              <strong className="text-[color:var(--ink)]">{content.introHighlights[2]}</strong>{' '}
              {content.introTail}
            </m.p>

            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <a href={content.ctaPrimary.href} className="btn btn-primary">
                {content.ctaPrimary.label} <ArrowRight size={16} aria-hidden />
              </a>
              <a href={content.ctaSecondary.href} className="btn btn-ghost">
                {content.ctaSecondary.label}
              </a>
            </m.div>
          </div>

          {/* Pillar preview — three compact cards teasing the Capabilities
              section below. Replaces the orbital that used to sit here.
              Uses h2 to keep heading order valid (h1 in this section, then
              h2s here, then h2 on each section that follows). */}
          <div className="lg:col-span-5">
            <ul className="grid gap-3 sm:gap-4" aria-label="Capabilities preview">
              {capabilities.pillars.map((p, idx) => {
                const Icon = iconByName(p.icon);
                return (
                  <m.li
                    key={p.title}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
                  >
                    <a
                      href="#capabilities"
                      className="card card-hover p-4 sm:p-5 flex items-start gap-3 sm:gap-4 group"
                    >
                      <div className={`shrink-0 p-2.5 rounded-xl ${tints[p.swatch]}`}>
                        <Icon size={20} aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-bold">{p.title}</h2>
                          <ArrowRight
                            size={14}
                            aria-hidden
                            className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-[color:var(--muted)] mt-1 leading-snug">
                          {p.blurb}
                        </p>
                      </div>
                    </a>
                  </m.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
