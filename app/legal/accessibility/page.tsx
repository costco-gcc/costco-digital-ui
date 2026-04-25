import LegalShell from '@/components/LegalShell';

export const metadata = { title: 'Accessibility — Costco India GCC' };

export default function Page() {
  return (
    <LegalShell title="Accessibility statement" updated="April 2026">
      <p>
        We are committed to making this site usable by everyone. We target WCAG 2.2 Level AA and follow inclusive
        design principles across content, contrast, focus order, and keyboard support.
      </p>

      <h2 className="text-lg font-semibold mt-6">What we do</h2>
      <ul className="list-disc pl-6">
        <li>Semantic HTML, landmarks, and skip-to-main link.</li>
        <li>Visible focus, sufficient contrast, scalable text.</li>
        <li>Reduced motion respected via prefers-reduced-motion.</li>
        <li>Forms with labels, error states, and consent before submission.</li>
        <li>Static export with no required JavaScript for content.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">Found an issue?</h2>
      <p>
        Email <a className="underline" href="mailto:accessibility.india@costco.com">accessibility.india@costco.com</a>.
        We'll respond within a reasonable timeframe and remediate as quickly as possible.
      </p>
    </LegalShell>
  );
}
