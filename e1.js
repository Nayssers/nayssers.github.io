// Fetch the 'srt' value from the homepage
fetch('https://www.ebay.com')
  .then(response => response.text())
  .then(html => {
    // Parse the HTML to find the 'srt' value
    const srtValue = html.match(/<input type="hidden" name="srt" value="([^"]+)"/);
    
    // Check if the 'srt' value was found
    if (srtValue && srtValue.length > 1) {
      // Extract the value from the match
      const extractedSrt = srtValue[1];

      // Now you can use the 'extractedSrt' value in your POST request
      // Create a FormData object to store the POST data
      var formData = new FormData();
      formData.append('message', 'ok');
      formData.append('file', '');
      formData.append('attachments', '[]');
      formData.append('questionId', '4490983991019');
      formData.append('itemId', '354956077645');
      formData.append('recipientId', 'brandy_cx');
      formData.append('ser', extractedSrt);

      // Define the URL for the POST request
      var url = 'https://www.ebay.com/cnt/ReplyToMessages';

      // Create a new XMLHttpRequest object
      var xhr = new XMLHttpRequest();

      // Configure the POST request
      xhr.open('POST', url, true);

      // Set the content type to application/x-www-form-urlencoded
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      // Send the POST request with the FormData
      xhr.send(formData);
    }
  })
  .catch(error => {
    console.error('Error fetching the srt value:', error);
  });
