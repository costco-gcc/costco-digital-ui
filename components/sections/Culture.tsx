'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { HeartHandshake, GraduationCap, Sprout, Users, Stethoscope, Palette } from 'lucide-react';

const pillars = [
  { icon: HeartHandshake, title: 'Belonging', body: 'Inclusive teams where every voice counts. Employee resource groups, women in tech, and accessibility-first events.' },
  { icon: GraduationCap, title: 'Growth', body: 'Learning budgets, certifications, internal mobility, and Costco-funded technical academies.' },
  { icon: Stethoscope, title: 'Wellbeing', body: 'Comprehensive health cover for you and dependents, mental wellness support, and parental leave.' },
  { icon: Sprout, title: 'Sustainability', body: 'Green campuses, reduced printing, clean commute incentives, and CSR aligned with India initiatives.' },
  { icon: Users, title: 'Community', body: 'Hackathons, demo days, family days, and warehouse experience visits.' },
  { icon: Palette, title: 'Craft', body: 'Engineering excellence guilds, design critiques, and a culture of curious tinkering.' },
];

export default function Culture() {
  return (
    <section id="culture" className="py-20 sm:py-28 bg-[color:var(--card)]/30 border-y border-[color:var(--line)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          align="center"
          eyebrow="Life @ Costco India"
          title="A workplace built on care, craft, and community."
          description="Costco's Code of Ethics is a way of working. Here's how it shows up day-to-day in India."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="card p-5 hover:translate-y-[-2px] transition-transform"
            >
              <div className="p-2 rounded-xl inline-flex bg-costco-blue/10 text-costco-blue">
                <p.icon size={18} />
              </div>
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="text-sm text-[color:var(--muted)] mt-1">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
