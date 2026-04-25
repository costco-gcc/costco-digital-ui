'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import {
  Users, Cpu, Workflow,
  ShoppingCart, ShieldCheck, Database, Cloud, Bot, BarChart3, Boxes, Banknote, Headset,
  type LucideIcon,
} from 'lucide-react';

type Pillar = {
  title: 'People' | 'Technology' | 'Process';
  swatch: 'p' | 't' | 'r'; // people / tech / process — color tokens applied via static class names
  icon: LucideIcon;
  blurb: string;
  capabilities: { icon: LucideIcon; label: string }[];
};

const pillars: Pillar[] = [
  {
    title: 'People',
    swatch: 'p',
    icon: Users,
    blurb: 'Member-obsessed engineers, designers, analysts, and ops leaders who do the right thing — every time.',
    capabilities: [
      { icon: Headset, label: 'Membership analytics & member services' },
      { icon: ShieldCheck, label: 'Trust, safety & risk' },
      { icon: BarChart3, label: 'People analytics & HR tech' },
    ],
  },
  {
    title: 'Technology',
    swatch: 't',
    icon: Cpu,
    blurb: 'Modern platforms that move at warehouse speed and member scale.',
    capabilities: [
      { icon: Cloud, label: 'GCP, BigQuery, GitHub Actions, GKE' },
      { icon: Database, label: 'Data engineering & lakehouse' },
      { icon: Bot, label: 'AI / ML & responsible Generative AI' },
    ],
  },
  {
    title: 'Process',
    swatch: 'r',
    icon: Workflow,
    blurb: 'Disciplined operations and continuous improvement, end to end.',
    capabilities: [
      { icon: ShoppingCart, label: 'Predictive inventory & merchandising' },
      { icon: Boxes, label: 'Omnichannel fulfilment & supply chain' },
      { icon: Banknote, label: 'Finance & accounting tech' },
    ],
  },
];

// Static class maps so Tailwind sees full strings at build time.
const tints = {
  p: 'bg-[color:color-mix(in_srgb,var(--brand-1)_10%,transparent)] text-costco-red',
  t: 'bg-[color:color-mix(in_srgb,var(--brand-2)_10%,transparent)] text-costco-blue',
  r: 'bg-[color:color-mix(in_srgb,var(--brand-3)_18%,transparent)] text-[color:var(--brand-3)]',
} as const;

const dots = {
  p: 'bg-[color:var(--brand-1)]',
  t: 'bg-[color:var(--brand-2)]',
  r: 'bg-[color:var(--brand-3)]',
} as const;

const blobs = {
  p: 'bg-[color:color-mix(in_srgb,var(--brand-1)_30%,transparent)]',
  t: 'bg-[color:color-mix(in_srgb,var(--brand-2)_30%,transparent)]',
  r: 'bg-[color:color-mix(in_srgb,var(--brand-3)_30%,transparent)]',
} as const;

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="center"
          eyebrow="Capabilities"
          title="People · Technology · Process — three pillars, one engine."
          description="The India GCC focuses on predictive inventory, membership analytics, omnichannel fulfilment, and cybersecurity — all in service of a member-first promise."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {pillars.map((p, idx) => (
            <motion.article
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
                  <p.icon size={22} />
                </div>
                <h3 className="text-xl font-bold">{p.title}</h3>
              </div>
              <p className="text-sm text-[color:var(--muted)] mt-3">{p.blurb}</p>

              <ul className="mt-5 space-y-2">
                {p.capabilities.map((c) => (
                  <li key={c.label} className="flex items-center gap-2.5 text-sm">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${dots[p.swatch]}`} aria-hidden />
                    <c.icon size={16} />
                    {c.label}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
