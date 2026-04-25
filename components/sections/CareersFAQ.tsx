'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import content from '@/data/content/careers-faq.json';

/**
 * Compact FAQ — 2-column grid on lg+ so 12 items take half the vertical
 * space they used to. Each row is its own toggle (no single-open
 * accordion now since two columns means the user wants to scan multiple
 * answers in parallel). Section padding tightened from py-20/28 to
 * py-14/20.
 */
export default function CareersFAQ() {
  // Set of indices that are currently open. Multi-open so a 2-column
  // user can keep two answers visible at once without the page jumping.
  const [openSet, setOpenSet] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpenSet((s) => {
      const next = new Set(s);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section id="careers-faq" className="py-14 sm:py-20 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-8">
          <div className="lg:col-span-5">
            <SectionHeader
              number={8}
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.description}
            />
          </div>
        </div>

        {/* Two-column grid on lg+. Each column is an independent vertical
            stack of items, so the columns can grow at different rates as
            users open answers. */}
        <div className="grid lg:grid-cols-2 gap-x-10 gap-y-0">
          {content.items.map((it, i) => {
            const isOpen = openSet.has(i);
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <div key={it.q} className="border-t border-[color:var(--line)] last:border-b lg:[&:nth-child(2)]:border-t lg:even:border-t">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    className="w-full flex items-start justify-between gap-3 py-3.5 text-left text-[14px] sm:text-[15px] font-semibold hover:text-costco-blue focus-visible:text-costco-blue transition-colors"
                  >
                    <span>{it.q}</span>
                    <span
                      aria-hidden
                      className="shrink-0 grid place-items-center w-6 h-6 rounded-full border border-[color:var(--line)] text-[color:var(--muted)] transition-transform duration-300 mt-0.5"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
                    >
                      <Plus size={12} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 pr-8 text-[13px] text-[color:var(--muted)] leading-relaxed">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          {/* Last-row bottom border for the bottom-most card in each column */}
          <div className="border-b border-[color:var(--line)] lg:hidden" />
        </div>
      </div>
    </section>
  );
}
