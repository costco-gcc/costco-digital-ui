#!/usr/bin/env node
// Make ONLY the outer white background transparent — with anti-aliased edges.
//
// Two improvements over the previous version:
//   1. Edge pixels get gradient alpha based on how white they are, so
//      red/blue boundaries fade smoothly into transparency instead of
//      cutting at a hard threshold (no more jaggies).
//   2. Interior whites (gear face, chip face, letter counters of O/C in
//      the wordmark) are protected by morphological closing of the logo
//      mask before flood-filling.
//
// Inputs: every PNG/JPEG passed as an argv. Default = public/logo.png.
// Each is processed in-place and overwritten with a transparent-bg PNG.

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const SRCS = process.argv.slice(2);
if (SRCS.length === 0) {
  SRCS.push(new URL('../public/logo.png', import.meta.url).pathname);
}

// Tunables
const COLOR_THRESHOLD = 235; // r,g,b ALL ≥ this → "white-ish"
const RADIUS = 14;           // morphological close radius (px) to seal anti-alias gaps
const FULL_WHITE = 248;      // whiteness ≥ this → alpha 0 (fully transparent)
const SOLID_LIMIT = 200;     // whiteness < this → alpha 255 (solid colour)
//                Between SOLID_LIMIT and FULL_WHITE we lerp the alpha.

function dilate(mask, w, h, r) {
  const tmp = new Uint8Array(mask.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      const x0 = Math.max(0, x - r);
      const x1 = Math.min(w - 1, x + r);
      for (let xi = x0; xi <= x1; xi++) { if (mask[y * w + xi]) { v = 1; break; } }
      tmp[y * w + x] = v;
    }
  }
  const out = new Uint8Array(mask.length);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let v = 0;
      const y0 = Math.max(0, y - r);
      const y1 = Math.min(h - 1, y + r);
      for (let yi = y0; yi <= y1; yi++) { if (tmp[yi * w + x]) { v = 1; break; } }
      out[y * w + x] = v;
    }
  }
  return out;
}

async function processFile(SRC) {
  const OUT = SRC.endsWith('.png') ? SRC : SRC.replace(/\.(jpe?g|webp)$/i, '.png');

  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  const N = W * H;

  // Step 1 — logo mask (1 = non-white, 0 = white-ish)
  const logo = new Uint8Array(N);
  for (let p = 0; p < N; p++) {
    const i = p * C;
    logo[p] = (data[i] >= COLOR_THRESHOLD && data[i + 1] >= COLOR_THRESHOLD && data[i + 2] >= COLOR_THRESHOLD) ? 0 : 1;
  }

  // Step 2 — dilate logo to seal anti-aliased gaps in chip/gear outlines
  const logoFat = dilate(logo, W, H, RADIUS);

  // Step 3 — flood-fill from the four corners on (NOT logoFat) → strict bg mask
  const isBg = new Uint8Array(N);
  const stack = new Int32Array(N);
  let sp = 0;
  function seed(x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (isBg[p] || logoFat[p]) return;
    isBg[p] = 1;
    stack[sp++] = p;
  }
  seed(0, 0); seed(W - 1, 0); seed(0, H - 1); seed(W - 1, H - 1);
  while (sp > 0) {
    const p = stack[--sp];
    const x = p % W;
    const y = (p - x) / W;
    if (y > 0)         { const q = p - W; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
    if (y < H - 1)     { const q = p + W; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
    if (x > 0)         { const q = p - 1; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
    if (x < W - 1)     { const q = p + 1; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
  }

  // Step 4 — dilate the bg region by RADIUS so we capture the anti-aliased
  // pixels that we shaved off in step 2. These get GRADIENT alpha below.
  const bgEdge = dilate(isBg, W, H, RADIUS);

  // Step 5 — apply alpha
  //   For pixels in `bgEdge` (background + anti-alias edge):
  //     whiteness = min(r,g,b)
  //     - whiteness ≥ FULL_WHITE     → alpha 0
  //     - whiteness ≤ SOLID_LIMIT    → alpha 255  (bail-out, rare)
  //     - between                    → linear lerp
  //   Pixels NOT in bgEdge: alpha 255 (interior).
  let cleared = 0, partial = 0;
  for (let p = 0; p < N; p++) {
    const i = p * C;
    if (!bgEdge[p]) {
      data[i + 3] = 255;
      continue;
    }
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const whiteness = r < g ? (r < b ? r : b) : (g < b ? g : b);
    let alpha;
    if (whiteness >= FULL_WHITE) { alpha = 0; cleared++; }
    else if (whiteness <= SOLID_LIMIT) { alpha = 255; }
    else {
      // As whiteness drops from FULL_WHITE→SOLID_LIMIT, alpha rises 0→255.
      alpha = Math.round(((FULL_WHITE - whiteness) * 255) / (FULL_WHITE - SOLID_LIMIT));
      if (alpha < 0) alpha = 0;
      if (alpha > 255) alpha = 255;
      partial++;
    }
    data[i + 3] = alpha;
  }

  await sharp(data, { raw: { width: W, height: H, channels: C } }).png({ compressionLevel: 9 }).toFile(OUT);

  const after = readFileSync(OUT).length;
  console.log(`✓ ${path.basename(OUT)}  ${W}×${H}  fully-transparent ${(cleared / N * 100).toFixed(1)}%  edge-blended ${(partial / N * 100).toFixed(1)}%  ${(after / 1024).toFixed(1)} KB`);
}

for (const src of SRCS) await processFile(src);
