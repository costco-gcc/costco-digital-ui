'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import content from '@/data/content/careers-faq.json';

export default function CareersFAQ() {
  // Tracks which row is expanded. -1 = none. Single-open accordion so the
  // page doesn't accordion-explode if the user clicks every row.
  const [openIdx, setOpenIdx] = useState<number>(-1);

  return (
    <section id="careers-faq" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <SectionHeader
            number={8}
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
            {content.items.map((it, i) => {
              const isOpen = openIdx === i;
              const panelId = `faq-panel-${i}`;
              const buttonId = `faq-button-${i}`;
              return (
                <li key={it.q}>
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold hover:text-costco-blue focus-visible:text-costco-blue transition-colors"
                    >
                      <span>{it.q}</span>
                      <span
                        aria-hidden
                        className="shrink-0 grid place-items-center w-7 h-7 rounded-full border border-[color:var(--line)] text-[color:var(--muted)] transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
                      >
                        <Plus size={14} />
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
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-10 text-sm text-[color:var(--muted)] leading-relaxed">{it.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
