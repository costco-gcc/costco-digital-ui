import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';

export const metadata: Metadata = {
  title: 'Cookie policy',
  description: 'How the Costco India GCC website uses cookies and how to control them.',
  alternates: { canonical: '/legal/cookies/' },
  openGraph: { url: '/legal/cookies/', title: 'Cookie policy · Costco India GCC' },
};

export default function Page() {
  return (
    <LegalShell title="Cookie policy" updated="April 2026">
      <p>
        We use a small number of cookies and similar storage to make this site work and, with your consent, to improve it.
        Strictly necessary storage is on by default — everything else is opt-in.
      </p>

      <h2 className="text-lg font-semibold mt-6">Categories</h2>
      <ul className="list-disc pl-6">
        <li><strong>Strictly necessary</strong> — for core functionality (e.g. saving your consent choice, theme).</li>
        <li><strong>Preferences</strong> — remember your interface choices.</li>
        <li><strong>Analytics</strong> — privacy-respecting usage statistics. Loaded only with consent.</li>
        <li><strong>Marketing</strong> — for relevant communications. Off by default.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">Manage your choices</h2>
      <p>
        Use the shield icon in the bottom-left corner of any page, or click "Cookie preferences" below the consent
        banner. You can change your settings at any time, and they are stored only on your device.
      </p>

      <h2 className="text-lg font-semibold mt-6">Third-party services</h2>
      <p>
        This static site does not load third-party scripts unless you explicitly opt in to a category that requires them.
        Career applications are processed on talent500.com, whose cookies are governed by their own policy.
      </p>
    </LegalShell>
  );
}
