'use client';

import SectionHeader from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { MapPin, Building2, Users2, Sparkles, Navigation } from 'lucide-react';

export default function Locations() {
  return (
    <section id="locations" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader
          eyebrow="Where we work"
          title="Built in Hyderabad."
          description="A purpose-built campus in Madhapur — at the heart of India's most dynamic tech corridor."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="card overflow-hidden grid lg:grid-cols-2"
        >
          <div className="relative min-h-[280px] bg-gradient-to-br from-costco-blue/15 via-costco-red/10 to-accent-process/15">
            <CityArt />
            <span className="absolute top-4 left-4 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/85 dark:bg-black/40 backdrop-blur">
              <MapPin size={12} /> Hyderabad · Telangana
            </span>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-costco-red text-white">
              HQ · India GCC
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="text-2xl font-bold tracking-tight">Capitaland, Madhapur</h3>
            <p className="text-sm text-[color:var(--muted)] mt-1">Hyderabad, Telangana, India</p>

            <p className="mt-4 text-[15px] leading-relaxed">
              Our Hyderabad campus brings People, Technology, and Process under one roof — engineering,
              data, AI, operations, finance tech, and member-experience teams collaborating with Costco
              business and product partners worldwide.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Feature icon={Building2} title="Modern campus" body="Capitaland, Madhapur — Hyderabad's tech corridor." />
              <Feature icon={Users2} title="Hybrid teams" body="Collaboration spaces, focus zones, war-rooms." />
              <Feature icon={Sparkles} title="Award-aligned" body="Targeting Great Place to Work culture." />
              <Feature icon={Navigation} title="Connected" body="Close to Hitech City metro & expressways." />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Capitaland%2C+Madhapur%2C+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open in Maps
              </a>
              <a href="#contact" className="btn btn-ghost">Contact us</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
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
