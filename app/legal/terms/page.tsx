import LegalShell from '@/components/LegalShell';

export const metadata = { title: 'Terms of use', description: 'Terms governing use of the Costco India GCC website.' };

export default function Page() {
  return (
    <LegalShell title="Terms of use" updated="April 2026">
      <p>
        Welcome to the Costco Wholesale India Private Limited GCC website. By using this site you agree to these terms.
      </p>

      <h2 className="text-lg font-semibold mt-6">Permitted use</h2>
      <p>
        This site is provided for informational purposes only. You may browse and share links to public content,
        provided you do not misrepresent affiliation with Costco.
      </p>

      <h2 className="text-lg font-semibold mt-6">Intellectual property</h2>
      <p>
        Costco names, logos, and trademarks are property of Costco Wholesale Corporation. Site design, code,
        and content are protected by applicable IP laws.
      </p>

      <h2 className="text-lg font-semibold mt-6">No warranties</h2>
      <p>
        Content is provided "as is". To the maximum extent permitted by law, we disclaim warranties of merchantability,
        fitness for a particular purpose, and non-infringement.
      </p>

      <h2 className="text-lg font-semibold mt-6">Liability</h2>
      <p>
        We are not liable for indirect, incidental, or consequential damages arising from use of this site,
        to the extent permitted by law.
      </p>

      <h2 className="text-lg font-semibold mt-6">Governing law</h2>
      <p>These terms are governed by the laws of India.</p>
    </LegalShell>
  );
}
