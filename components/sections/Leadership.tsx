'use client';

import SectionHeader from '@/components/SectionHeader';
import { m } from 'framer-motion';
import { Linkedin, Globe2, Briefcase } from 'lucide-react';
import content from '@/data/content/leadership.json';

type Member = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  linkedin?: string;
  tag: string;
  openSeat?: boolean;
};

export default function Leadership() {
  const team = content.team as Member[];
  return (
    <section id="leadership" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          number={6}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <m.article
              key={member.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={
                member.openSeat
                  ? 'card p-5 border-dashed bg-transparent'
                  : 'card card-hover p-5'
              }
            >
              <div className="flex items-start justify-between">
                {member.openSeat ? (
                  <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[color:var(--line)] grid place-items-center text-[color:var(--muted)]">
                    <Briefcase size={20} aria-hidden />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-costco-red to-costco-blue text-white grid place-items-center font-bold">
                    {member.initials}
                  </div>
                )}
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-[color:var(--line)] text-[color:var(--muted)] inline-flex items-center gap-1">
                  <Globe2 size={10} /> {member.tag}
                </span>
              </div>
              <div className={`mt-3 font-semibold ${member.openSeat ? 'text-[color:var(--muted)]' : ''}`}>{member.name}</div>
              <div className="text-xs text-[color:var(--muted)]">{member.role}</div>
              <p className="text-xs text-[color:var(--muted)] mt-2 leading-relaxed">{member.bio}</p>
              {member.openSeat ? (
                <a
                  href="#careers"
                  className="inline-flex items-center gap-1 mt-3 text-xs text-costco-blue hover:underline"
                >
                  See open roles →
                </a>
              ) : (
                member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs text-costco-blue hover:underline"
                  >
                    <Linkedin size={12} /> LinkedIn
                  </a>
                )
              )}
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
