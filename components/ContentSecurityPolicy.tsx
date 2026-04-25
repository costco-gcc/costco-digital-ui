// Renders a <meta http-equiv="Content-Security-Policy"> tag.
//
// Static export (GitHub Pages) means we can't set CSP via response headers,
// so the meta tag is the only mechanism. A few CSP directives (`frame-ancestors`,
// `report-to`, `report-uri`, sandbox) are ignored from meta — those would
// require a CDN/edge worker in front to set as headers.
//
// What's allowed:
//   - script-src: 'self' + 'unsafe-inline'. Next 14 inlines hydration
//     scripts whose hashes change every build, and CSP ignores
//     'unsafe-inline' when any hash is also present in the directive — so
//     a hash-only or hash+inline policy can't cover both our bootstrap
//     and Next's runtime. Tightening to nonce-based CSP requires a server
//     runtime; static export rules that out today. The hash is still
//     computed in lib/theme-script.ts so a migration is mechanical when
//     we have a CDN/edge in front that can rewrite per-request headers.
//     JSON-LD uses type="application/ld+json" and is exempt from script-src.
//   - style-src: 'unsafe-inline' is required for Tailwind's runtime styles
//     and React's `style={...}` prop. Tightening would mean refactoring
//     every inline style or shipping nonces (which a static export can't).
//   - connect-src: includes the Talent500 origin so the careers section
//     can refresh openings.json from there if we ever fetch it directly
//     (today we read a synced public/openings.json).

const policy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' https: data: blob:",
  "connect-src 'self' https://prod-warmachine.talent500.co",
  "form-action 'self' mailto:",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join('; ');

export default function ContentSecurityPolicy() {
  return <meta httpEquiv="Content-Security-Policy" content={policy} />;
}
