'use client';

// Wraps the app in framer-motion's LazyMotion with the slim domAnimation
// feature set. Sections and components must use the `m` API (m.div, m.h2,
// …) instead of `motion.*` — `strict` enforces this at runtime in dev.
//
// Why: `motion.*` ships the full feature bundle (~50KB gzip) on the first
// import. `LazyMotion` + `m` defers everything not in `domAnimation` and
// brings the per-page cost down to ~17KB gzip. We don't use drag, layout,
// or gesture features anywhere, so domAnimation is sufficient.

import { LazyMotion, domAnimation } from 'framer-motion';

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
