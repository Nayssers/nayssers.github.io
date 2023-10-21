// Fetch the 'srt' value from the source code
fetch('https://settings3.ebay.com/address/add?type=SHIPPING')
  .then(response => response.text())
  .then(html => {
    // Parse the HTML to find the 'srt' value
    const srtValueMatch = html.match(/"srt":"([^"]+)"/);

    // Check if the 'srt' value was found
    if (srtValueMatch && srtValueMatch.length > 1) {
      // Extract the 'srt' value
      const extractedSrt = srtValueMatch[1];

      // Define the URL for the POST request
      const url = 'https://ebay.com/address/add';

      // Create the request body in the desired format with the extracted 'srt' value
      const requestBody = JSON.stringify({
        location: {
          addressLine1: "5300 Step Rd",
          city: "North Little Rock",
          stateOrProvince: "AR",
          country: "US",
          postalCode: "72113"
        },
        addressPurpose: "SHIPPING",
        srt: extractedSrt,
        addressStatus: "USER_VISIBLE",
        addressPreference: "NONE",
        name: "ok ok",
        phoneCountryCode: "US",
        phoneNumber: "8944654888"
      });

      // Create a new XMLHttpRequest object
      const xhr = new XMLHttpRequest();

      // Configure the POST request
      xhr.open('POST', url, true);

      // Set the content type to application/json
      xhr.setRequestHeader('Content-Type', 'application/json');

      // Send the POST request with the custom body
      xhr.send(requestBody);
    }
  })
  .catch(error => {
    console.error('Error fetching the srt value:', error);
  });
