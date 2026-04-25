import type { Metadata, Viewport } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import Chatbot from '@/components/Chatbot';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeBootstrap from '@/components/ThemeBootstrap';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';

export const metadata: Metadata = {
  title: 'Costco Wholesale India — Global Capability Center',
  description:
    'Costco Wholesale India Private Limited Global Capability Center — uniting People, Technology, and Process to power Costco worldwide from Hyderabad.',
  keywords: [
    'Costco India',
    'Costco GCC',
    'Costco Wholesale India Private Limited',
    'Global Capability Center',
    'Hyderabad',
    'Madhapur',
    'Capitaland',
    'Careers',
    'Technology',
  ],
  authors: [{ name: 'Costco Wholesale India Private Limited' }],
  openGraph: {
    title: 'Costco Wholesale India — Global Capability Center',
    description: 'People · Technology · Process — Powering Costco from India.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F2' },
    { media: '(prefers-color-scheme: dark)', color: '#06080F' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeBootstrap />
        {/* Cooper Black-alike for the Costco wordmark. `display=swap` keeps the
            site usable while it loads; the font stack falls back to system
            slab/serifs that render close enough to avoid layout shift. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sansita:ital,wght@1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <ScrollProgress />
        <Navbar />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <BackToTop />
        <Chatbot />
        <CookieConsent />
      </body>
    </html>
  );
}
