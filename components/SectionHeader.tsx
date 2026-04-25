'use client';

import { m } from 'framer-motion';
import clsx from 'clsx';

type Props = {
  eyebrow?: string;
  /** Optional editorial section number, e.g. 2 → renders "02 ·" before
      the eyebrow text in the same eyebrow style. */
  number?: number;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  id?: string;
};

export default function SectionHeader({ eyebrow, number, title, description, align = 'left', id }: Props) {
  const numberStr = typeof number === 'number' ? String(number).padStart(2, '0') : null;
  return (
    <div className={clsx('mb-10', align === 'center' && 'text-center mx-auto max-w-3xl')} id={id}>
      {(eyebrow || numberStr) && (
        <m.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4 }}
          className="text-xs uppercase tracking-[0.22em] font-semibold text-costco-red"
        >
          {numberStr && (
            <>
              <span className="text-[color:var(--muted)] tabular-nums">{numberStr}</span>
              <span aria-hidden className="mx-2 text-[color:var(--muted)]/50">·</span>
            </>
          )}
          {eyebrow}
        </m.p>
      )}
      <m.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="section-title mt-2"
      >
        {title}
      </m.h2>
      {description && (
        <m.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[color:var(--muted)] mt-3 text-base sm:text-lg max-w-2xl"
        >
          {description}
        </m.p>
      )}
    </div>
  );
}
