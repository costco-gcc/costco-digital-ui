import type { Metadata } from 'next';
import LegalShell from '@/components/LegalShell';

export const metadata: Metadata = {
  title: 'Privacy notice',
  description: 'How Costco Wholesale India Private Limited handles personal data on this site, in line with GDPR and India\'s DPDP Act, 2023.',
  alternates: { canonical: '/legal/privacy/' },
  openGraph: { url: '/legal/privacy/', title: 'Privacy notice · Costco India GCC' },
};

export default function Page() {
  return (
    <LegalShell title="Privacy notice" updated="April 2026">
      <p>
        This privacy notice explains how Costco Wholesale India Private Limited ("we", "us", "Costco India GCC")
        handles personal data collected through this website. It is aligned with the EU General Data Protection
        Regulation (GDPR) and India's Digital Personal Data Protection Act, 2023 (DPDP).
      </p>

      <h2 className="text-lg font-semibold mt-6">1. Data we collect</h2>
      <p>This site is a static informational presence. We may collect:</p>
      <ul className="list-disc pl-6">
        <li>Information you submit through the contact form (name, email, message, topic).</li>
        <li>Cookie consent preferences stored locally on your device.</li>
        <li>Basic technical telemetry only if you opt-in to analytics cookies.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">2. Why we process it</h2>
      <ul className="list-disc pl-6">
        <li>To respond to your inquiries (legitimate interest / consent).</li>
        <li>To remember your preferences (consent).</li>
        <li>To improve site quality, where analytics is enabled (consent).</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">3. Sharing</h2>
      <p>
        We do not sell personal data. Career applications are processed via our trusted partner Talent500 (talent500.com)
        — see their privacy policy for processing details when you apply.
      </p>

      <h2 className="text-lg font-semibold mt-6">4. Retention</h2>
      <p>We retain inquiry data only as long as needed to respond, and consent records for the consent's lifetime.</p>

      <h2 className="text-lg font-semibold mt-6">5. Your rights</h2>
      <p>
        Subject to applicable law, you can request access, correction, deletion, restriction, portability, or objection.
        EU/UK users may lodge complaints with their supervisory authority. Indian Data Principals may approach the
        Data Protection Board of India.
      </p>

      <h2 className="text-lg font-semibold mt-6">6. Contact</h2>
      <p>
        Reach our Privacy / Data Protection function at{' '}
        <a className="underline" href="mailto:privacy.india@costco.com">privacy.india@costco.com</a>.
      </p>
    </LegalShell>
  );
}
