import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = 'http://localhost:3001';
const OUT = '/tmp/mobile-shots';
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'iphone-se',  width: 320, height: 568 }, // smallest mainstream
  { name: 'iphone-12',  width: 390, height: 844 },
  { name: 'iphone-pro', width: 414, height: 896 },
  { name: 'tablet',     width: 768, height: 1024 },
];

const SECTIONS = [
  { name: '01-hero',          selector: 'section:has(h1)' },
  { name: '02-stats',         selector: 'section[aria-label="At a glance"]' },
  { name: '03-about',         selector: '#about' },
  { name: '04-capabilities',  selector: '#capabilities' },
  { name: '05-manifesto',     selector: 'section[aria-label="Operating standard"]' },
  { name: '06-locations',     selector: '#locations' },
  { name: '07-culture',       selector: '#culture' },
  { name: '08-gallery',       selector: '#gallery' },
  { name: '09-leadership',    selector: '#leadership' },
  { name: '10-awards',        selector: 'section[aria-label="Awards and recognition"]' },
  { name: '11-careers',       selector: '#careers' },
  { name: '12-careers-faq',   selector: '#careers-faq' },
  { name: '13-news',          selector: '#news' },
  { name: '14-esg',           selector: '#esg' },
  { name: '15-contact',       selector: '#contact' },
  { name: '16-footer',        selector: 'footer' },
];

const browser = await chromium.launch();

const issues = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  page.on('pageerror', (e) => issues.push(`[${vp.name}] pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') issues.push(`[${vp.name}] console.error: ${m.text()}`);
  });

  // Navigate once to establish the origin, set the consent flag, then
  // reload so the consent banner never appears.
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('costco-gcc-consent', JSON.stringify({
      necessary: true, preferences: false, analytics: false, marketing: false,
      decidedAt: new Date().toISOString(),
      version: 1,
    }));
  });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // Detect horizontal scroll on the document
  const scrollX = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    bodyW: document.body.scrollWidth,
  }));
  if (scrollX.docW > scrollX.winW + 1) {
    issues.push(`[${vp.name}] HORIZONTAL OVERFLOW: doc=${scrollX.docW} > win=${scrollX.winW}`);
  }

  // Find any element wider than viewport
  const overflowers = await page.evaluate((winW) => {
    const offenders = [];
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > winW + 1 && rect.right > winW + 1) {
        const tag = el.tagName.toLowerCase();
        const cls = (el.className || '').toString().slice(0, 60);
        offenders.push(`<${tag} class="${cls}"> w=${Math.round(rect.width)} right=${Math.round(rect.right)}`);
      }
    });
    return offenders.slice(0, 8);
  }, vp.width);
  if (overflowers.length) {
    issues.push(`[${vp.name}] elements wider than viewport:\n  ` + overflowers.join('\n  '));
  }

  // Section-by-section screenshots
  for (const sec of SECTIONS) {
    try {
      const loc = page.locator(sec.selector).first();
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const path = `${OUT}/${vp.name}__${sec.name}.png`;
      await loc.screenshot({ path });
    } catch (e) {
      issues.push(`[${vp.name}] could not screenshot ${sec.name}: ${e.message}`);
    }
  }

  // Full-page screenshot too (capped for sanity)
  try {
    const fullPath = `${OUT}/${vp.name}__00-full.png`;
    await page.screenshot({ path: fullPath, fullPage: true });
  } catch (e) {
    issues.push(`[${vp.name}] full-page screenshot failed: ${e.message}`);
  }

  await ctx.close();
}

await browser.close();

if (issues.length) {
  console.log('\n--- ISSUES ---');
  issues.forEach((i) => console.log(i));
} else {
  console.log('No issues detected by static checks.');
}
console.log(`\nScreenshots written to ${OUT}/`);
