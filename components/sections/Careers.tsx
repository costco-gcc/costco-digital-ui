'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, MapPin, ExternalLink, Clock, RefreshCw, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { loadOpenings, openings as seedOpenings, seedVerifiedAt, TALENT500_COMPANY_URL, type Opening } from '@/data/openings';

export default function Careers() {
  const [items, setItems] = useState<Opening[]>(seedOpenings);
  const [verifiedAt, setVerifiedAt] = useState<string>(seedVerifiedAt);
  const [total, setTotal] = useState<number>(seedOpenings.length);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    loadOpenings(basePath).then(({ items, verifiedAt, total }) => {
      setItems(items);
      setVerifiedAt(verifiedAt);
      if (typeof total === 'number') setTotal(total);
    });
  }, []);

  // Build category list dynamically from actual roles, sorted by count desc, then alphabetically.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const o of items) counts.set(o.category, (counts.get(o.category) ?? 0) + 1);
    const sorted = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
    return [{ name: 'All', count: items.length }, ...sorted];
  }, [items]);

  const visible = filter === 'All' ? items : items.filter((o) => o.category === filter);

  return (
    <section id="careers" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-8">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Careers"
              title={`${total} live roles. All in Hyderabad.`}
              description="Costco India GCC hiring is facilitated by Talent500. Tiles below are pulled from the live Talent500 listing — every link goes straight to the official job page to apply."
            />
          </div>
          <div className="lg:col-span-5 flex lg:justify-end">
            <a href={TALENT500_COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              View all on Talent500 <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {categories.map((c) => {
            const active = filter === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setFilter(c.name)}
                aria-pressed={active}
                className={
                  'text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ' +
                  (active
                    ? 'bg-costco-blue text-white border-costco-blue'
                    : 'border-[color:var(--line)] hover:bg-[color:var(--line)]')
                }
              >
                {c.name} <span className="opacity-70">({c.count})</span>
              </button>
            );
          })}
        </div>

        {visible.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((r, i) => (
              <motion.a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(i, 12) * 0.025 }}
                className="card p-5 hover:translate-y-[-2px] transition-transform group block"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-wider uppercase text-costco-red">{r.category}</span>
                    {r.jobCode && (
                      <span className="text-[10px] tracking-wider uppercase text-[color:var(--muted)]">· {r.jobCode}</span>
                    )}
                  </div>
                  <ArrowUpRight size={16} className="text-[color:var(--muted)] group-hover:text-costco-blue transition-colors" />
                </div>
                <h3 className="mt-2 font-semibold leading-snug">{r.title}</h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--muted)] mt-3">
                  <span className="inline-flex items-center gap-1"><MapPin size={12} />{r.location}</span>
                  {r.type && <span className="inline-flex items-center gap-1"><Briefcase size={12} />{r.type}</span>}
                  {r.experience && <span className="inline-flex items-center gap-1"><Clock size={12} />{r.experience}</span>}
                </div>
                {r.skills && r.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {r.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-costco-blue/8 text-costco-blue border border-costco-blue/15"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="font-semibold">No openings match this filter right now.</p>
            <p className="text-sm text-[color:var(--muted)] mt-1">The full list is always current on Talent500.</p>
            <a href={TALENT500_COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">
              Open Talent500 <ExternalLink size={14} />
            </a>
          </div>
        )}

        <div className="card mt-8 p-6 sm:p-8 grid md:grid-cols-2 gap-6 items-center bg-gradient-to-br from-costco-blue/5 via-transparent to-costco-red/5">
          <div>
            <h3 className="text-lg font-semibold">Don&rsquo;t see your role?</h3>
            <p className="text-sm text-[color:var(--muted)] mt-1">
              New roles open regularly across engineering, data, AI, cloud, security, ops, and finance — all in Hyderabad.
            </p>
          </div>
          <div className="flex md:justify-end">
            <a href={TALENT500_COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Open careers portal <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[color:var(--muted)]">
          <span className="inline-flex items-center gap-1"><Info size={12} /> List verified {verifiedAt}.</span>
          <a href={TALENT500_COMPANY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-costco-blue hover:underline">
            <RefreshCw size={12} /> Refresh on Talent500
          </a>
        </div>
      </div>
    </section>
  );
}
