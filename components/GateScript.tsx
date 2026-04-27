// Soft front-door gate. Anyone hitting the production hostname without the
// unlock code (`?code=JX89KJ`) is redirected straight to costco.com before
// the rest of the page renders. The gate is purely client-side — anyone
// who views source can find the code, so this is a "friends of the team"
// preview lock, not security.
//
// Behaviour:
//   1. If the URL has `?code=JX89KJ`, persist it in localStorage and clean
//      the query string so the address bar doesn't carry the code around.
//      Subsequent visits from the same browser pass through automatically.
//   2. If localStorage already holds the unlock token, pass through.
//   3. Otherwise hide <html> (so no FOUC during the redirect) and call
//      `location.replace` to send the visitor to costco.com.
//
// Hostname guard: only the canonical production domain is gated. localhost
// and CI runners pass through, so dev/build/test never trip the redirect.
//
// CSP: app-wide policy already allows `script-src 'self' 'unsafe-inline'`,
// so the inline tag runs without a per-script hash.

const UNLOCK_CODE = 'JX89KJ';
const STORAGE_KEY = 'costco-gcc-gate';
const REDIRECT_URL = 'https://www.costco.com/';
const GATED_HOSTS = ['www.costcodigital.com', 'costcodigital.com'];

// Cookies are the primary persistence: Safari's Intelligent Tracking
// Prevention can clear localStorage after 7 days of inactivity, and
// private/incognito modes silently drop localStorage writes. A 1-year
// max-age cookie survives both, and we write localStorage as a backup
// in case cookies are blocked by extensions. Either store unlocks the
// gate on subsequent visits.
const SCRIPT = `
(function () {
  try {
    var host = window.location.hostname.toLowerCase();
    var gated = ${JSON.stringify(GATED_HOSTS)};
    if (gated.indexOf(host) === -1) return;

    var key = ${JSON.stringify(STORAGE_KEY)};
    var unlock = ${JSON.stringify(UNLOCK_CODE)};
    var url = new URL(window.location.href);
    var code = url.searchParams.get('code');

    function readCookie() {
      try {
        var m = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
      } catch (e) { return null; }
    }
    function writeCookie(v) {
      try {
        // 1-year persistence; Lax + Secure since the production host is HTTPS only.
        document.cookie = key + '=' + encodeURIComponent(v) +
          '; path=/; max-age=31536000; SameSite=Lax; Secure';
      } catch (e) {}
    }

    if (code === unlock) {
      writeCookie(unlock);
      try { localStorage.setItem(key, unlock); } catch (e) {}
      url.searchParams.delete('code');
      try { history.replaceState(null, '', url.toString()); } catch (e) {}
      return;
    }
    if (readCookie() === unlock) return;
    try { if (localStorage.getItem(key) === unlock) return; } catch (e) {}

    try { document.documentElement.style.visibility = 'hidden'; } catch (e) {}
    window.location.replace(${JSON.stringify(REDIRECT_URL)});
  } catch (e) {}
})();
`;

export default function GateScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
