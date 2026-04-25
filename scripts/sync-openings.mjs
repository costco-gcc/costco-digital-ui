#!/usr/bin/env node
// Sync the live Costco openings from Talent500 into public/openings.json.
//
// Talent500 exposes a public JSON API for company job listings:
//   GET https://prod-warmachine.talent500.co/api/v3/jobs/search/?company_slug=costco&offset=0&size=N
// It requires a browser-like Origin/Referer pair but no auth token.
//
// Run:    npm run sync:openings
// CI:     .github/workflows/sync-openings.yml runs this daily and commits diffs.
//
// On any failure (network, schema change, zero rows) we exit non-zero and leave
// the existing public/openings.json untouched, so we never publish an empty list.

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outFile = resolve(root, 'public', 'openings.json');

const API = 'https://prod-warmachine.talent500.co/api/v3/jobs/search/';
const COMPANY_SLUG = 'costco';
const PAGE_BASE = 'https://talent500.com/jobs/costco/';
const PAGE_SIZE = 100;

const CATEGORY_RULES = [
  [/(security|cyber|infosec|appsec|grc)/i, 'Security'],
  [/(data engineer|data engineering|lakehouse|warehouse engineer|etl|spark|kafka|big.?query|snowflake)/i, 'Data'],
  [/(data analyst|business intelligence|\bbi\b|analytics)/i, 'Data'],
  [/(\bml\b|\bai\b|machine learning|gen.?ai|llm|nlp|computer vision)/i, 'AI'],
  [/(platform|sre|reliability|devops|cloud|kubernetes|aws|gcp|azure)/i, 'Cloud'],
  [/(quality|qa engineer|automation engineer|test engineer)/i, 'Quality'],
  [/(designer|design|ux|ui|user research)/i, 'Design'],
  [/(product owner|product manager|program manager|scrum master)/i, 'Product'],
  [/(finance|accounting|fp&a|tax|audit)/i, 'Finance'],
  [/(operations|merchandis|supply|logistics|inventory|process)/i, 'Operations'],
  [/(martech|adtech|marketing tech)/i, 'MarTech'],
  [/(engineer|developer|sde|software|frontend|front.?end|backend|back.?end|full.?stack|mobile|.net|c#|java|python|node|react)/i, 'Engineering'],
];

function inferCategory(title = '') {
  for (const [re, cat] of CATEGORY_RULES) if (re.test(title)) return cat;
  return 'Engineering';
}

function fmtExperience(min, max) {
  const a = Number.isFinite(min) ? min : null;
  const b = Number.isFinite(max) ? max : null;
  if (a == null && b == null) return undefined;
  if (a != null && b != null && a !== b) return `${a} - ${b} years`;
  if (a != null) return `${a}+ years`;
  return `${b} years`;
}

function fmtType(t) {
  if (!t) return 'Full-time';
  // API returns "Full-Time" — normalize a touch for our UI.
  return String(t).replace(/-/g, '-').replace(/full-?time/i, 'Full-time').replace(/part-?time/i, 'Part-time').replace(/intern(ship)?/i, 'Internship');
}

async function fetchJobs() {
  const url = `${API}?company_slug=${encodeURIComponent(COMPANY_SLUG)}&offset=0&size=${PAGE_SIZE}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Origin: 'https://talent500.com',
      Referer: PAGE_BASE,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
  });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  const body = await res.json();
  if (!body || !Array.isArray(body.data)) throw new Error('unexpected schema');
  return { total: body.total ?? body.data.length, rows: body.data };
}

function mapRow(row) {
  const slug = String(row.slug || '').trim();
  if (!slug) return null;
  const url = `${PAGE_BASE}${slug}/`;
  const title = String(row.title || row.title_alias_1 || 'Costco India GCC role').trim();
  const location = String(row.location || 'Hyderabad').trim();
  const type = fmtType(row.employment_type);
  const experience = fmtExperience(row.min_experience_years, row.max_experience_years);
  const skills = Array.isArray(row.primary_skills) ? row.primary_skills.filter(Boolean).slice(0, 5) : [];
  const jobCode = row.job_code ? String(row.job_code) : undefined;
  return {
    title,
    location,
    type,
    category: inferCategory(title),
    experience,
    skills,
    jobCode,
    url,
  };
}

async function main() {
  console.log(`→ fetching ${API}?company_slug=${COMPANY_SLUG}&size=${PAGE_SIZE}`);
  const { total, rows } = await fetchJobs();
  console.log(`→ API reported total=${total}, returned ${rows.length} rows`);

  const openings = rows.map(mapRow).filter(Boolean);
  if (!openings.length) {
    console.error('! no openings parsed — leaving existing file untouched');
    process.exit(2);
  }

  // Stable sort: category asc, then title asc → clean diffs across runs.
  openings.sort((a, b) => (a.category + '|' + a.title).localeCompare(b.category + '|' + b.title));

  const payload = {
    verifiedAt: new Date().toISOString().slice(0, 10),
    source: PAGE_BASE,
    api: API,
    totalReportedByApi: total,
    openings,
  };

  if (!existsSync(dirname(outFile))) await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  console.log(`✓ wrote ${outFile} (${openings.length} role${openings.length === 1 ? '' : 's'})`);
}

main().catch((err) => {
  console.error('! sync failed:', err?.stack || err?.message || err);
  process.exit(1);
});
