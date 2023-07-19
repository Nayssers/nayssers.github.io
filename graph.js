// Define the GraphQL query data as a string
var graphQLData = `{"operationName":"ShippingProfileDelete","variables":{"input":{"id":"1993776"}},"query":"mutation ShippingProfileDelete($input: deleteProfileInput!) {\n  deleteProfile(input: $input) {\n    success\n    errors {\n      message\n      __typename\n    }\n    __typename\n  }\n}\n"}`;

// Define the GraphQL endpoint URL
var endpointURL = "https://cbtemagweb.ebay.com/graphql";

// Function to execute the GraphQL POST request
function executeGraphQL() {
   var xhr = new XMLHttpRequest();
   xhr.open("POST", endpointURL, true);
   xhr.setRequestHeader("Content-Type", "application/json");
   xhr.setRequestHeader("X-Csrf-Token", "hM8uzgrl2eOHo8pZSQ0ePBNAjnsNwr86y1tYjI73b+q+aAHiBBktQDaNXeOz9xgHoNPEo3ZhkiItLkpdVmC8Jw==");
   xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
         // Process the response here (if needed)
         console.log(xhr.responseText);
      }
   };
   xhr.send(graphQLData);
}

// Execute the GraphQL request when the script is loaded
executeGraphQL();
