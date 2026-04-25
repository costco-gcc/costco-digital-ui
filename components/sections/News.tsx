'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { Building, Briefcase, Leaf } from 'lucide-react';

const items = [
  {
    icon: Building,
    tag: 'Announcement',
    date: '2025',
    title: 'Costco announces its first Global Capability Center in India.',
    excerpt: 'A purpose-built engine in Hyderabad to power Costco\'s technology and operations worldwide. Initial scale: ~1,000 employees.',
  },
  {
    icon: Briefcase,
    tag: 'Hiring',
    date: '2026',
    title: 'Hiring across engineering, data, AI, cloud, security, and quality.',
    excerpt: 'All India GCC openings are facilitated by Talent500. See the Careers section for live roles, or jump straight to the official portal.',
  },
  {
    icon: Leaf,
    tag: 'Sustainability',
    date: 'Costco global',
    title: 'Climate Action Plan: net-zero by 2050; SBTi-aligned 2030 targets.',
    excerpt: 'Costco committed to net-zero across the value chain, with a 39% Scope 1+2 reduction and a 20% Scope 3 intensity reduction by 2030.',
  },
];

export default function News() {
  return (
    <section id="news" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow="News & insights"
          title="From our teams, to the world."
          description="Announcements, hiring updates, and links to Costco's broader programs."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.article
                key={it.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="card card-hover overflow-hidden group"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-costco-blue/15 to-costco-red/15 grid place-items-center">
                  <Icon className="text-costco-blue" size={28} />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-wider font-semibold text-costco-red">
                    {it.tag} · <span className="text-[color:var(--muted)]">{it.date}</span>
                  </div>
                  <h3 className="mt-2 font-semibold leading-snug">{it.title}</h3>
                  <p className="text-sm text-[color:var(--muted)] mt-2">{it.excerpt}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
