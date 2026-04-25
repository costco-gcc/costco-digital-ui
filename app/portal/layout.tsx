import type { Metadata } from 'next';

// Defense-in-depth: portal is also disallowed in /robots.txt and excluded
// from /sitemap.xml. The robots metadata here protects in case the page
// is linked from elsewhere or robots.txt is overridden by a CDN.
export const metadata: Metadata = {
  title: 'Employee portal',
  description: 'Passkey access for Costco India GCC. UI-only preview.',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/portal/' },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
