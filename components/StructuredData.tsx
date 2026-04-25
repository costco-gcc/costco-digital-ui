// Schema.org JSON-LD for SEO. Renders Organization + WebSite graphs that
// search engines (and AI assistants) parse to understand who we are and
// how to surface us in rich results — sitelinks, knowledge panels, etc.
//
// Single inline <script type="application/ld+json"> per page; values are
// static, so the payload is computed once at build time.

const SITE_URL = 'https://www.costcodigital.com';

const data = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Costco Wholesale India Private Limited',
      alternateName: ['Costco India GCC', 'Costco Wholesale India GCC'],
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-globe.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/og-image.png`,
      description:
        'Global Capability Center for Costco Wholesale, uniting People, Technology, and Process to power Costco worldwide from Hyderabad.',
      foundingDate: '2025',
      parentOrganization: {
        '@type': 'Organization',
        name: 'Costco Wholesale Corporation',
        url: 'https://www.costco.com',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Capitaland, Madhapur',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        addressCountry: 'IN',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          email: 'india.gcc@costco.com',
          contactType: 'customer support',
          areaServed: 'IN',
          availableLanguage: ['en'],
        },
      ],
      sameAs: ['https://www.costco.com'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Costco India GCC',
      description: 'Costco Wholesale India — Global Capability Center.',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-IN',
    },
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
