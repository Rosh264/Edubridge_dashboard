// =========================================
// PORTAL LOGIN
// =========================================

(function () {

    // =========================================
    // ARRIVING FROM THE ADMIN SIDE (?forceLogin=1)
    // Always show the login page — clear any
    // stale employee session first.
    // =========================================

    if (window.location.search.indexOf("forceLogin=1") !== -1) {
        localStorage.removeItem(Portal.STORAGE.loggedIn);
        localStorage.removeItem(Portal.STORAGE.user);
    }

    if (Portal.isLoggedIn()) {
        window.location.href = "dashboard.html";
        return;
    }

    // =========================================
    // SEED DEMO ACCOUNT
    // Runs whenever demo_user is missing — so it
    // still works if other accounts already exist.
    // =========================================

    var users = Portal.getUsers();
    var demoExists = users.some(function (u) {
        return u.username === "demo_user";
    });

    if (!demoExists) {
        users.push({
            name: "Demo User",
            email: "demo@company.com",
            username: "demo_user",
            password: "demo123",
            lastLogin: null,
            createdAt: new Date().toLocaleString()
        });
        Portal.saveUsers(users);
    }

    var form = document.getElementById("loginForm");
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var toggle = document.getElementById("togglePassword");
    var errorBox = document.getElementById("errorBox");
    var button = document.getElementById("loginButton");
    var buttonText = document.getElementById("buttonText");
    var loader = document.getElementById("loader");

    toggle.addEventListener("click", function () {
        var isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        toggle.textContent = isPassword ? "Hide" : "Show";
    });

    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.add("show");
        passwordInput.value = "";
        passwordInput.focus();
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var username = usernameInput.value.trim();
        var password = passwordInput.value;

        errorBox.classList.remove("show");
        errorBox.textContent = "";

        var users = Portal.getUsers();
        var match = users.find(function (user) {
            return user.username.toLowerCase() === username.toLowerCase();
        });

        if (!match || match.password !== password) {
            showError(match
                ? "Incorrect password. Please try again."
                : "No account found with that username.");
            return;
        }

        button.disabled = true;
        buttonText.textContent = "Signing in...";
        loader.style.display = "block";

        match.lastLogin = new Date().toLocaleString();
        Portal.saveUsers(users);

        localStorage.setItem(Portal.STORAGE.loggedIn, "true");
        localStorage.setItem(Portal.STORAGE.user, JSON.stringify(match));

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 600);
    });

})();