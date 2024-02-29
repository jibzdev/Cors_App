import { notify } from './notification.mjs';

function createInputWithIcon(iconClass, type, placeholder, id) {
    const div = document.createElement('div');
    div.className = 'input-with-icon';
    const i = document.createElement('i');
    i.className = iconClass;
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.id = id;
    input.required = true;
    div.appendChild(i);
    div.appendChild(input);
    return div;
}

function createButton(id, className, text) {
    const button = document.createElement('button');
    button.id = id;
    button.className = className;
    button.textContent = text;
    return button;
}

async function signup() {
    const main = document.querySelector("main");
    main.innerHTML = '';

    const inputCard = document.createElement('div');
    inputCard.id = 'inputCard';
    inputCard.className = 'fade';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const logoLink = document.createElement('a');
    logoLink.href = 'index';
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/img/logo1.png';
    logoImg.alt = 'Cors App Logo 1';
    logoImg.style.width = '7.5vh';
    logoLink.appendChild(logoImg);

    inputContainer.appendChild(logoLink);
    inputContainer.appendChild(createInputWithIcon('fas fa-user', 'text', 'Username', 'username'));
    inputContainer.appendChild(createInputWithIcon('fas fa-envelope', 'email', 'Email', 'email'));
    inputContainer.appendChild(createInputWithIcon('fas fa-lock', 'password', 'Password', 'password'));
    inputContainer.appendChild(createInputWithIcon('fas fa-lock', 'password', 'Confirm Password', 'confirmPassword'));
    inputContainer.appendChild(createInputWithIcon('fas fa-cake', 'date', 'Date Of Birth', 'dob'));
    inputContainer.appendChild(createButton('confirmSignup', 'buttonStyle2', 'Sign Up'));

    const sTextP = document.createElement('p');
    sTextP.id = 'sText';
    sTextP.innerHTML = 'Already have an account?<br>';
    const loginButton = createButton('login', '', 'LOGIN');
    sTextP.appendChild(loginButton);
    sTextP.style.top = "100%";

    inputCard.appendChild(inputContainer);
    inputCard.appendChild(sTextP);
    main.appendChild(inputCard);

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
    main.innerHTML = '';
    const inputCard = document.createElement('div');
    inputCard.id = 'inputCard';
    inputCard.className = 'fade';

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const logoLink = document.createElement('a');
    logoLink.href = 'index';
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/img/logo1.png';
    logoImg.alt = 'Cors App Logo 1';
    logoImg.style.width = '7.5vh';
    logoLink.appendChild(logoImg);

    inputContainer.appendChild(logoLink);
    inputContainer.appendChild(createInputWithIcon('fas fa-user', 'text', 'Username', 'username'));
    inputContainer.appendChild(createInputWithIcon('fas fa-lock', 'password', 'Password', 'password'));
    inputContainer.appendChild(createButton('confirmLogin', 'buttonStyle2', 'Login'));

    const sTextP = document.createElement('p');
    sTextP.id = 'sText';
    sTextP.innerHTML = "Don't have an Account?<br>";
    const signupButton = createButton('signup', '', 'REGISTER');
    let googleRegB = document.createElement("a");
    googleRegB.setAttribute("id","googleRegButton");
    googleRegB.innerHTML = `<i class="fa-brands fa-google fa-2xl"></i>`;
    sTextP.appendChild(signupButton);
    sTextP.appendChild(googleRegB);
    sTextP.style.display = "flex";
    sTextP.style.top = "85%";
    sTextP.style.flexDirection = "column";
    sTextP.style.alignItems = "center";
    sTextP.style.flexWrap = "wrap";
    sTextP.style.top = "100%";
    sTextP.style.gap = "10px";

    inputCard.appendChild(inputContainer);
    inputCard.appendChild(sTextP);
    main.appendChild(inputCard);

    signupButton.addEventListener("click", signup);
    const confirmLoginButton = main.querySelector("#confirmLogin");
    async function attemptLogin() {
        const username = main.querySelector("#username").value.trim();
        const password = main.querySelector("#password").value.trim();

        if (!username || !password) {
            notify("All fields Required", "red");
            return;
        }

        const payload = {
            username,
            password,
        };

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("userName", payload.username);
            location.href = "createPlan.html";
        } else {
            notify("Incorrect Details.", "red");
        }
    }

    confirmLoginButton.addEventListener("click", attemptLogin);
    document.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            attemptLogin();
        }
    });
    // history.pushState({page: "login"}, "login", "login");
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