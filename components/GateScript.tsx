// Strict front-door gate. Every page load on the production hostname is
// checked: `?code=JX89KJ` in the URL → site loads; anything else →
// instant redirect to costco.com. No localStorage, no cookies, no
// persistence — the URL is the only key.
//
// Hostname guard: only the canonical production domain is gated. localhost
// and CI runners pass through, so dev/build/test never trip the redirect.
//
// CSP: app-wide policy already allows `script-src 'self' 'unsafe-inline'`,
// so the inline tag runs without a per-script hash.

const UNLOCK_CODE = 'JX89KJ';
const REDIRECT_URL = 'https://www.costco.com/';
const GATED_HOSTS = ['www.costcodigital.com', 'costcodigital.com'];

const SCRIPT = `
(function () {
  try {
    var host = window.location.hostname.toLowerCase();
    var gated = ${JSON.stringify(GATED_HOSTS)};
    if (gated.indexOf(host) === -1) return;

    var unlock = ${JSON.stringify(UNLOCK_CODE)};
    var code;
    try { code = new URL(window.location.href).searchParams.get('code'); } catch (e) {}
    if (code === unlock) return;

    try { document.documentElement.style.visibility = 'hidden'; } catch (e) {}
    window.location.replace(${JSON.stringify(REDIRECT_URL)});
  } catch (e) {}
})();
`;

export default function GateScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
