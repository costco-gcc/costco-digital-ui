'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { Linkedin, Globe2 } from 'lucide-react';

type Member = { name: string; role: string; bio: string; initials: string; linkedin?: string; tag: string };

// Costco corporate leader is shown for context; India GCC leadership is named where public.
const team: Member[] = [
  {
    name: 'Ron Vachris',
    role: 'President & CEO, Costco Wholesale',
    bio: 'Joined Costco in 1982 as a forklift driver at Price Club; appointed CEO in January 2024 as the company\'s third chief executive.',
    initials: 'RV',
    tag: 'Global',
  },
  {
    name: 'Rajeev Mall',
    role: 'CEO, Costco Wholesale India GCC',
    bio: 'Leads the India GCC. Previously VP Global Business Services at Mondelēz International and Group CIO at Coca-Cola Bottlers Japan.',
    initials: 'RM',
    tag: 'India',
  },
];

export default function Leadership() {
  return (
    <section id="leadership" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow="Leadership"
          title="Operators who lead from the floor."
          description="Costco has had only three CEOs in 40+ years — that's how seriously the company takes principled leadership. Our India team carries that same operating culture."
        />
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
          {team.map((m, i) => (
            <motion.article
              key={m.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card card-hover p-5"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-costco-red to-costco-blue text-white grid place-items-center font-bold">
                  {m.initials}
                </div>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[color:var(--line)] text-[color:var(--muted)] inline-flex items-center gap-1">
                  <Globe2 size={10} /> {m.tag}
                </span>
              </div>
              <div className="mt-3 font-semibold">{m.name}</div>
              <div className="text-xs text-[color:var(--muted)]">{m.role}</div>
              <p className="text-xs text-[color:var(--muted)] mt-2 leading-relaxed">{m.bio}</p>
              {m.linkedin && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-costco-blue hover:underline"
                >
                  <Linkedin size={12} /> LinkedIn
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
