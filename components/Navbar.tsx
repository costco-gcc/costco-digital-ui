'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import ThemePicker from './ThemePicker';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import content from '@/data/content/navbar.json';

const links = content.links;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive('#' + e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Close mobile menu after a click
  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all',
        scrolled ? 'glass shadow-[0_8px_24px_-18px_rgba(0,0,0,0.25)]' : 'bg-transparent'
      )}
      role="banner"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2" aria-label={content.ariaLabel}>
        <a href="#top" className="flex items-center gap-2 shrink-0" aria-label={content.homeAriaLabel}>
          <Logo />
        </a>
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? 'page' : undefined}
                className={clsx(
                  'px-3 py-2 rounded-full text-sm font-medium transition-colors',
                  active === l.href
                    ? 'text-costco-blue bg-[color:var(--line)]'
                    : 'hover:text-costco-blue text-[color:var(--ink)]'
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <ThemePicker />
          <a href={content.ctaHref} className="hidden sm:inline-flex btn btn-primary">{content.ctaLabel}</a>
          <button
            type="button"
            className="lg:hidden p-2 rounded-full hover:bg-[color:var(--line)]"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-[color:var(--line)] glass">
          <ul className="px-4 py-3 grid gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-[color:var(--line)] text-sm font-medium"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={content.ctaHref}
                onClick={() => setOpen(false)}
                className="block mt-2 px-3 py-2 rounded-full text-center btn btn-primary"
              >
                {content.ctaLabel}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
