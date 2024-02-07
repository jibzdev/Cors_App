import { notify } from './notification.mjs';

async function homepage() {
    const main = document.querySelector("main");
    main.innerHTML = `
        <h1>Welcome to the Homepage</h1>
    `;

    history.pushState({ page: "homepage" }, "homepage", "homepage");
}

async function signup() {
    const main = document.querySelector("main");
    main.innerHTML = `
    <div id="inputCard" class="fade">
        <div class="input-container">
            <a href="index"><img src="assets/img/logo1.png" alt="Cors App Logo 1" style="width: 7.5vh;"></a>
            <div class="input-with-icon">
                <i class="fas fa-user"></i>
                <input type="text" placeholder="Username" id="username" required>
            </div>
            <div class="input-with-icon">
                <i class="fas fa-envelope"></i>
                <input type="email" placeholder="Email" id="email" required>
            </div>
            <div class="input-with-icon">
                <i class="fas fa-lock"></i>
                <input type="password" placeholder="Password" id="password" required>
            </div>
            <div class="input-with-icon">
                <i class="fas fa-lock"></i>
                <input type="password" placeholder="Confirm Password" id="confirmPassword" required>
            </div>
            <div class="input-with-icon">
                <i class="fas fa-cake"></i>
                <input type="date" placeholder="Date Of Birth" id="dob" required>
            </div>
            <button id="confirmSignup" class="buttonStyle2" style="margin-top: 15px;">Sign Up</button>
        </div>
        <p id="sText">Already have an account?<br><button id="login">LOGIN</button></p>
    </div>`;
    let sText = document.querySelector("#sText");
    sText.style.top = "95%";
    sText.style.transform = "translateY(-95%)";
    const loginButton = main.querySelector("#login");
    loginButton.addEventListener("click", login);

    function validateSignUp() {
        main.querySelector("#confirmSignup").addEventListener("click", async () => {
            const usernameField = main.querySelector("#username");
            const emailField = main.querySelector("#email");
            const passwordField = main.querySelector("#password");
            const confirmPasswordField = main.querySelector("#confirmPassword");
            const dobField = main.querySelector("#dob");

            const username = usernameField.value;
            const email = emailField.value;
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;
            const dob = dobField.value;

            if (!username || !email || !password || !confirmPassword || !dob) {
                notify("All fields Required", "red");
                return;
            }

            if (password !== confirmPassword) {
                notify("Password Does Not Match", "red");
                return;
            }

            const payload = {
                username,
                email,
                password,
                dob,
            }
            notify("Signed Up Successfully!", "green");
            usernameField.value = '';
            emailField.value = '';
            passwordField.value = '';
            confirmPasswordField.value = '';
            dobField.value = '';
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',},
                body: JSON.stringify(payload),
            });

        })
    }

    validateSignUp();

    history.pushState({page: "signup"}, "signup", "signup");
};

async function login() {
    const main = document.querySelector("main");
    main.innerHTML = `
        <div id="inputCard" class="fade">
        <div class="input-container">
        <a href="index"><img src="assets/img/logo1.png" alt="Cors App Logo 1" style="width: 7.5vh;"></a>
        <div class="input-with-icon">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Username" id="username">
        </div>
        <div class="input-with-icon">
        <i class="fas fa-lock"></i>
        <input type="password" placeholder="Password" id="password">
        </div>
            <button id="confirmLogin" class="buttonStyle2" style="margin-top: 15px;">Login</button>
        </div>
        <p id="sText">Dont have an Account?<br><button id="signup">REGISTER</button></p>
        </div>
        `;
        const signupButton = main.querySelector("#signup");
        signupButton.addEventListener("click", signup);
        let showUsers = document.createElement("button");
        showUsers.setAttribute("id","showUsers");
        showUsers.textContent = "Show Users";
        main.appendChild(showUsers);
        showUsers.addEventListener("click", async () => {
        const response = await fetch('/allUsers');
        const users = await response.json();
        notify("All Users Logged","green");
        });

        const confirmLoginButton = main.querySelector("#confirmLogin");
        confirmLoginButton.addEventListener("click", async () => {
            const payload = {
                username: main.querySelector("#username").value,
                password: main.querySelector("#password").value,
            };
    
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
    
            if (response.ok) {
                homepage();
            } else {
                console.log("Login failed");
            }
        });
    history.pushState({page: "login"}, "login", "login");
};

window.addEventListener('popstate', function(event) {
    if(event.state && event.state.page === "login") {
        login();
    }
    else if(event.state && event.state.page === "signup") {
        signup();
    }
    else if(event.state && event.state.page === "homepage") {
        homepage();
    }
    else {
        const main = document.querySelector("main");
        main.setAttribute("class","fade");
        main.innerHTML = `
        <h1>CORS App</h1>
        <p>High Intensity Training App</p><br>
        <button id="begin" class="buttonStyle1">Begin</button>
        `;
        const loginButton = document.querySelector("#begin");
        loginButton.addEventListener("click", login);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector("#begin");
    if (loginButton) {
        loginButton.addEventListener("click", login);
    }
    const signupButton = document.querySelector("#signup");
    if (signupButton) {
        signupButton.addEventListener("click", signup);
    }
});