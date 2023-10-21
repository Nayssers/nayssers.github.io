// Fetch the 'srt' value from the homepage
fetch('https://www.ebay.com')
  .then(response => response.text())
  .then(html => {
    // Parse the HTML to find the 'srt' value
    const srtValueMatch = html.match(/<input type="hidden" name="srt" value="([^"]+)"/);

    // Check if the 'srt' value was found
    if (srtValueMatch && srtValueMatch.length > 1) {
      // Extract the 'srt' value
      const srtValue = srtValueMatch[1];

      // Construct the POST request body with the 'srt' value
      const requestBody = `message=ok&file=&attachments=%5B%5D&questionId=4490983991019&itemId=354956077645&recipientId=brandy_cx&srt=${srtValue}`;

      // Define the URL for the POST request
      const url = 'https://www.ebay.com/cnt/ReplyToMessages';

      // Create a new XMLHttpRequest object
      const xhr = new XMLHttpRequest();

      // Configure the POST request
      xhr.open('POST', url, true);

      // Set the content type to application/x-www-form-urlencoded
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      // Send the POST request with the custom body
      xhr.send(requestBody);
    }
  })
  .catch(error => {
    console.error('Error fetching the srt value:', error);
  });
