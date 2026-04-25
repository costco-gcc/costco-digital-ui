import LegalShell from '@/components/LegalShell';

export const metadata = { title: 'Whistleblower — Costco India GCC' };

export default function Page() {
  return (
    <LegalShell title="Whistleblower &amp; ethics reporting" updated="April 2026">
      <p>
        Costco's reputation rests on doing the right thing. If you suspect fraud, harassment, conflict of interest,
        bribery, retaliation, data misuse, or any breach of our Code of Ethics, please report it.
      </p>

      <h2 className="text-lg font-semibold mt-6">Channels</h2>
      <ul className="list-disc pl-6">
        <li>Independent ethics hotline (24×7) — placeholder for the official link.</li>
        <li>Local Indian compliance / vigilance officer — placeholder.</li>
        <li>Email: <a className="underline" href="mailto:ethics.india@costco.example">ethics.india@costco.example</a></li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">Confidentiality and non-retaliation</h2>
      <p>
        Reports may be made anonymously where permitted by law. Costco does not tolerate retaliation against any person
        who reports in good faith. Investigations are handled with confidentiality and due process.
      </p>

      <p className="text-xs text-[color:var(--muted)] mt-8">
        Replace placeholders with the official internal hotline links and the local ombudsperson before publication.
      </p>
    </LegalShell>
  );
}
