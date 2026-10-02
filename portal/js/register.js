// =========================================
// PORTAL REGISTER
// =========================================

(function () {

    if (Portal.isLoggedIn()) {
        window.location.href = "dashboard.html";
        return;
    }

    var form = document.getElementById("registerForm");
    var nameInput = document.getElementById("fullName");
    var emailInput = document.getElementById("email");
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
    var confirmInput = document.getElementById("confirm");
    var toggle = document.getElementById("togglePassword");
    var errorBox = document.getElementById("errorBox");
    var button = document.getElementById("registerButton");
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
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = nameInput.value.trim();
        var email = emailInput.value.trim();
        var username = usernameInput.value.trim();
        var password = passwordInput.value;
        var confirm = confirmInput.value;

        errorBox.classList.remove("show");
        errorBox.textContent = "";

        if (!name || !email || !username || !password) {
            showError("All fields are required.");
            return;
        }

        if (password !== confirm) {
            showError("Passwords do not match.");
            return;
        }

        if (password.length < 4) {
            showError("Password must be at least 4 characters.");
            return;
        }

        var users = Portal.getUsers();
        var exists = users.find(function (user) {
            return user.username === username ||
                user.email === email;
        });

        if (exists) {
            var message = exists.username === username
                ? "That username is already taken."
                : "An account already exists with that email.";
            showError(message);
            return;
        }

        var newUser = {
            name: name,
            email: email,
            username: username,
            password: password,
            lastLogin: null,
            createdAt: new Date().toLocaleString()
        };

        users.push(newUser);
        Portal.saveUsers(users);

        button.disabled = true;
        buttonText.textContent = "Creating account...";
        loader.style.display = "block";

        localStorage.setItem(Portal.STORAGE.loggedIn, "true");
        localStorage.setItem(Portal.STORAGE.user, JSON.stringify(newUser));

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 600);
    });

})();