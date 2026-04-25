import LegalShell from '@/components/LegalShell';

export const metadata = { title: 'Whistleblower & ethics reporting', description: 'How to raise an ethics concern at Costco India GCC — channels, confidentiality, non-retaliation.' };

export default function Page() {
  return (
    <LegalShell title="Whistleblower & ethics reporting" updated="April 2026">
      <p>
        Costco's reputation rests on doing the right thing. If you suspect fraud, harassment, conflict of interest,
        bribery, retaliation, data misuse, or any breach of our Code of Ethics, please report it.
      </p>

      <h2 className="text-lg font-semibold mt-6">Channels</h2>
      <ul className="list-disc pl-6">
        <li>Email the India ethics inbox: <a className="underline" href="mailto:ethics.india@costco.com">ethics.india@costco.com</a></li>
        <li>Speak to your manager, HR Business Partner, or the local Compliance / Vigilance Officer.</li>
        <li>Costco employees worldwide may also use the global ethics channels listed in the Costco Code of Ethics.</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">Confidentiality and non-retaliation</h2>
      <p>
        Reports may be made anonymously where permitted by law. Costco does not tolerate retaliation against any person
        who reports in good faith. Investigations are handled with confidentiality and due process.
      </p>
    </LegalShell>
  );
}
