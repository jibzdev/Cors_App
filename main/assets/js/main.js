import * as hashPass from '/assets/js/hashPass.mjs';

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
        <h1>Cors App</h1>
        <p>High Intensity Training App</p>

        <input type="text" placeholder="Username" id="username">
        <input type="email" placeholder="Email" id="email">
        <input type="password" placeholder="Password" id="password">
        <input type="password" placeholder="Confirm Password">
        <input type="date" placeholder="Date Of Birth" id="dob">
        <button id="confirmSignup">Sign Up</button>
        <p>Already have an Account?<button id="login">Login</button></p>
        `;
        const loginButton = main.querySelector("#login");
        loginButton.addEventListener("click", login);

        function validateSignUp() {
            main.querySelector("#confirmSignup").addEventListener("click", async () => {
                const payload = {
                    username: main.querySelector("#username").value,
                    email: main.querySelector("#email").value,
                    password: main.querySelector("#password").value,
                    dob: main.querySelector("#dob").value,
                }
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json',},
                    body: JSON.stringify(payload),
                });
                console.log(response);
            })

        }

        validateSignUp();

    history.pushState({page: "signup"}, "signup", "signup");
};

async function login() {
    const main = document.querySelector("main");
    main.innerHTML = `
        <h1>Cors App</h1>
        <p>High Intensity Training App</p>

        <input type="text" placeholder="Username" id="username">
        <input type="password" placeholder="Password" id="password">
        <button id="confirmLogin">Login</button>
        <p>Dont have an Account?<button id="signup">Sign Up</button></p>
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
        showUsers.textContent = users.User_Name;
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
        main.innerHTML = `
        <h1>Cors App</h1>
        <p>High Intensity Training App</p>
        <button id="login">Login</button>
        `;
        const loginButton = document.querySelector("#login");
        loginButton.addEventListener("click", login);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector("#login");
    if (loginButton) {
        loginButton.addEventListener("click", login);
    }
    const signupButton = document.querySelector("#signup");
    if (signupButton) {
        signupButton.addEventListener("click", signup);
    }
});