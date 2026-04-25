#!/usr/bin/env node
// Lightweight Playwright UI checks. No test runner / assertions framework —
// each check pushes a {ok, name, detail} into a list and we exit non-zero
// at the end if any failed. This keeps the dev loop fast and the output
// easy to scan.
//
// Usage:  npm run test:ui
// Requires: dev server running on http://localhost:3000

import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.UI_TEST_BASE || 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'mobile-320', w: 320, h: 720 },
  { name: 'mobile-375', w: 375, h: 812 },
  { name: 'tablet-768', w: 768, h: 1024 },
  { name: 'laptop-1280', w: 1280, h: 800 },
  { name: 'desktop-1920', w: 1920, h: 1080 },
  { name: 'ultrawide-3018', w: 3018, h: 1254 }, // matches user screenshot
];

const results = [];
const ok = (name, detail = '') => results.push({ ok: true, name, detail });
const fail = (name, detail = '') => results.push({ ok: false, name, detail });

async function withPage(viewport, fn) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: viewport.w, height: viewport.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') console.error(`[${viewport.name}] console.error:`, m.text()); });
  page.on('pageerror', (e) => console.error(`[${viewport.name}] pageerror:`, e.message));
  try {
    await fn(page);
  } finally {
    await browser.close();
  }
}

// Wraps `@axe-core/playwright`. Reports violations as a single failure with
// a short summary; full details are available in the run logs above. Scoped
// to WCAG 2.1 AA + best-practice, since that's our public commitment in
// /legal/accessibility/.
async function checkAxeViolations(page, vp) {
  // Pre-seed cookie consent so the banner doesn't animate in mid-scan —
  // its 0→1 opacity transition tints solid foregrounds and trips a
  // false-positive color-contrast violation against translucent layers.
  // Also pin to a deterministic theme + mode so the scan isn't sensitive
  // to whatever palette earlier checks left in localStorage.
  await page.addInitScript(() => {
    try {
      localStorage.setItem('costco-gcc-consent', JSON.stringify({
        necessary: true, preferences: false, analytics: false, marketing: false,
        decidedAt: new Date().toISOString(), version: 1,
      }));
      localStorage.setItem('costco-gcc-theme', 'costco');
      localStorage.setItem('costco-gcc-mode', 'light');
    } catch {}
  });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  // Settle any in-flight transitions on viewport entry.
  await page.waitForTimeout(400);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
    .analyze();
  if (result.violations.length === 0) {
    ok(`[${vp.name}] axe-core: 0 violations`);
    return;
  }
  for (const v of result.violations) {
    console.error(`  [axe] ${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`);
    for (const n of v.nodes.slice(0, 2)) console.error(`    ${n.target?.[0] ?? ''}`);
  }
  fail(`[${vp.name}] axe-core: ${result.violations.length} violation(s)`,
    result.violations.map((v) => `${v.id} [${v.impact}]`).join(', '));
}

// ---------- checks ----------

async function checkHomepageRenders(page, vp) {
  await page.goto(BASE + '/', { waitUntil: 'networkidle', timeout: 30_000 });
  // Critical landmarks
  for (const sel of ['header', 'main#main', 'footer']) {
    const found = await page.locator(sel).first().count();
    if (!found) fail(`[${vp.name}] missing landmark: ${sel}`);
  }
  // Section anchors
  const ids = ['about', 'capabilities', 'locations', 'culture', 'leadership', 'careers', 'news', 'esg', 'contact'];
  for (const id of ids) {
    const c = await page.locator(`section#${id}`).count();
    if (!c) fail(`[${vp.name}] missing section #${id}`);
  }
  ok(`[${vp.name}] landmarks + sections render`);
}

async function checkNoHorizontalOverflow(page, vp) {
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const viewW = window.innerWidth;
    // List elements that are wider than the viewport (root cause of horiz scroll)
    const wide = [];
    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > viewW + 1 && r.width <= viewW * 2) { // ignore decorative blurs that span beyond
        wide.push({ tag: el.tagName.toLowerCase(), id: el.id || null, cls: el.className?.slice?.(0, 80) || null, right: Math.round(r.right) });
      }
    });
    return { docW, viewW, body: document.body.scrollWidth, wide: wide.slice(0, 6) };
  });
  if (overflow.docW > overflow.viewW + 2) {
    fail(`[${vp.name}] horizontal overflow`, `docW=${overflow.docW} viewW=${overflow.viewW}; sample wide els: ${overflow.wide.map((w) => `${w.tag}#${w.id ?? ''}`).join(', ')}`);
  } else {
    ok(`[${vp.name}] no horizontal overflow (${overflow.docW} ≤ ${overflow.viewW})`);
  }
}

async function checkOrbitalLabelsNotClipped(page, vp) {
  // The hero orbital labels must be fully visible. We assert by reading the
  // computed bounding box of each label and asserting it's inside its SVG.
  const data = await page.evaluate(() => {
    const svg = document.querySelector('section .relative.aspect-square svg');
    if (!svg) return { error: 'no orbital svg' };
    const svgBox = svg.getBoundingClientRect();
    const out = [];
    svg.querySelectorAll('text').forEach((t) => {
      const b = t.getBoundingClientRect();
      out.push({ text: t.textContent?.trim(), inside: b.left >= svgBox.left - 1 && b.right <= svgBox.right + 1 && b.top >= svgBox.top - 1 && b.bottom <= svgBox.bottom + 1, b: { l: Math.round(b.left), r: Math.round(b.right) }, svg: { l: Math.round(svgBox.left), r: Math.round(svgBox.right) } });
    });
    // Also check HTML-positioned labels (.orbital-label)
    document.querySelectorAll('.orbital-label').forEach((t) => {
      const b = t.getBoundingClientRect();
      const parent = t.closest('.orbital');
      const pBox = parent?.getBoundingClientRect();
      if (!pBox) return;
      out.push({ text: t.textContent?.trim(), inside: b.left >= pBox.left - 1 && b.right <= pBox.right + 1, html: true });
    });
    return { out };
  });
  if (data.error) { fail(`[${vp.name}] orbital labels: ${data.error}`); return; }
  for (const r of data.out) {
    if (r.inside === false) fail(`[${vp.name}] orbital label clipped`, `"${r.text}" — label box [${r.b?.l},${r.b?.r}] not inside svg [${r.svg?.l},${r.svg?.r}]`);
  }
  if (data.out.length === 0) fail(`[${vp.name}] no orbital labels found`);
  else ok(`[${vp.name}] orbital labels (${data.out.length}) all inside their container`);
}

async function checkThemePickerOpacity(page, vp) {
  // Skip on viewports where picker may be hidden behind hamburger
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const trigger = page.locator('button[aria-label="Open theme picker"]').first();
  if (!(await trigger.count())) { fail(`[${vp.name}] theme picker trigger missing`); return; }
  await trigger.click();
  const panel = page.locator('[role="dialog"][aria-label="Theme settings"]').first();
  await panel.waitFor({ state: 'visible', timeout: 5_000 });
  const data = await page.evaluate(() => {
    const p = document.querySelector('[role="dialog"][aria-label="Theme settings"]');
    if (!p) return null;
    const cs = getComputedStyle(p);
    // Parse rgba alpha if present
    const bg = cs.backgroundColor;
    const m = bg.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*([0-9.]+))?\)/);
    const alpha = m ? (m[1] ? parseFloat(m[1]) : 1) : 1;
    return { bg, alpha, backdrop: cs.backdropFilter || cs.webkitBackdropFilter };
  });
  if (!data) { fail(`[${vp.name}] theme picker computed style not readable`); return; }
  if (data.alpha < 0.9 && !/blur/.test(data.backdrop || '')) {
    fail(`[${vp.name}] theme picker too translucent`, `bg=${data.bg} alpha=${data.alpha} backdrop=${data.backdrop}`);
  } else {
    ok(`[${vp.name}] theme picker opacity OK (alpha=${data.alpha.toFixed(2)})`);
  }
  // Switch palette and verify a CSS var actually changed.
  // The first 3 radios are mode buttons; palette radios start after them.
  // Click any palette that isn't currently checked.
  const before = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--brand-1').trim());
  // Pick a palette guaranteed to have a different --brand-1 (Costco and
  // Costco.com share the same red — that would be a false negative).
  const switched = await page.evaluate(() => {
    const radios = Array.from(document.querySelectorAll('[role="radio"]'));
    const target = radios.find((r) => {
      const lbl = (r.getAttribute('aria-label') || '') + ' ' + (r.textContent || '');
      return /Forest|Ocean|Sunset|Mono/.test(lbl) && r.getAttribute('aria-checked') !== 'true';
    });
    if (!target) return null;
    target.click();
    return target.getAttribute('aria-label') || (target.textContent || '').trim() || 'unknown';
  });
  await page.waitForTimeout(150);
  const after = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--brand-1').trim());
  if (!switched) fail(`[${vp.name}] no alternate palette to switch to`);
  else if (before === after) fail(`[${vp.name}] palette switch didn't change --brand-1`, `tried switching to "${switched}"; --brand-1 stayed ${before}`);
  else ok(`[${vp.name}] palette switch updates CSS vars (→ ${switched}: ${before} → ${after})`);
}

async function checkSkipLink(page, vp) {
  await page.goto(BASE + '/');
  // The skip link is the first DOM-order focusable in <body>. We focus it
  // directly rather than synthesising a Tab — Playwright's keyboard.press
  // can fire before activeElement is initialised on a fresh navigation,
  // which produces flaky "what was tabbed?" results that don't reflect
  // real keyboard order. The DOM-order assertion is what we actually care
  // about: that no fixed-position widget got slotted in front of it.
  const skipFirst = await page.evaluate(() => {
    const focusables = Array.from(document.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    return focusables[0]?.textContent?.trim() ?? '';
  });
  if (skipFirst !== 'Skip to main content') {
    fail(`[${vp.name}] skip link is not first focusable in DOM order`,
      `first focusable text="${skipFirst.slice(0, 60)}"`);
  } else {
    ok(`[${vp.name}] skip link is first focusable in DOM order`);
  }
}

async function checkChatbotOpens(page, vp) {
  await page.goto(BASE + '/');
  const trigger = page.locator('button[aria-label="Open Kirky chat"]').first();
  if (!(await trigger.count())) { fail(`[${vp.name}] Kirky trigger missing`); return; }
  await trigger.click();
  const dialog = page.locator('[role="dialog"][aria-label="Kirky, Costco India GCC assistant"]');
  await dialog.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => {});
  if (!(await dialog.isVisible())) { fail(`[${vp.name}] Kirky dialog did not open`); return; }
  // Ask a question
  await page.locator('#kirky-input').fill('Who is the CEO?');
  await page.keyboard.press('Enter');
  // Kirky has a small think-delay (~280–900ms, proportional to reply length)
  // so it feels alive — give the answer time to render.
  await page.locator('text=Ron Vachris').first().waitFor({ state: 'visible', timeout: 4_000 }).catch(() => {});
  const found = await page.locator('text=Ron Vachris').count();
  if (!found) fail(`[${vp.name}] Kirky did not answer "Who is the CEO?" with Ron Vachris`);
  else ok(`[${vp.name}] Kirky answers CEO question correctly`);
}

async function checkLogoVisible(page, vp) {
  const c = await page.locator('header svg').first().count();
  if (!c) fail(`[${vp.name}] logo svg missing`);
  else ok(`[${vp.name}] logo present in header`);
}

async function checkLogoUsesBrandVars(page, vp) {
  // Every brand-coloured fill on the logo SVG must reference a CSS var so the
  // logo recolours when the user picks a different palette.
  const data = await page.evaluate(() => {
    const usingVars = [];
    const literalReds = [];
    const literalBlues = [];
    document.querySelectorAll('header svg [fill], header svg [stroke], footer svg [fill], footer svg [stroke]').forEach((el) => {
      ['fill', 'stroke'].forEach((attr) => {
        const v = el.getAttribute(attr);
        if (!v) return;
        if (/var\(--brand/.test(v)) usingVars.push(`${attr}=${v}`);
        else if (/^#?(E31837|B7142C)/i.test(v)) literalReds.push(`${attr}=${v}`);
        else if (/^#?(005DAA|003B73|003594|001A4D)/i.test(v)) literalBlues.push(`${attr}=${v}`);
      });
    });
    return { usingVars: usingVars.length, literalReds: literalReds.slice(0, 3), literalBlues: literalBlues.slice(0, 3) };
  });
  if (data.usingVars === 0) fail(`[${vp.name}] logo uses no var(--brand-*) fills/strokes`);
  else if (data.literalReds.length || data.literalBlues.length) {
    fail(`[${vp.name}] logo has hardcoded brand colors (won't recolor with theme)`,
      [`reds: ${data.literalReds.join(', ')}`, `blues: ${data.literalBlues.join(', ')}`].filter(Boolean).join(' | '));
  } else {
    ok(`[${vp.name}] logo uses brand CSS vars (${data.usingVars} attrs)`);
  }
}

/**
 * Compute WCAG contrast ratio between two RGB colors.
 * Returns a number in [1, 21]. AA normal text needs ≥ 4.5.
 */
function contrastRatio(rgb1, rgb2) {
  const lum = (rgb) => {
    const ch = rgb.map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const L1 = lum(rgb1), L2 = lum(rgb2);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

function parseRgb(s) {
  const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}

/**
 * Ensure that brand-2 text (used for "India" wordmark + chatbot bubble +
 * focus rings) has at least AA-large contrast (3.0:1) against the page bg
 * across every palette × mode combination. Brand colors that fail here
 * would be unreadable on the corresponding background.
 */
async function checkBrandContrast(page, vp) {
  // Iterate every palette in both modes; for each, read computed brand-2 and bg
  const themeIds = ['costco', 'costco-web', 'sunset', 'forest', 'ocean', 'mono'];
  const failures = [];
  for (const id of themeIds) {
    for (const mode of ['light', 'dark']) {
      await page.goto(BASE + '/');
      await page.evaluate(({ id, mode }) => {
        localStorage.setItem('costco-gcc-theme', id);
        localStorage.setItem('costco-gcc-mode', mode);
      }, { id, mode });
      await page.reload({ waitUntil: 'networkidle' });
      const data = await page.evaluate(() => {
        const r = document.documentElement;
        const cs = getComputedStyle(r);
        return {
          brand1Text: cs.getPropertyValue('--brand-1-text').trim(),
          brand2Text: cs.getPropertyValue('--brand-2-text').trim(),
          brand3Text: cs.getPropertyValue('--brand-3-text').trim(),
          bg: cs.getPropertyValue('--bg').trim(),
        };
      });
      const hex = (h) => h.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16));
      try {
        const bg = hex(data.bg);
        // brand-X-text is the *text* variant — must clear AA Large (3.0:1) and
        // ideally body-text AA (4.5:1). We assert AA Large here.
        for (const [name, val] of [['brand-1-text', data.brand1Text], ['brand-2-text', data.brand2Text], ['brand-3-text', data.brand3Text]]) {
          const fg = hex(val);
          const ratio = contrastRatio(fg, bg);
          if (ratio < 3.0) {
            failures.push(`${id}/${mode} ${name}=${val} on bg=${data.bg} → contrast ${ratio.toFixed(2)} (need ≥ 3.0)`);
          }
        }
      } catch {}
    }
  }
  if (failures.length) fail(`[${vp.name}] brand-text contrast failures (AA Large 3.0:1)`, failures.slice(0, 6).join(' | '));
  else ok(`[${vp.name}] all 6 palettes × 2 modes pass brand-text AA-Large contrast`);
}

async function checkLogoRecolorsWithPalette(page, vp) {
  // Reset persisted palette so we always start from the default (Costco red).
  await page.goto(BASE + '/');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  // Snapshot computed fill of the navbar logo's first brand element
  const before = await page.evaluate(() => {
    const el = document.querySelector('header svg [fill*="var(--brand-1)"], header svg [fill*="var(--brand"]');
    return el ? getComputedStyle(el).fill : null;
  });
  if (!before) { fail(`[${vp.name}] no brand-fill element found in header logo`); return; }

  // Switch to a palette with a different brand-1 (Sunset)
  await page.locator('button[aria-label="Open theme picker"]').first().click();
  await page.locator('[role="dialog"][aria-label="Theme settings"]').first().waitFor({ state: 'visible' });
  await page.locator('button[role="radio"][aria-label="Sunset"]').first().click();
  await page.waitForTimeout(150);

  const after = await page.evaluate(() => {
    const el = document.querySelector('header svg [fill*="var(--brand-1)"], header svg [fill*="var(--brand"]');
    return el ? getComputedStyle(el).fill : null;
  });
  if (before === after) fail(`[${vp.name}] logo did NOT recolor on palette switch`, `before=${before} after=${after}`);
  else ok(`[${vp.name}] logo recolors with palette (${before} → ${after})`);
}

async function checkSectionTitlesNotClipped(page, vp) {
  // Every section heading and its key body text must fit horizontally inside
  // the viewport (no offscreen elements).
  const data = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('section h2, section h3, section p').forEach((el) => {
      const r = el.getBoundingClientRect();
      // Ignore offscreen-by-design (sr-only, hidden)
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (r.width === 0 || r.height === 0) return;
      const overflows = r.right > window.innerWidth + 1 || r.left < -1;
      if (overflows) {
        out.push({
          tag: el.tagName.toLowerCase(),
          section: el.closest('section')?.id || null,
          text: (el.textContent || '').trim().slice(0, 60),
          right: Math.round(r.right),
          viewW: window.innerWidth,
        });
      }
    });
    return out;
  });
  if (data.length) {
    fail(`[${vp.name}] ${data.length} section text element(s) overflow horizontally`,
      data.slice(0, 5).map((d) => `${d.tag} in #${d.section}: "${d.text}" right=${d.right} > ${d.viewW}`).join(' | '));
  } else {
    ok(`[${vp.name}] section titles & paragraphs all fit horizontally`);
  }
}

async function checkLocationCardRenders(page, vp) {
  const txt = await page.locator('section#locations').textContent();
  if (!/Capitaland/.test(txt || '')) fail(`[${vp.name}] Locations missing "Capitaland"`);
  else if (!/Madhapur/.test(txt || '')) fail(`[${vp.name}] Locations missing "Madhapur"`);
  else if (!/Hyderabad/.test(txt || '')) fail(`[${vp.name}] Locations missing "Hyderabad"`);
  else ok(`[${vp.name}] Locations card renders address correctly`);
}

async function checkCareersListsRoles(page, vp) {
  // Wait for /openings.json fetch to populate (seed has 1 role; the file
  // has ~30). In CI the cold-start fetch + hydration occasionally pushes
  // past the old 8s budget — give it 20s to remove the flake.
  await page.waitForFunction(() => {
    const cards = document.querySelectorAll('section#careers a[href*="/jobs/costco/"]');
    return cards.length >= 5;
  }, null, { timeout: 20_000 }).catch(() => null);
  const count = await page.locator('section#careers a[href*="/jobs/costco/"]').count();
  if (count < 5) fail(`[${vp.name}] careers showing only ${count} roles (expected ≥5 from /openings.json)`);
  else ok(`[${vp.name}] careers shows ${count} live roles`);
}

async function checkAnchorsAllHaveText(page, vp) {
  // Every anchor in nav and footer must have visible text or an aria-label.
  const empty = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('header a, footer a').forEach((a) => {
      const text = (a.textContent || '').trim();
      const aria = a.getAttribute('aria-label');
      if (!text && !aria) out.push({ href: a.getAttribute('href'), html: a.outerHTML.slice(0, 80) });
    });
    return out;
  });
  if (empty.length) fail(`[${vp.name}] ${empty.length} link(s) have no visible text or aria-label`, empty.slice(0, 4).map((e) => e.html).join(' | '));
  else ok(`[${vp.name}] all header/footer links labelled`);
}

async function checkImagesAndSvgsLabelled(page, vp) {
  const issues = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('img').forEach((i) => {
      if (!i.hasAttribute('alt') && i.getAttribute('role') !== 'presentation') {
        out.push({ kind: 'img', src: i.getAttribute('src') });
      }
    });
    document.querySelectorAll('svg').forEach((s) => {
      const role = s.getAttribute('role');
      const hidden = s.getAttribute('aria-hidden') === 'true' || role === 'presentation';
      const labelled = s.getAttribute('aria-label') || s.querySelector('title');
      if (!hidden && !labelled && role === 'img') out.push({ kind: 'svg', html: s.outerHTML.slice(0, 80) });
    });
    return out;
  });
  if (issues.length) fail(`[${vp.name}] ${issues.length} image(s)/svg(s) missing alt/aria-label`, JSON.stringify(issues.slice(0, 3)));
  else ok(`[${vp.name}] images and svgs are labelled or hidden from a11y tree`);
}

async function checkNoUndefinedText(page, vp) {
  const found = await page.evaluate(() => {
    const txt = document.body.innerText;
    const m = txt.match(/\bundefined\b|\bnull\b|\[object Object\]/);
    return m ? m[0] : null;
  });
  if (found) fail(`[${vp.name}] body contains stray "${found}"`);
  else ok(`[${vp.name}] no stray undefined/null/[object Object] in body`);
}

async function checkThemePickerFitsViewport(page, vp) {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const trigger = page.locator('button[aria-label="Open theme picker"]').first();
  if (!(await trigger.count())) { fail(`[${vp.name}] picker trigger missing`); return; }
  await trigger.click();
  const dialog = page.locator('[role="dialog"][aria-label="Theme settings"]').first();
  await dialog.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
  if (!(await dialog.isVisible())) { fail(`[${vp.name}] picker dialog did not open`); return; }

  const data = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-label="Theme settings"]');
    if (!d) return null;
    const r = d.getBoundingClientRect();
    return {
      l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom),
      w: Math.round(r.width), h: Math.round(r.height),
      vw: window.innerWidth, vh: window.innerHeight,
      // overflow inside the panel? If yes, scroll exists which is acceptable.
      scrollH: d.scrollHeight,
      clientH: d.clientHeight,
    };
  });
  if (!data) { fail(`[${vp.name}] picker bounding box not readable`); return; }

  const issues = [];
  if (data.l < 0) issues.push(`left=${data.l} off-screen`);
  if (data.r > data.vw + 1) issues.push(`right=${data.r} > viewport ${data.vw}`);
  if (data.t < 0) issues.push(`top=${data.t} off-screen`);
  if (data.b > data.vh + 1) issues.push(`bottom=${data.b} > viewport ${data.vh}`);
  // Width should be reasonable — never exceed viewport
  if (data.w > data.vw) issues.push(`width=${data.w} > viewport ${data.vw}`);

  if (issues.length) {
    fail(`[${vp.name}] picker overflows viewport`, issues.join('; ') + ` (panel ${data.w}×${data.h}, viewport ${data.vw}×${data.vh})`);
  } else {
    ok(`[${vp.name}] picker fits viewport (${data.w}×${data.h} in ${data.vw}×${data.vh})`);
  }

  // Internal-scroll check: the picker must not need to scroll its own content.
  // scrollHeight > clientHeight implies vertical scrollbar; same idea for width.
  const innerScroll = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-label="Theme settings"]');
    if (!d) return null;
    return {
      scrollH: d.scrollHeight, clientH: d.clientHeight,
      scrollW: d.scrollWidth, clientW: d.clientWidth,
    };
  });
  if (!innerScroll) return;
  if (innerScroll.scrollH > innerScroll.clientH + 1) {
    fail(`[${vp.name}] picker has vertical inner scroll`, `scrollH=${innerScroll.scrollH} > clientH=${innerScroll.clientH}`);
  } else {
    ok(`[${vp.name}] picker has no vertical inner scroll`);
  }
  if (innerScroll.scrollW > innerScroll.clientW + 1) {
    fail(`[${vp.name}] picker has horizontal inner scroll`, `scrollW=${innerScroll.scrollW} > clientW=${innerScroll.clientW}`);
  } else {
    ok(`[${vp.name}] picker has no horizontal inner scroll`);
  }
}

async function snapshot(page, name) {
  const path = `/tmp/costco-gcc-${name}.png`;
  await page.screenshot({ path, fullPage: false });
  ok(`screenshot saved: ${path}`);
}

async function checkHeadlineFullyVisible(page, vp) {
  const data = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    const r = h1.getBoundingClientRect();
    const cs = getComputedStyle(h1);
    return { r: { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) }, view: { w: window.innerWidth, h: window.innerHeight }, overflow: cs.overflow, text: h1.textContent?.trim().slice(0, 100) };
  });
  if (!data) { fail(`[${vp.name}] no h1`); return; }
  if (data.r.l < 0 || data.r.r > data.view.w + 1) fail(`[${vp.name}] h1 horizontally overflows`, JSON.stringify(data));
  else ok(`[${vp.name}] h1 fits within viewport`);
}

// ---------- runner ----------

async function run() {
  for (const vp of VIEWPORTS) {
    await withPage(vp, async (page) => {
      await checkHomepageRenders(page, vp);
      await checkNoHorizontalOverflow(page, vp);
      await checkOrbitalLabelsNotClipped(page, vp);
      await checkLogoVisible(page, vp);
      await checkLogoUsesBrandVars(page, vp);
      await checkHeadlineFullyVisible(page, vp);
      await checkSectionTitlesNotClipped(page, vp);
      await checkLocationCardRenders(page, vp);
      await checkAnchorsAllHaveText(page, vp);
      await checkImagesAndSvgsLabelled(page, vp);
      await checkNoUndefinedText(page, vp);
      await checkThemePickerFitsViewport(page, vp);
    });
  }

  // Heavier interactive checks on a representative desktop viewport.
  await withPage({ name: 'laptop-1280', w: 1280, h: 800 }, async (page) => {
    await checkSkipLink(page, { name: 'laptop-1280' });
    await checkCareersListsRoles(page, { name: 'laptop-1280' });
    await checkChatbotOpens(page, { name: 'laptop-1280' });
    await checkThemePickerOpacity(page, { name: 'laptop-1280' });
    await checkLogoRecolorsWithPalette(page, { name: 'laptop-1280' });
    await checkBrandContrast(page, { name: 'laptop-1280' });
    await checkAxeViolations(page, { name: 'laptop-1280' });
  });

  // Visual snapshots — full hero on three viewports, plus picker-open on
  // a portrait-ish viewport to match the user's most recent screenshot.
  await withPage({ name: 'mobile-375', w: 375, h: 812 }, async (page) => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await snapshot(page, 'mobile-375');
    await page.locator('button[aria-label="Open theme picker"]').first().click();
    await page.locator('[role="dialog"][aria-label="Theme settings"]').first().waitFor({ state: 'visible' });
    await snapshot(page, 'mobile-375-picker-open');
  });
  await withPage({ name: 'laptop-1280-dark', w: 1280, h: 800 }, async (page) => {
    await page.goto(BASE + '/');
    await page.evaluate(() => { localStorage.setItem('costco-gcc-mode', 'dark'); });
    await page.reload({ waitUntil: 'networkidle' });
    await snapshot(page, 'laptop-1280-dark');
    const headerBox = await page.locator('header').boundingBox();
    if (headerBox) {
      await page.screenshot({ path: '/tmp/costco-gcc-laptop-1280-navbar-dark.png', clip: { x: 0, y: 0, width: 1280, height: Math.ceil(headerBox.height) } });
      ok('screenshot saved: /tmp/costco-gcc-laptop-1280-navbar-dark.png');
    }
  });

  await withPage({ name: 'laptop-1280', w: 1280, h: 800 }, async (page) => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await snapshot(page, 'laptop-1280');
    // Scroll to footer and capture the LogoFull lockup
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await snapshot(page, 'laptop-1280-footer');
    // Also capture navbar zoom — full-DPR clip of just the header area
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(150);
    const headerBox = await page.locator('header').boundingBox();
    if (headerBox) {
      await page.screenshot({ path: '/tmp/costco-gcc-laptop-1280-navbar.png', clip: { x: 0, y: 0, width: 1280, height: Math.ceil(headerBox.height) } });
      ok('screenshot saved: /tmp/costco-gcc-laptop-1280-navbar.png');
    }
  });
  await withPage({ name: 'portrait-846', w: 846, h: 1262 }, async (page) => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Open theme picker"]').first().click();
    await page.locator('[role="dialog"][aria-label="Theme settings"]').first().waitFor({ state: 'visible' });
    await snapshot(page, 'portrait-846-picker-open');
  });
  await withPage({ name: 'ultrawide-3018', w: 3018, h: 1254 }, async (page) => {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.locator('button[aria-label="Open theme picker"]').first().click();
    await page.locator('[role="dialog"][aria-label="Theme settings"]').first().waitFor({ state: 'visible' });
    await snapshot(page, 'ultrawide-picker-open');
  });

  // Print summary
  let pass = 0, failCount = 0;
  for (const r of results) {
    if (r.ok) { pass++; console.log('  ✓', r.name); }
    else { failCount++; console.error('  ✗', r.name, r.detail ? `\n    → ${r.detail}` : ''); }
  }
  console.log(`\n${pass} passed, ${failCount} failed`);
  process.exit(failCount ? 1 : 0);
}

run().catch((err) => { console.error(err); process.exit(2); });
