'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { readConsent, writeConsent, defaultConsent, ConsentState } from '@/lib/cookies';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [openPrefs, setOpenPrefs] = useState(false);
  const [state, setState] = useState<ConsentState>(defaultConsent());

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      // Slight delay so it's less jarring on first load
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    } else {
      setState(existing);
    }
  }, []);

  function save(next: ConsentState) {
    const v: ConsentState = { ...next, decidedAt: new Date().toISOString() };
    writeConsent(v);
    setState(v);
    setShow(false);
    setOpenPrefs(false);
  }
  function acceptAll() { save({ ...defaultConsent(), preferences: true, analytics: true, marketing: true }); }
  function rejectAll() { save({ ...defaultConsent() }); }

  return (
    <>
      {/* Floating shield to re-open preferences any time */}
      <button
        type="button"
        aria-label="Cookie preferences"
        onClick={() => setOpenPrefs(true)}
        className="fixed bottom-5 left-5 z-40 p-2.5 rounded-full glass border border-[color:var(--line)] hover:translate-y-[-1px] transition-transform"
      >
        <ShieldCheck size={16} />
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-label="Cookie consent"
            className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-3 sm:bottom-3 sm:max-w-md z-50 glass rounded-2xl border border-[color:var(--line)] shadow-2xl p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-costco-blue/10 text-costco-blue"><Cookie size={18} /></div>
              <div className="flex-1">
                <h2 className="font-semibold text-sm">Your privacy choices</h2>
                <p className="text-xs text-[color:var(--muted)] mt-1">
                  We use only strictly necessary cookies by default. With your consent, we may also use preferences,
                  analytics, and marketing cookies. You can change this anytime via the shield icon in the bottom-left.
                  Read our <a className="underline" href="/legal/cookies/">Cookie policy</a> and <a className="underline" href="/legal/privacy/">Privacy notice</a>.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={acceptAll} className="btn btn-primary">Accept all</button>
                  <button onClick={rejectAll} className="btn btn-ghost">Reject non-essential</button>
                  <button onClick={() => setOpenPrefs(true)} className="btn btn-ghost">Preferences</button>
                </div>
              </div>
              <button onClick={() => setShow(false)} aria-label="Dismiss" className="p-1 rounded hover:bg-[color:var(--line)]"><X size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {openPrefs && (
        <Preferences
          state={state}
          onClose={() => setOpenPrefs(false)}
          onSave={(s) => save(s)}
        />
      )}
    </>
  );
}

function Preferences({ state, onClose, onSave }: { state: ConsentState; onClose: () => void; onSave: (s: ConsentState) => void }) {
  const [draft, setDraft] = useState<ConsentState>(state);
  return (
    <div role="dialog" aria-label="Cookie preferences" className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/50">
      <div className="w-full max-w-lg glass rounded-2xl border border-[color:var(--line)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Cookie preferences</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-[color:var(--line)]"><X size={16} /></button>
        </div>
        <p className="text-xs text-[color:var(--muted)] mt-1">
          Control how we use cookies. Strictly necessary cookies are always on so the site works.
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <Row title="Strictly necessary" desc="Required for core functionality and security. Cannot be disabled." checked disabled />
          <Row title="Preferences" desc="Remembers theme and consent choices."
               checked={draft.preferences} onChange={(v) => setDraft({ ...draft, preferences: v })} />
          <Row title="Analytics" desc="Anonymized usage stats to help us improve. Loaded only with consent."
               checked={draft.analytics} onChange={(v) => setDraft({ ...draft, analytics: v })} />
          <Row title="Marketing" desc="Optional ad-related cookies. Off by default."
               checked={draft.marketing} onChange={(v) => setDraft({ ...draft, marketing: v })} />
        </div>

        <div className="flex flex-wrap gap-2 mt-5 justify-end">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={() => onSave({ ...draft })} className="btn btn-primary">Save preferences</button>
        </div>
      </div>
    </div>
  );
}

function Row({ title, desc, checked, disabled, onChange }: { title: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-xl border border-[color:var(--line)] p-3">
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-[color:var(--muted)]">{desc}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 accent-costco-blue"
      />
    </label>
  );
}
