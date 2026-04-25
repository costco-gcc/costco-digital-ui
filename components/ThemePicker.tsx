'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';
import clsx from 'clsx';
import { applyTheme, themes, ThemeId, THEME_KEY, MODE_KEY, DEFAULT_THEME } from '@/lib/themes';

type Mode = 'light' | 'dark' | 'system';

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [mode, setMode] = useState<Mode>('system');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const t = (localStorage.getItem(THEME_KEY) as ThemeId | null) ?? DEFAULT_THEME;
      const m = (localStorage.getItem(MODE_KEY) as Mode | null) ?? 'system';
      setTheme(t);
      setMode(m);
      applyMode(m);
      applyTheme(t); // applyTheme reads current mode for correct light/dark set
    } catch {}
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if ((localStorage.getItem(MODE_KEY) || 'system') === 'system') {
        applyMode('system');
        applyTheme((localStorage.getItem(THEME_KEY) as ThemeId) || DEFAULT_THEME);
      }
    };
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  function pickTheme(id: ThemeId) {
    setTheme(id);
    applyTheme(id);
    try { localStorage.setItem(THEME_KEY, id); } catch {}
  }
  function pickMode(m: Mode) {
    setMode(m);
    applyMode(m);
    // Mode change implies brand vars need to flip light↔dark variants —
    // re-apply the active theme to refresh CSS custom properties.
    applyTheme(theme);
    try { localStorage.setItem(MODE_KEY, m); } catch {}
  }

  const activeTheme = useMemo(() => themes.find((t) => t.id === theme) ?? themes[0], [theme]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Open theme picker"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full hover:bg-[color:var(--line)] focus-visible:bg-[color:var(--line)]"
      >
        <Palette size={18} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Theme settings"
          className="theme-picker absolute right-0 mt-2 w-[15rem] max-w-[calc(100vw-1rem)] glass-opaque rounded-2xl p-3 shadow-2xl z-50"
        >
          {/* Mode — icon-only buttons. Names live on aria-label / title. */}
          <div className="flex gap-1.5" role="radiogroup" aria-label="Color mode">
            <ModeBtn current={mode} value="light" icon={Sun} label="Light" onClick={() => pickMode('light')} />
            <ModeBtn current={mode} value="dark" icon={Moon} label="Dark" onClick={() => pickMode('dark')} />
            <ModeBtn current={mode} value="system" icon={Monitor} label="System" onClick={() => pickMode('system')} />
          </div>

          {/* Palette — 3×2 grid of swatch tiles. Names on aria-label / title only. */}
          <div className="grid grid-cols-3 gap-1.5 mt-2" role="radiogroup" aria-label="Color palette">
            {themes.map((t) => (
              <PaletteBtn key={t.id} t={t} active={theme === t.id} onClick={() => pickTheme(t.id)} />
            ))}
          </div>

          {/* Live label of the active palette — minimal context, no description noise. */}
          <p
            aria-live="polite"
            className="mt-2 text-center text-[11px] font-semibold tracking-wide"
            style={{ color: 'var(--brand-2)' }}
          >
            {activeTheme.label}
          </p>
        </div>
      )}
    </div>
  );
}

function ModeBtn({ current, value, icon: Icon, label, onClick }: { current: Mode; value: Mode; icon: any; label: string; onClick: () => void }) {
  const active = current === value;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={clsx(
        'flex-1 grid place-items-center h-9 rounded-lg border transition-colors',
        active
          ? 'border-[color:var(--brand-2)] bg-[color:var(--line)]'
          : 'border-[color:var(--line)] hover:bg-[color:var(--line)]'
      )}
    >
      <Icon size={15} aria-hidden />
    </button>
  );
}

function PaletteBtn({ t, active, onClick }: { t: typeof themes[number]; active: boolean; onClick: () => void }) {
  // Swatches show the LIGHT-mode brand colors — that's what users associate
  // with "Costco red" etc., regardless of which mode they're currently in.
  // Six stripes per palette mirror the six brand tokens each theme defines.
  const stripes = [t.light.brand1, t.light.brand2, t.light.brand3, t.light.brand4, t.light.brand5, t.light.brand6];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={t.label}
      title={t.label}
      onClick={onClick}
      className={clsx(
        'h-9 rounded-lg overflow-hidden border-2 transition-all',
        active
          ? 'border-[color:var(--brand-2)] ring-2 ring-[color:var(--brand-2)]/30'
          : 'border-[color:var(--line)] hover:border-[color:var(--brand-2)]/50'
      )}
    >
      <span className="flex h-full" aria-hidden>
        {stripes.map((c, i) => <span key={i} style={{ background: c }} className="flex-1" />)}
      </span>
    </button>
  );
}

function applyMode(m: Mode) {
  const isDark = m === 'dark' || (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}
