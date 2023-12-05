// Fetch the 'sendToken' value from the source code
fetch('https://www.ebay.com/contact/sendmsg?recipient=oumastore&message_type_id=14')
  .then(response => response.text())
  .then(html => {
    // Parse the HTML to find the 'srt' value
    const srtValueMatch = html.match(/"sendToken":"([^"]+)"/);

    // Check if the 'sendToken' value was found
    if (srtValueMatch && srtValueMatch.length > 1) {
      // Extract the 'sendToken' value
      const extractedSrt = srtValueMatch[1];

      // Define the URL for the POST request
      const url = 'https://www.ebay.com/contact/api/send-message-asq';

      // Create the request body in the desired format with the extracted 'sendToken' value
      const requestBody = JSON.stringify({
        message: "ThisIsaTestPOOC-after-1Month",
        recipient: "oumastore",
        attachments: [],
        srt: extractedSrt,
        subject: null,
        messageTypeId: "14",
        copyToSender: false
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
