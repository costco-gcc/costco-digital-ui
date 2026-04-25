'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { Leaf, Users2, ShieldCheck, Target, Sun } from 'lucide-react';

const goals = [
  {
    icon: Target,
    title: 'Net-zero by 2050',
    body: 'Costco committed to net-zero greenhouse-gas emissions across the value chain by 2050, with science-based interim targets.',
  },
  {
    icon: Leaf,
    title: '−39% Scope 1 + 2 by 2030',
    body: 'Absolute reduction in operational emissions vs a 2020 baseline — SBTi-approved.',
  },
  {
    icon: Sun,
    title: '100% renewable electricity by 2035',
    body: 'Steady transition of purchased electricity globally; 21% in calendar 2023 reported.',
  },
];

const pillars = [
  { icon: Leaf, title: 'Environment', body: 'Energy-efficient campuses, reduced single-use plastics, and circular IT to lower e-waste.' },
  { icon: Users2, title: 'Social', body: 'Education, skilling, and community outreach with NGOs across Telangana.' },
  { icon: ShieldCheck, title: 'Governance', body: 'Robust ethics, anti-bribery, data protection, and supplier diligence aligned with Costco global.' },
];

export default function ESG() {
  return (
    <section id="esg" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow="ESG & CSR"
          title="Doing the right thing, the Costco way."
          description="Costco's Climate Action Plan and ESR framework cover climate, food sustainability, natural resources, people, and governance. We extend it locally in India."
        />

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {goals.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="card p-6 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent"
            >
              <div className="p-2 rounded-xl inline-flex bg-emerald-500/10 text-emerald-600">
                <g.icon size={18} />
              </div>
              <h3 className="mt-3 font-semibold">{g.title}</h3>
              <p className="text-sm text-[color:var(--muted)] mt-1">{g.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="card card-hover p-6"
            >
              <div className="p-2 rounded-xl inline-flex bg-emerald-500/10 text-emerald-600">
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
