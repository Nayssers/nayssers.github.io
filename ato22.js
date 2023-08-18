document.addEventListener('DOMContentLoaded', function() {
    let url = "https://www.compass.com/api/v3/people/64dff82cdd8e7800018d55aa";
    
    let data = {
        "person": {
            "personId": "exampleID1234567890",
            "firstName": "John",
            "lastName": "Doe",
            "displayName": "John Doe",
            "selectedGeoId": "",
            "createdAt": 1692399661007,
            "updatedAt": 1692400778714,
            "profile": {
                "customer": {
                    "preferredContactMethod": 0
                }
            },
            "phone": "1234567890",
            "roles": ["Renter"],
            "active": true
        }
    };

    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            // ... other headers but stripped of sensitive data
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
