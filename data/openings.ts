// Real, verified Costco openings on Talent500.
// Each entry MUST point to the canonical Talent500 job URL:
//   https://talent500.com/jobs/costco/<slug>-T500-<id>/
//
// To refresh: `npm run sync:openings` writes public/openings.json from the
// Talent500 public API. The Careers section reads that JSON at runtime —
// no redeploy needed when the file changes. The seed array below is only the
// fallback for the brief moment before openings.json is fetched.

export type Opening = {
  /** Canonical Talent500 job URL — the link users click to view/apply. */
  url: string;
  /** Exact job title as posted. */
  title: string;
  /** City. Costco GCC India is single-site: "Hyderabad". */
  location: string;
  /** "Full-time" | "Contract" | "Internship" — leave blank if not specified. */
  type?: string;
  /** High-level area shown as a tag (Engineering, Data, AI, Security, Cloud, …). */
  category: string;
  /** Years of experience as published (e.g. "4 - 6 years"). */
  experience?: string;
  /** Up to 5 primary skill tags from Talent500. */
  skills?: string[];
  /** Talent500 job code, e.g. "T500-21471". */
  jobCode?: string;
};

/** Talent500 company page — always the source of truth for the full, current list. */
export const TALENT500_COMPANY_URL = 'https://talent500.com/jobs/costco/';

/**
 * Tiny seed used only while public/openings.json is being fetched on first paint.
 * Keep this small. The sync script in scripts/sync-openings.mjs writes the
 * authoritative list of all 30+ roles into public/openings.json.
 */
export const openings: Opening[] = [
  {
    title: 'Software Engineer 2a, International eCommerce',
    location: 'Hyderabad',
    type: 'Full-time',
    category: 'Engineering',
    experience: '4 - 6 years',
    skills: ['Hybris', 'SAP Commerce', 'Git', 'AGILE', 'SQL'],
    jobCode: 'T500-21471',
    url: 'https://talent500.com/jobs/costco/software-engineer-2a-international-ecommerce-hyderabad-T500-21471/',
  },
];

export const seedVerifiedAt = '2026-04-25';

/**
 * Load openings from /openings.json (written by `npm run sync:openings`).
 * Returns the seed list as a fallback if the JSON is missing or malformed.
 */
export async function loadOpenings(basePath = ''): Promise<{ items: Opening[]; verifiedAt: string; total?: number }> {
  try {
    const res = await fetch(`${basePath}/openings.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error('no override');
    const body = await res.json();
    const items: Opening[] = Array.isArray(body) ? body : Array.isArray(body?.openings) ? body.openings : [];
    const verifiedAt: string = (Array.isArray(body) ? '' : body?.verifiedAt) || seedVerifiedAt;
    const total: number | undefined = Array.isArray(body) ? items.length : body?.totalReportedByApi ?? items.length;
    if (!items.length) throw new Error('empty');
    return { items, verifiedAt, total };
  } catch {
    return { items: openings, verifiedAt: seedVerifiedAt, total: openings.length };
  }
}
