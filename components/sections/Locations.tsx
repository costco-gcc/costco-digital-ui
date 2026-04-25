'use client';

import SectionHeader from '@/components/SectionHeader';
import { m } from 'framer-motion';
import { MapPin, type LucideIcon } from 'lucide-react';
import { icon as iconByName } from '@/lib/icons';
import content from '@/data/content/locations.json';

export default function Locations() {
  return (
    <section id="locations" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          number={3}
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="card overflow-hidden grid lg:grid-cols-2"
        >
          <div className="relative min-h-[280px] bg-gradient-to-br from-costco-blue/15 via-costco-red/10 to-accent-process/15">
            <CityArt />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/85 dark:bg-black/40 backdrop-blur">
              <MapPin size={12} /> {content.tagCity}
            </span>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-costco-red text-white">
              {content.tagBadge}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-2xl font-bold tracking-tight">{content.officeName}</h3>
            <p className="text-sm text-[color:var(--muted)] mt-1">{content.officeCityLine}</p>

            <p className="prose-justify mt-4 text-[15px] leading-relaxed">{content.officeBlurb}</p>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {content.features.map((f) => (
                <Feature key={f.title} icon={iconByName(f.icon)} title={f.title} body={f.body} />
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={content.ctaPrimary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {content.ctaPrimary.label}
              </a>
              <a href={content.ctaSecondary.href} className="btn btn-ghost">{content.ctaSecondary.label}</a>
            </div>
          </div>
        </m.div>

        {/* Campus amenities strip — six tile row that gives candidates a feel
            for the office without inventing photos we don't have. */}
        <div className="mt-10">
          <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[color:var(--muted)] mb-4">
            {content.amenities.heading}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {content.amenities.items.map((a, i) => {
              const Icon = iconByName(a.icon);
              return (
                <m.div
                  key={a.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="rounded-xl border border-[color:var(--line)] p-4 bg-[color:var(--card)]/40"
                >
                  <Icon size={16} className="text-costco-blue" />
                  <div className="mt-2 text-sm font-semibold leading-tight">{a.label}</div>
                  <div className="text-xs text-[color:var(--muted)] mt-1 leading-snug">{a.body}</div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--line)] p-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon size={16} className="text-costco-blue" /> {title}
      </div>
      <p className="text-xs text-[color:var(--muted)] mt-1">{body}</p>
    </div>
  );
}

function CityArt() {
  return (
    <svg viewBox="0 0 600 300" className="absolute inset-0 w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="sky-hyd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
      </defs>
      <rect width="600" height="300" fill="url(#sky-hyd)" />
      <g fill="currentColor" className="text-costco-ink dark:text-white" opacity="0.55">
        {/* Charminar-inspired silhouette */}
        <rect x="20" y="220" width="60" height="60" />
        <rect x="90" y="190" width="80" height="90" />
        <path d="M210 220 Q240 170 270 220 L270 280 L210 280 Z" />
        <rect x="280" y="170" width="40" height="110" />
        <path d="M300 165 L290 155 L310 155 Z" />
        <rect x="330" y="120" width="60" height="160" />
        <path d="M360 115 L348 100 L372 100 Z" />
        <rect x="400" y="200" width="50" height="80" />
        <path d="M460 190 L490 150 L520 190 L520 280 L460 280 Z" />
        <rect x="540" y="210" width="40" height="70" />
      </g>
    </svg>
  );
}
