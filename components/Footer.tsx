'use client';

import Logo, { LogoFull } from './Logo';
import { Linkedin, Twitter, Youtube, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[color:var(--line)] mt-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          {/* The full lockup PNG has an artwork drop-shadow that reads as a
              halo on dark backgrounds. Sit it on a white card so it always
              renders against its intended white canvas (subtle on light
              mode, becomes a clean badge on dark). */}
          <div className="inline-block bg-white rounded-xl p-2.5 shadow-sm ring-1 ring-black/5">
            <LogoFull size={130} />
          </div>
          <p className="text-sm text-[color:var(--muted)] mt-3 max-w-xs">
            Costco Wholesale India Private Limited — uniting People, Technology, and Process
            to power Costco worldwide.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <a aria-label="LinkedIn" href="#" className="p-2 rounded-full hover:bg-[color:var(--line)]"><Linkedin size={18} /></a>
            <a aria-label="Twitter / X" href="#" className="p-2 rounded-full hover:bg-[color:var(--line)]"><Twitter size={18} /></a>
            <a aria-label="YouTube" href="#" className="p-2 rounded-full hover:bg-[color:var(--line)]"><Youtube size={18} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-[color:var(--muted)]">
            <li><a href="#about" className="hover:text-costco-blue">About</a></li>
            <li><a href="#capabilities" className="hover:text-costco-blue">Capabilities</a></li>
            <li><a href="#culture" className="hover:text-costco-blue">Life @ Costco</a></li>
            <li><a href="#news" className="hover:text-costco-blue">News &amp; Insights</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Engage</h3>
          <ul className="space-y-2 text-sm text-[color:var(--muted)]">
            <li><a href="#careers" className="hover:text-costco-blue">Careers</a></li>
            <li><a href="https://talent500.com/jobs/costco/" target="_blank" rel="noopener noreferrer" className="hover:text-costco-blue">Apply on Talent500</a></li>
            <li><a href="#contact" className="hover:text-costco-blue">Contact</a></li>
            <li><a href="/portal/" className="hover:text-costco-blue">Employee portal</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Location</h3>
          <ul className="space-y-2 text-sm text-[color:var(--muted)]">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> Capitaland, Madhapur<br />Hyderabad, Telangana, India</li>
          </ul>
          <h3 className="text-sm font-semibold mb-2 mt-5">Legal</h3>
          <ul className="space-y-2 text-sm text-[color:var(--muted)]">
            <li><a href="/legal/privacy/" className="hover:text-costco-blue">Privacy notice</a></li>
            <li><a href="/legal/cookies/" className="hover:text-costco-blue">Cookies</a></li>
            <li><a href="/legal/terms/" className="hover:text-costco-blue">Terms of use</a></li>
            <li><a href="/legal/accessibility/" className="hover:text-costco-blue">Accessibility</a></li>
            <li><a href="/legal/whistleblower/" className="hover:text-costco-blue">Whistleblower</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--line)]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-[color:var(--muted)]">
          <p>
            © {year} Costco Wholesale India Private Limited. All rights reserved. Costco Wholesale and the
            Costco logo are trademarks of Costco Wholesale Corporation, used here for identification only.
          </p>
          <p>
            Built with care · DPDP &amp; GDPR aware · WCAG 2.2 AA targeted
          </p>
        </div>
      </div>
    </footer>
  );
}
