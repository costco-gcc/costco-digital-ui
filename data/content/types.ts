// Explicit content schemas for data/content/*.json. These act as a contract
// between the JSON files and the React components that consume them — when a
// JSON file drifts (key renamed, field made optional, etc.), the assertions in
// _check.ts fail to compile and the build breaks.
//
// Keep these in sync with the JSON. Adding optional fields is safe; renaming
// or removing requires updating both the JSON and any consumer.

export interface Cta {
  label: string;
  href: string;
  external?: boolean;
}

export interface IconLabel {
  icon: string;
  label: string;
}

export interface IconKV {
  icon: string;
  title: string;
  body: string;
}

export interface KV {
  k: string;
  v: string;
}

// ── hero.json ──────────────────────────────────────────────────────────────
export interface HeroPillar {
  icon: string;
  label: string;
  desc: string;
  color: string;
}

export interface HeroContent {
  eyebrow: string;
  headlinePrefix: string;
  headlineAccent: string;
  introLead: string;
  introHighlights: string[];
  introTail: string;
  introJoinerA: string;
  introJoinerB: string;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  /** Legacy three-pillar mini-cards. Retained for back-compat; no longer rendered. */
  pillars?: HeroPillar[];
  orbital: { labels: string[] };
}

// ── stats.json ─────────────────────────────────────────────────────────────
export interface StatsContent {
  ariaLabel: string;
  kicker: string;
  items: { k: string; label: string; sub: string }[];
}

// ── about.json ─────────────────────────────────────────────────────────────
export interface AboutContent {
  eyebrow: string;
  title: string;
  description: string;
  principles: KV[];
  fifthPrinciple: KV;
  panel: {
    title: string;
    body: string;
    bullets: KV[];
    facts: KV[];
  };
}

// ── capabilities.json ──────────────────────────────────────────────────────
export interface CapabilityPillar {
  title: string;
  swatch: string;
  icon: string;
  blurb: string;
  capabilities: IconLabel[];
}

export interface CapabilitiesContent {
  eyebrow: string;
  title: string;
  description: string;
  pillars: CapabilityPillar[];
}

// ── manifesto.json ─────────────────────────────────────────────────────────
export interface ManifestoContent {
  kicker: string;
  lead: string;
  principles: { n: string; verb: string; rest: string; note: string }[];
  footer: string;
}

// ── locations.json ─────────────────────────────────────────────────────────
export interface LocationsContent {
  eyebrow: string;
  title: string;
  description: string;
  tagCity: string;
  tagBadge: string;
  officeName: string;
  officeCityLine: string;
  officeBlurb: string;
  features: IconKV[];
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  amenities: { heading: string; items: { icon: string; label: string; body: string }[] };
}

// ── culture.json ───────────────────────────────────────────────────────────
export interface CultureContent {
  eyebrow: string;
  title: string;
  description: string;
  pillars: IconKV[];
}

// ── gallery.json ───────────────────────────────────────────────────────────
export interface GalleryContent {
  eyebrow: string;
  title: string;
  description: string;
  scenes: { key: string; label: string; caption: string }[];
  footnote: string;
}

// ── leadership.json ────────────────────────────────────────────────────────
export interface LeadershipMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  tag: string;
  openSeat: boolean;
}

export interface LeadershipContent {
  eyebrow: string;
  title: string;
  description: string;
  team: LeadershipMember[];
}

// ── awards.json ────────────────────────────────────────────────────────────
export interface AwardsContent {
  ariaLabel: string;
  items: { icon: string; title: string; sub: string }[];
}

// ── careers.json ───────────────────────────────────────────────────────────
export interface CareersContent {
  eyebrow: string;
  titleTemplate: string;
  description: string;
  viewAllCta: string;
  filterAll: string;
  emptyState: { title: string; subtitle: string; cta: string };
  ctaCard: { title: string; body: string; cta: string };
  verifiedPrefix: string;
  refreshLabel: string;
}

// ── careers-faq.json ───────────────────────────────────────────────────────
export interface CareersFaqContent {
  eyebrow: string;
  title: string;
  description: string;
  items: { q: string; a: string }[];
}

// ── news.json ──────────────────────────────────────────────────────────────
export interface NewsItem {
  icon: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  credit?: string;
}

export interface NewsContent {
  eyebrow: string;
  title: string;
  description: string;
  items: NewsItem[];
}

// ── esg.json ───────────────────────────────────────────────────────────────
export interface EsgContent {
  eyebrow: string;
  title: string;
  description: string;
  goals: IconKV[];
  pillars: IconKV[];
}

// ── contact.json ───────────────────────────────────────────────────────────
export interface ContactContent {
  eyebrow: string;
  title: string;
  description: string;
  address: { name: string; cityLine: string };
  email: string;
  company: string;
  whistleblowerLabel: string;
  whistleblowerCta: string;
  whistleblowerHref: string;
  talent500Cta: string;
  talent500Href: string;
  form: {
    srHelp: string;
    nameLabel: string;
    emailLabel: string;
    topicLabel: string;
    messageLabel: string;
    topics: string[];
    consent: { lead: string; linkText: string; linkHref: string; tail: string };
    submitLabel: string;
    submitHelp: string;
    successMessage: string;
    errors: {
      name: string;
      emailRequired: string;
      emailInvalid: string;
      message: string;
      consent: string;
    };
  };
}

// ── navbar.json ────────────────────────────────────────────────────────────
export interface NavbarContent {
  ariaLabel: string;
  homeAriaLabel: string;
  links: Cta[];
  ctaLabel: string;
  ctaHref: string;
}

// ── footer.json ────────────────────────────────────────────────────────────
export interface FooterContent {
  manifesto: string;
  brandStatement: string;
  columns: { heading: string; links: Cta[] }[];
  visit: {
    heading: string;
    name: string;
    cityLine: string;
    mapsLabel: string;
    mapsHref: string;
  };
  now: {
    heading: string;
    timezoneAbbrev: string;
    ianaTimeZone: string;
    statusLabel: string;
  };
  legal: { heading: string; links: Cta[] };
  backdropWord: string;
  copyrightTemplate: string;
  tagline: string;
}

// ── cookie-consent.json ────────────────────────────────────────────────────
export interface CookieConsentContent {
  shieldAriaLabel: string;
  banner: {
    title: string;
    body: string;
    policyLink: Cta;
    privacyLink: Cta;
    acceptAll: string;
    rejectAll: string;
    preferences: string;
    dismissAriaLabel: string;
  };
  preferences: {
    title: string;
    intro: string;
    rows: { title: string; desc: string; key: string }[];
    cancel: string;
    save: string;
  };
}
