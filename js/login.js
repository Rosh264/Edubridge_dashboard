const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");

const passwordInput = document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const errorMessage =
    document.getElementById("errorMessage");

const loginButton =
    document.getElementById("loginButton");

const buttonText =
    document.getElementById("buttonText");

const loader =
    document.getElementById("loader");


// ============================
// SHOW / HIDE PASSWORD
// ============================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "Show";

    }

});


// ============================
// LOGIN
// ============================

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    // Clear previous error

    errorMessage.classList.remove("show");

    errorMessage.textContent = "";


    // DEMO LOGIN

    if (
        username === "Roshan Sharma" &&
        password === "rosh_admin"
    ) {

        loginButton.disabled = true;

        buttonText.textContent = "Signing in...";

        loader.style.display = "block";


        // Save login state

        localStorage.setItem(
            "serviceDeskLoggedIn",
            "true"
        );

        localStorage.setItem(
            "serviceDeskUser",
            username
        );


        // Small loading effect

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 700);


    } else {

        errorMessage.textContent =
            "Invalid username or password. Please try again.";

        errorMessage.classList.add("show");

        passwordInput.value = "";

        passwordInput.focus();

    }

});


// ============================
// FORGOT PASSWORD
// ============================

document
    .getElementById("forgotPassword")
    .addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Password reset is not available in the demo version."
        );

    });


// ============================
// ENTER KEY
// ============================

passwordInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        loginForm.requestSubmit();

    }

});