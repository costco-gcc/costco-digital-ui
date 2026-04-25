'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const principles = [
  { k: 'Obey the law', v: 'Compliance and ethics, end to end.' },
  { k: 'Take care of our members', v: 'Quality, value, and trust — every day.' },
  { k: 'Take care of our employees', v: 'Care, craft, and growth as a way of working.' },
  { k: 'Respect our suppliers', v: 'Long-term partnerships, fair dealing.' },
];

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="Our story"
            title="A Costco-grade engine, built in India."
            description="Costco Wholesale India Private Limited is the Global Capability Center for Costco — designing, building, and running technology and operations for warehouses, e-commerce, and members worldwide. Announced in 2025, we're scaling from Hyderabad."
          />
          <ol className="mt-2 space-y-3">
            {principles.map((p, i) => (
              <li key={p.k} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={18} className="mt-0.5 text-costco-blue shrink-0" />
                <span><strong>{p.k}.</strong> <span className="text-[color:var(--muted)]">{p.v}</span></span>
              </li>
            ))}
            <li className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 inline-block w-[18px] text-center font-bold text-costco-red">↳</span>
              <span><strong>Reward our shareholders</strong> — the natural outcome of living the four principles above.</span>
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
            <h3 className="font-semibold text-lg">Why a GCC, why India, why Hyderabad?</h3>
            <p className="text-[color:var(--muted)] mt-3">
              India is the world&rsquo;s largest hub for Global Capability Centers. Hyderabad pairs deep engineering and
              operations talent with strong policy support — a fit for Costco&rsquo;s quality-at-scale operating style.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              {[
                { k: 'Talent density', v: "Hyderabad's tech corridor — among India's strongest engineering ecosystems." },
                { k: 'Global delivery', v: 'Time-zone coverage and 24×7 follow-the-sun ops.' },
                { k: 'Speed to scale', v: 'Build, learn, and ramp without compromising standards.' },
              ].map((b) => (
                <div key={b.k} className="rounded-xl border border-[color:var(--line)] p-4">
                  <div className="text-sm font-semibold">{b.k}</div>
                  <div className="text-xs text-[color:var(--muted)] mt-1">{b.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-xs text-[color:var(--muted)]">
              <div className="rounded-xl bg-[color:var(--line)]/40 p-3">
                <div className="text-[color:var(--ink)] font-semibold text-sm">~1,000</div>
                planned employees in Hyderabad
              </div>
              <div className="rounded-xl bg-[color:var(--line)]/40 p-3">
                <div className="text-[color:var(--ink)] font-semibold text-sm">2025</div>
                year of public announcement
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
