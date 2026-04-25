'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [v, setV] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setV(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Decorative — the browser already exposes scroll position via its
  // scrollbar, so hiding from AT prevents the page from having a stray
  // widget outside any landmark.
  return (
    <div
      className="scroll-progress"
      aria-hidden="true"
      style={{ transform: `scaleX(${v})` }}
    />
  );
}
