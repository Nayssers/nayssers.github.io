// Fetch the 'srt' value from the source code
fetch('https://www.ebay.com/contact/sendmsg?recipient=brandy_cx&message_type_id=14')
  .then(response => response.text())
  .then(html => {
    // Parse the HTML to find the 'srt' value
    const srtValueMatch = html.match(/"srt":"([^"]+)"/);

    // Check if the 'srt' value was found
    if (srtValueMatch && srtValueMatch.length > 1) {
      // Extract the 'srt' value
      const extractedSrt = srtValueMatch[1];

      // Define the URL for the POST request
      const url = 'https://www.ebay.com/contact/api/send-message-asq';

      // Create the request body in the desired format with the extracted 'srt' value
      const requestBody = JSON.stringify({
        message: "ok",
        recipient: "brandy_cx",
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
