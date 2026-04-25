'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ShieldCheck, KeyRound, ArrowLeft, LogIn, UserPlus, AlertCircle, Database } from 'lucide-react';
import { listPasskeys, registerPasskey, loginWithPasskey, forgetPasskeys, type StoredCred } from '@/lib/passkey';

// Hidden, unlinked-from-nav route. Reachable at /portal/.
// UI-only WebAuthn demo. Credential metadata is stored in IndexedDB. No server verification.

export default function PortalPage() {
  const [supported, setSupported] = useState(false);
  const [creds, setCreds] = useState<StoredCred[]>([]);
  const [name, setName] = useState('');
  const [authedAs, setAuthedAs] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'PublicKeyCredential' in window);
    refresh();
  }, []);

  async function refresh() {
    try { setCreds(await listPasskeys()); } catch { setCreds([]); }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      const c = await registerPasskey(name || 'Costco GCC user');
      await refresh();
      setAuthedAs(c.userName);
    } catch (e: any) { setErr(e?.message || 'Registration failed.'); }
    finally { setBusy(false); }
  }

  async function onLogin() {
    setErr(null); setBusy(true);
    try {
      const r = await loginWithPasskey();
      if (r.ok) {
        const matched = creds.find((c) => c.id === r.credentialId);
        setAuthedAs(matched?.userName ?? 'verified user');
      } else {
        setErr('Passkey did not verify.');
      }
    } catch (e: any) { setErr(e?.message || 'Login failed.'); }
    finally { setBusy(false); }
  }

  function onLogout() { setAuthedAs(null); }
  async function onForget() { await forgetPasskeys(); await refresh(); setAuthedAs(null); }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-20">
      <div className="w-full max-w-md card p-6 sm:p-8">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-costco-blue hover:underline">
          <ArrowLeft size={12} /> Back to home
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <Logo showWordmark={false} size={32} />
          <div>
            <h1 className="font-bold text-lg leading-tight">Employee portal</h1>
            <p className="text-xs text-[color:var(--muted)]">Passkey access · Costco India GCC</p>
          </div>
        </div>

        {!supported && (
          <div className="mt-6 p-3 rounded-xl border border-amber-300/40 bg-amber-300/10 text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 text-amber-600" />
            <span>Your browser does not support passkeys (WebAuthn). Try a modern browser on a device with biometrics.</span>
          </div>
        )}

        {authedAs ? (
          <div className="mt-6">
            <div className="p-4 rounded-xl border border-emerald-300/40 bg-emerald-300/10 text-sm flex items-start gap-2">
              <ShieldCheck size={16} className="mt-0.5 text-emerald-700" />
              <div>
                <strong>Signed in as {authedAs}.</strong>
                <p className="mt-1 text-xs">UI-only preview — connect your identity provider before going live.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={onLogout} className="btn btn-ghost">Sign out</button>
              <button onClick={onForget} className="btn btn-ghost">Forget passkeys on this device</button>
            </div>
          </div>
        ) : creds.length > 0 ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-[color:var(--muted)]">
              {creds.length} passkey{creds.length === 1 ? '' : 's'} registered on this device.
            </p>
            <ul className="text-xs space-y-1">
              {creds.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded-lg border border-[color:var(--line)] px-3 py-2">
                  <span className="font-medium">{c.userName}</span>
                  <span className="text-[color:var(--muted)]">{new Date(c.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
            <button onClick={onLogin} disabled={busy || !supported} className="btn btn-primary w-full justify-center">
              <LogIn size={16} /> {busy ? 'Verifying…' : 'Sign in with passkey'}
            </button>
            <button onClick={onForget} className="btn btn-ghost w-full justify-center">
              Forget passkeys on this device
            </button>
          </div>
        ) : (
          <form onSubmit={onRegister} className="mt-6 space-y-3">
            <label className="block text-sm">
              <span className="font-medium">Display name</span>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. j.doe@costco"
                className="mt-1 w-full rounded-xl border border-[color:var(--line)] bg-transparent px-3 py-2 outline-none focus:border-costco-blue"
                required
              />
            </label>
            <button type="submit" disabled={busy || !supported} className="btn btn-primary w-full justify-center">
              <UserPlus size={16} /> {busy ? 'Creating…' : 'Create passkey'}
            </button>
            <p className="text-xs text-[color:var(--muted)] flex items-start gap-1.5">
              <KeyRound size={14} className="mt-0.5" />
              Passkey metadata is stored in your browser&rsquo;s IndexedDB only. No server verification on this static preview.
            </p>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[color:var(--line)] text-[11px] text-[color:var(--muted)] flex items-center gap-1.5">
          <Database size={12} /> Storage: IndexedDB · DB <code>costco-gcc</code> · store <code>passkeys</code>
        </div>

        {err && (
          <div className="mt-4 p-3 rounded-xl border border-red-300/40 bg-red-300/10 text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 text-red-600" />
            <span>{err}</span>
          </div>
        )}
      </div>
    </div>
  );
}
