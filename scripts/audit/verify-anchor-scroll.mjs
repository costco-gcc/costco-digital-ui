import { chromium } from 'playwright';

const BASE = 'http://localhost:3001';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  localStorage.setItem('costco-gcc-consent', JSON.stringify({
    necessary: true, preferences: false, analytics: false, marketing: false,
    decidedAt: new Date().toISOString(), version: 1,
  }));
});
await page.goto(BASE + '/', { waitUntil: 'networkidle' });

const anchors = ['#about', '#capabilities', '#locations', '#culture', '#careers', '#news', '#contact'];

for (const a of anchors) {
  // Use real hash navigation — honors scroll-padding-top.
  await page.evaluate((href) => {
    location.hash = '';   // reset so re-clicking same anchor re-scrolls
    location.hash = href;
  }, a);
  await page.waitForTimeout(700);
  const result = await page.evaluate((href) => {
    const el = document.querySelector(href);
    if (!el) return null;
    return Math.round(el.getBoundingClientRect().top);
  }, a);
  // navbar height 64px; scroll-padding-top 80px; section top should be ≥ 64 (preferably ~80)
  const ok = result >= 64;
  console.log(`${a}: top=${result}px ${ok ? 'OK' : 'BELOW NAVBAR'}`);
}

await browser.close();
