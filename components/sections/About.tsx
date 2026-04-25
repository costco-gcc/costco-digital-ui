'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import content from '@/data/content/about.json';

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <SectionHeader
            number={1}
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          <ol className="mt-2 space-y-3">
            {content.principles.map((p) => (
              <li key={p.k} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={18} className="mt-0.5 text-costco-blue shrink-0" />
                <span><strong>{p.k}.</strong> <span className="text-[color:var(--muted)]">{p.v}</span></span>
              </li>
            ))}
            <li className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 inline-block w-[18px] text-center font-bold text-costco-red">↳</span>
              <span><strong>{content.fifthPrinciple.k}</strong> — {content.fifthPrinciple.v}</span>
            </li>
          </ol>
        </div>

        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card p-6 sm:p-8"
          >
            <h3 className="font-semibold text-lg">{content.panel.title}</h3>
            <p className="text-[color:var(--muted)] mt-3">{content.panel.body}</p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {content.panel.bullets.map((b) => (
                <div key={b.k} className="rounded-xl border border-[color:var(--line)] p-4">
                  <div className="text-sm font-semibold">{b.k}</div>
                  <div className="text-xs text-[color:var(--muted)] mt-1">{b.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-xs text-[color:var(--muted)]">
              {content.panel.facts.map((f) => (
                <div key={f.k} className="rounded-xl bg-[color:var(--line)]/40 p-3">
                  <div className="text-[color:var(--ink)] font-semibold text-sm">{f.k}</div>
                  {f.v}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
