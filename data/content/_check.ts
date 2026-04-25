// Compile-time contract enforcement. Each JSON import is pinned to its
// declared interface in types.ts via a `satisfies` assertion. If a JSON
// file drifts from the documented shape (renamed key, missing required
// field, wrong literal type), `tsc --noEmit` fails — and so does CI.
//
// This file is never imported anywhere; it exists purely so the type
// checker visits it. The `void` references silence "declared but never
// used" warnings without producing runtime work.

import about from './about.json';
import awards from './awards.json';
import capabilities from './capabilities.json';
import careersFaq from './careers-faq.json';
import careers from './careers.json';
import contact from './contact.json';
import cookieConsent from './cookie-consent.json';
import culture from './culture.json';
import esg from './esg.json';
import footer from './footer.json';
import gallery from './gallery.json';
import hero from './hero.json';
import leadership from './leadership.json';
import locations from './locations.json';
import manifesto from './manifesto.json';
import navbar from './navbar.json';
import news from './news.json';
import stats from './stats.json';

import type {
  AboutContent, AwardsContent, CapabilitiesContent, CareersContent,
  CareersFaqContent, ContactContent, CookieConsentContent, CultureContent,
  EsgContent, FooterContent, GalleryContent, HeroContent, LeadershipContent,
  LocationsContent, ManifestoContent, NavbarContent, NewsContent, StatsContent,
} from './types';

void (hero satisfies HeroContent);
void (stats satisfies StatsContent);
void (about satisfies AboutContent);
void (capabilities satisfies CapabilitiesContent);
void (manifesto satisfies ManifestoContent);
void (locations satisfies LocationsContent);
void (culture satisfies CultureContent);
void (gallery satisfies GalleryContent);
void (leadership satisfies LeadershipContent);
void (awards satisfies AwardsContent);
void (careers satisfies CareersContent);
void (careersFaq satisfies CareersFaqContent);
void (news satisfies NewsContent);
void (esg satisfies EsgContent);
void (contact satisfies ContactContent);
void (navbar satisfies NavbarContent);
void (footer satisfies FooterContent);
void (cookieConsent satisfies CookieConsentContent);
