// Minimal client-side consent state. No analytics are loaded unless analytics === true.

export type ConsentState = {
  necessary: true; // always on
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string; // ISO
  version: number;
};

const KEY = 'costco-gcc-consent';
export const CONSENT_VERSION = 1;

export const defaultConsent = (): ConsentState => ({
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
  decidedAt: '',
  version: CONSENT_VERSION,
});

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as ConsentState;
    if (v.version !== CONSENT_VERSION) return null;
    return v;
  } catch {
    return null;
  }
}

export function writeConsent(c: ConsentState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
    window.dispatchEvent(new CustomEvent('consent:changed', { detail: c }));
  } catch {}
}
