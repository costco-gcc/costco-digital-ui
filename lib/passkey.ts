// Frontend-only passkey UX demo using WebAuthn primitives.
// Credential metadata is stored in IndexedDB. There is NO server verification.
// In production, registration/assertion must be verified by your IdP / backend.

const DB_NAME = 'costco-gcc';
const DB_VERSION = 1;
const STORE = 'passkeys';

export type StoredCred = {
  id: string;          // base64url credential rawId
  userHandle: string;  // base64url user.id
  userName: string;    // display name shown in UI
  createdAt: string;   // ISO timestamp
  transports?: AuthenticatorTransport[];
};

// ---------- IndexedDB helpers ----------

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this environment.'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open IndexedDB.'));
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T> | Promise<T>): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    let result: any;
    const out = fn(store);
    if (out instanceof IDBRequest) {
      out.onsuccess = () => { result = out.result; };
      out.onerror = () => reject(out.error);
    } else {
      out.then((v) => { result = v; }).catch(reject);
    }
    t.oncomplete = () => { db.close(); resolve(result as T); };
    t.onerror = () => { db.close(); reject(t.error); };
    t.onabort = () => { db.close(); reject(t.error ?? new Error('Transaction aborted.')); };
  });
}

async function putCred(c: StoredCred) {
  return tx<void>('readwrite', (s) => s.put(c) as unknown as IDBRequest<void>);
}

async function listCreds(): Promise<StoredCred[]> {
  return tx<StoredCred[]>('readonly', (s) => s.getAll() as IDBRequest<StoredCred[]>);
}

async function clearCreds() {
  return tx<void>('readwrite', (s) => s.clear() as unknown as IDBRequest<void>);
}

// ---------- base64url helpers ----------

function rand(len = 32) {
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return a;
}
function b64u(bytes: ArrayBuffer | Uint8Array) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64u(s: string) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const a = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
  return a;
}

// ---------- public API ----------

export async function listPasskeys(): Promise<StoredCred[]> {
  if (typeof window === 'undefined') return [];
  try { return await listCreds(); } catch { return []; }
}

export async function hasPasskey(): Promise<boolean> {
  return (await listPasskeys()).length > 0;
}

export async function registerPasskey(userName: string): Promise<StoredCred> {
  if (typeof window === 'undefined' || !('PublicKeyCredential' in window)) {
    throw new Error('WebAuthn is not supported in this browser.');
  }
  const userId = rand(16);
  const cred = (await navigator.credentials.create({
    publicKey: {
      challenge: rand(32),
      rp: { name: 'Costco India GCC' },
      user: { id: userId, name: userName, displayName: userName },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
      authenticatorSelection: { userVerification: 'preferred', residentKey: 'preferred' },
      timeout: 60_000,
      attestation: 'none',
    },
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error('Passkey registration cancelled.');

  const transports = (cred.response as AuthenticatorAttestationResponse).getTransports?.() as AuthenticatorTransport[] | undefined;
  const stored: StoredCred = {
    id: b64u(cred.rawId),
    userHandle: b64u(userId),
    userName,
    createdAt: new Date().toISOString(),
    transports,
  };
  await putCred(stored);
  return stored;
}

export async function loginWithPasskey(): Promise<{ ok: boolean; credentialId?: string }> {
  if (typeof window === 'undefined' || !('PublicKeyCredential' in window)) {
    throw new Error('WebAuthn is not supported in this browser.');
  }
  const stored = await listPasskeys();
  const allow: PublicKeyCredentialDescriptor[] | undefined = stored.length
    ? stored.map((c) => ({
        id: fromB64u(c.id),
        type: 'public-key',
        transports: (c.transports ?? ['internal', 'hybrid', 'usb', 'nfc', 'ble']) as AuthenticatorTransport[],
      }))
    : undefined;

  const assertion = (await navigator.credentials.get({
    publicKey: {
      challenge: rand(32),
      timeout: 60_000,
      userVerification: 'preferred',
      allowCredentials: allow,
    },
  })) as PublicKeyCredential | null;

  if (!assertion) return { ok: false };
  return { ok: true, credentialId: b64u(assertion.rawId) };
}

export async function forgetPasskeys() {
  try { await clearCreds(); } catch {}
}
