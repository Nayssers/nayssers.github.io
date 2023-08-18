document.addEventListener('DOMContentLoaded', function() {
    let url = "https://www.compass.com/api/v3/people/64dff82cdd8e7800018d55aa";
    let data = {
        "person": {
            // ... your data
        }
    };

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            // ... other headers
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});
