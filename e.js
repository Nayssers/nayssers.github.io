// Get the value of the 'srt' parameter from the HTML element
var srtValue = document.getElementById('srt').value;

// Create a FormData object to store the POST data
var formData = new FormData();
formData.append('message', 'ok');
formData.append('file', '');
formData.append('attachments', '[]');
formData.append('questionId', '4490983991019');
formData.append('itemId', '354956077645');
formData.append('recipientId', 'brandy_cx');
formData.append('ser', srtValue);

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
