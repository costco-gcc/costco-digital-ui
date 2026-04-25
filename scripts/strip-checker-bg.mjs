#!/usr/bin/env node
// Strip a Photoshop transparency-checker background that's been baked into
// a JPEG export, while preserving any genuine white interiors of the logo.
//
// Insight: the checker uses a unique gray (~205,205,205) that the logo never
// uses. From gray seed pixels we flood-fill outward, but only through
// "grayscale highways" — bright grayscale pixels (light-square white). The
// flood cannot pass through coloured outlines of the logo, so it never
// reaches a chip face / gear face / letter counter that's enclosed by
// red or blue. Reached pixels = checker = alpha 0. Non-reached pixels =
// logo, kept opaque. Anti-aliased seams between logo and bg get gradient
// alpha based on chromaticity.

import sharp from 'sharp';
import path from 'node:path';

const SRC = process.argv[2];
const OUT = process.argv[3] || (SRC ? SRC.replace(/\.(jpe?g|webp)$/i, '.png') : null);
if (!SRC || !OUT) {
  console.error('usage: strip-checker-bg.mjs <input> [<output>]');
  process.exit(1);
}

// Tunables
const GRAY_TARGET = 205;
const GRAY_TOL = 12;
const GRAY_DESAT = 8;        // |max - min| ≤ → grayscale
const WHITE_MIN = 200;       // bright grayscale "highway" min brightness
const EDGE_DESAT_LIMIT = 30; // anti-aliased edges still desaturated

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const N = W * H;

// classify each pixel
//   0 = colored (logo opaque)
//   1 = gray-205 (definitely checker)
//   2 = bright grayscale (light-square / interior white)
//   3 = anti-aliased edge (desaturated but darker)
const klass = new Uint8Array(N);
for (let p = 0; p < N; p++) {
  const i = p * C;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
  const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
  const desat = max - min;
  if (Math.abs(r - GRAY_TARGET) <= GRAY_TOL && Math.abs(g - GRAY_TARGET) <= GRAY_TOL && Math.abs(b - GRAY_TARGET) <= GRAY_TOL && desat <= GRAY_DESAT) {
    klass[p] = 1;
  } else if (desat <= GRAY_DESAT && min >= WHITE_MIN) {
    klass[p] = 2;
  } else if (desat <= EDGE_DESAT_LIMIT) {
    klass[p] = 3;
  } else {
    klass[p] = 0;
  }
}

// Flood-fill from every gray pixel, through gray and bright-grayscale.
const reached = new Uint8Array(N);
const stack = new Int32Array(N);
let sp = 0;
for (let p = 0; p < N; p++) {
  if (klass[p] === 1 && !reached[p]) {
    reached[p] = 1;
    stack[sp++] = p;
  }
}
while (sp > 0) {
  const p = stack[--sp];
  const x = p % W;
  const y = (p - x) / W;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const q = ny * W + nx;
    if (reached[q]) continue;
    const k = klass[q];
    if (k === 1 || k === 2) { reached[q] = 1; stack[sp++] = q; }
  }
}

// Apply alpha
let cleared = 0, partial = 0, kept = 0;
for (let p = 0; p < N; p++) {
  const i = p * C;
  if (reached[p]) {
    data[i + 3] = 0;
    cleared++;
  } else if (klass[p] === 3) {
    // Anti-aliased edge: alpha based on saturation. Desaturated → transparent,
    // saturated → opaque. Cap at 255.
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = r > g ? (r > b ? r : b) : (g > b ? g : b);
    const min = r < g ? (r < b ? r : b) : (g < b ? g : b);
    const sat = max - min;
    const a = Math.min(255, Math.max(0, Math.round((sat * 255) / EDGE_DESAT_LIMIT)));
    data[i + 3] = a;
    if (a === 0) cleared++;
    else if (a === 255) kept++;
    else partial++;
  } else {
    data[i + 3] = 255;
    kept++;
  }
}

await sharp(data, { raw: { width: W, height: H, channels: C } }).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`✓ ${path.basename(OUT)}  ${W}×${H}`);
console.log(`  cleared:      ${cleared.toLocaleString()}  (${(cleared / N * 100).toFixed(1)}%)`);
console.log(`  edge-blended: ${partial.toLocaleString()}  (${(partial / N * 100).toFixed(1)}%)`);
console.log(`  kept opaque:  ${kept.toLocaleString()}  (${(kept / N * 100).toFixed(1)}%)`);
