#!/usr/bin/env node
// Background-strip the cropped globe-style Costco logo. The previous generic
// strip script used an aggressive 14-px dilation to seal anti-aliased outline
// gaps in the chip/gear, but for the globe's near-circular design that
// dilation traps a band of near-white between the sphere body and the
// curved bottom banner — they appear as a dark halo on dark backgrounds.
//
// This script does:
//   1. logo mask (non-white pixels)
//   2. SMALL dilation (R=3) — just enough to seal compression-edge gaps
//   3. flood-fill from the four corners on the inverted dilated mask
//   4. SECOND pass — find still-opaque pixels that are near-white and
//      reachable from the bg via near-white travel; make them transparent
//      too (this catches the trapped white between sphere and banner)
//   5. Anti-aliased edge pixels get gradient alpha based on whiteness.

import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const SRC = process.argv[2];
const OUT = process.argv[3] || SRC;
if (!SRC) { console.error('usage: strip-globe-bg.mjs <input> [<output>]'); process.exit(1); }

const COLOR_THRESHOLD = 235;
const DILATE_R = 3;
const FILL_R = 6;             // hole-fill expansion
const FULL_TRANSPARENT_AT = 248;
const SOLID_LIMIT = 200;

function dilate(mask, w, h, r) {
  const tmp = new Uint8Array(mask.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r);
      for (let xi = x0; xi <= x1; xi++) { if (mask[y * w + xi]) { v = 1; break; } }
      tmp[y * w + x] = v;
    }
  }
  const out = new Uint8Array(mask.length);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let v = 0;
      const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r);
      for (let yi = y0; yi <= y1; yi++) { if (tmp[yi * w + x]) { v = 1; break; } }
      out[y * w + x] = v;
    }
  }
  return out;
}

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const N = W * H;

// Step 1 — logo mask
const logo = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  const i = p * C;
  logo[p] = (data[i] >= COLOR_THRESHOLD && data[i + 1] >= COLOR_THRESHOLD && data[i + 2] >= COLOR_THRESHOLD) ? 0 : 1;
}

// Step 2 — light dilation, just enough to seal JPEG-edge pinholes
const logoFat = dilate(logo, W, H, DILATE_R);

// Step 3 — flood-fill from corners
const isBg = new Uint8Array(N);
const stack = new Int32Array(N);
let sp = 0;
function seed(x, y) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const p = y * W + x;
  if (isBg[p] || logoFat[p]) return;
  isBg[p] = 1; stack[sp++] = p;
}
seed(0, 0); seed(W - 1, 0); seed(0, H - 1); seed(W - 1, H - 1);
while (sp > 0) {
  const p = stack[--sp];
  const x = p % W, y = (p - x) / W;
  if (y > 0)         { const q = p - W; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
  if (y < H - 1)     { const q = p + W; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
  if (x > 0)         { const q = p - 1; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
  if (x < W - 1)     { const q = p + 1; if (!isBg[q] && !logoFat[q]) { isBg[q] = 1; stack[sp++] = q; } }
}

// Step 4 — hole-fill pass. ANY pixel that is (a) currently not bg, (b) near-white,
// and (c) within FILL_R of a bg pixel via near-white pixels — also becomes bg.
// Repeat until stable.
const nearWhite = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  const i = p * C;
  const min = Math.min(data[i], data[i + 1], data[i + 2]);
  if (min >= 230) nearWhite[p] = 1;
}
// Flood-expand isBg through nearWhite pixels
const stack2 = new Int32Array(N);
let sp2 = 0;
for (let p = 0; p < N; p++) if (isBg[p]) stack2[sp2++] = p;
while (sp2 > 0) {
  const p = stack2[--sp2];
  const x = p % W, y = (p - x) / W;
  for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const q = ny * W + nx;
    if (!isBg[q] && nearWhite[q]) { isBg[q] = 1; stack2[sp2++] = q; }
  }
}

// Step 5 — dilate the bg region by 1 to capture anti-aliased boundary pixels
const bgEdge = dilate(isBg, W, H, 1);

// Step 6 — apply alpha
let cleared = 0, partial = 0, kept = 0;
for (let p = 0; p < N; p++) {
  const i = p * C;
  if (!bgEdge[p]) { data[i + 3] = 255; kept++; continue; }
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
  if (min >= FULL_TRANSPARENT_AT) { data[i + 3] = 0; cleared++; }
  else if (min <= SOLID_LIMIT) { data[i + 3] = 255; kept++; }
  else {
    const a = Math.round(((FULL_TRANSPARENT_AT - min) * 255) / (FULL_TRANSPARENT_AT - SOLID_LIMIT));
    data[i + 3] = Math.max(0, Math.min(255, 255 - a));
    partial++;
  }
}

await sharp(data, { raw: { width: W, height: H, channels: C } }).png({ compressionLevel: 9 }).toFile(OUT);
const after = readFileSync(OUT).length;
console.log(`✓ ${path.basename(OUT)}  ${W}×${H}`);
console.log(`  cleared:      ${cleared.toLocaleString()} (${(cleared / N * 100).toFixed(1)}%)`);
console.log(`  edge-blended: ${partial.toLocaleString()} (${(partial / N * 100).toFixed(1)}%)`);
console.log(`  kept opaque:  ${kept.toLocaleString()} (${(kept / N * 100).toFixed(1)}%)`);
console.log(`  size: ${(after / 1024).toFixed(1)} KB`);
