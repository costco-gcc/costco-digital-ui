import type { Metadata, Viewport } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import Chatbot from '@/components/Chatbot';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeBootstrap from '@/components/ThemeBootstrap';
import ScrollProgress from '@/components/ScrollProgress';
import BackToTop from '@/components/BackToTop';
import StructuredData from '@/components/StructuredData';
import ContentSecurityPolicy from '@/components/ContentSecurityPolicy';
import GateScript from '@/components/GateScript';
import MotionProvider from '@/components/MotionProvider';

export const metadata: Metadata = {
  // Resolves relative URLs in OG/Twitter cards to the canonical host.
  metadataBase: new URL('https://www.costcodigital.com'),
  title: {
    default: 'Costco Wholesale India — Global Capability Center',
    template: '%s · Costco India GCC',
  },
  description:
    'Costco Wholesale India Private Limited Global Capability Center — uniting People, Technology, and Process to power Costco worldwide from Hyderabad.',
  applicationName: 'Costco India GCC',
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
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Costco Wholesale India — Global Capability Center',
    description:
      'People · Technology · Process — Powering Costco worldwide, from Hyderabad.',
    siteName: 'Costco India GCC',
    url: '/',
    type: 'website',
    locale: 'en_IN',
    images: [
      // PNG first — Facebook/LinkedIn/Slack/Discord prefer it; X/Twitter
      // doesn't render SVG cards. SVG kept as a secondary entry for
      // crawlers that pick the higher-fidelity vector.
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Powering Costco worldwide, from Hyderabad.',
        type: 'image/png',
      },
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Powering Costco worldwide, from Hyderabad.',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Costco Wholesale India — Global Capability Center',
    description:
      'People · Technology · Process — Powering Costco worldwide, from Hyderabad.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/logo-globe.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/logo-globe.png',
    apple: '/logo-globe.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#06080F' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CSP must be the first <meta> so the policy applies to subsequently
            parsed inline scripts (including ThemeBootstrap below). */}
        <ContentSecurityPolicy />
        {/* GateScript runs before any other inline script so visitors who
            haven't unlocked never see a flash of GCC content — the redirect
            fires while <html> is still styled `visibility: hidden`. */}
        <GateScript />
        <ThemeBootstrap />
        <StructuredData />
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
        <MotionProvider>
          <ScrollProgress />
          <Navbar />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
          <BackToTop />
          <Chatbot />
          <CookieConsent />
        </MotionProvider>
      </body>
    </html>
  );
}
