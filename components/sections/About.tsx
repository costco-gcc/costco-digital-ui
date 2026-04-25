'use client';

import SectionHeader from '@/components/SectionHeader';
import { m } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import content from '@/data/content/about.json';

// Editorial single-column layout. Three acts:
//   1. eyebrow + headline + lead
//   2. four numbered principles (the Code of Ethics) + a callout that
//      reads as the consequence — "shareholders are the natural outcome"
//   3. why-Hyderabad strip with stats anchored at the edges and three
//      reasons inline, no nested cards
//
// Replaces the previous left-sidebar / right-panel-card layout, which
// looked like a dashboard widget. Typography and dividers carry the
// rhythm now — no card boxes inside the section.
export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Act 1 — establish */}
        <SectionHeader
          number={1}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        {/* Act 2 — the four principles */}
        <m.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
          className="mt-12 sm:mt-16 text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--muted)]"
        >
          The operating standard
        </m.p>

        {/* 2×2 grid; gap-px + bg-line trick draws 1px hairlines between
            cells without nesting borders, so the four read as a single
            tablet rather than four floating cards. */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-4 grid sm:grid-cols-2 gap-px bg-[color:var(--line)] border border-[color:var(--line)] rounded-2xl overflow-hidden"
        >
          {content.principles.map((p, i) => (
            <div key={p.k} className="bg-[color:var(--bg)] p-6 sm:p-8">
              <div className="font-extrabold tracking-tight leading-none text-[clamp(2.4rem,1.6rem+2vw,3.4rem)]">
                <span className="gradient-text">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold">{p.k}</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{p.v}</p>
            </div>
          ))}
        </m.div>

        {/* Fifth principle as the cause-and-effect callout. Dashed border
            telegraphs "consequence" without the visual weight of another
            card. */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 flex items-start gap-3 sm:gap-4 px-6 sm:px-8 py-5 rounded-2xl border border-dashed border-[color:var(--line)]"
        >
          <ArrowRight size={18} className="mt-0.5 shrink-0 text-costco-red" aria-hidden />
          <p className="text-sm sm:text-base">
            <strong>{content.fifthPrinciple.k}</strong>{' '}
            <span className="text-[color:var(--muted)]">— {content.fifthPrinciple.v}</span>
          </p>
        </m.div>

        {/* Act 3 — why Hyderabad. Top divider sets it apart from the
            principles; reasons run inline; the two facts anchor the
            outer corners as display numerals. */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-20 sm:mt-28 pt-10 border-t border-[color:var(--line)]"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--muted)]">
            {content.panel.title}
          </p>
          <p className="mt-4 text-base sm:text-lg max-w-3xl text-[color:var(--ink)] leading-relaxed">
            {content.panel.body}
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-x-8 gap-y-6">
            {content.panel.bullets.map((b) => (
              <div key={b.k} className="border-l-2 border-[color:var(--line)] pl-4">
                <h4 className="text-sm font-semibold">{b.k}</h4>
                <p className="text-xs text-[color:var(--muted)] mt-1 leading-snug">{b.v}</p>
              </div>
            ))}
          </div>

          {/* Display stats — large numerals at the band's outer corners,
              caption underneath. Reads like a magazine fact strip. */}
          <div className="mt-12 pt-8 border-t border-[color:var(--line)] flex flex-wrap items-end justify-between gap-y-6 gap-x-8">
            {content.panel.facts.map((f, i) => (
              <div key={f.k} className={i === content.panel.facts.length - 1 ? 'text-right' : ''}>
                <div className="font-extrabold tracking-tight leading-none gradient-text text-[clamp(2.2rem,1.6rem+2vw,3.4rem)]">
                  {f.k}
                </div>
                <p className="text-xs text-[color:var(--muted)] mt-2">{f.v}</p>
              </div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
