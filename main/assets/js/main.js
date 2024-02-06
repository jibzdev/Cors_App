async function signup() {
    const main = document.querySelector("main");
    main.innerHTML = `
        <h1>Cors App</h1>
        <p>High Intensity Training App</p>

        <input type="text" placeholder="Username">
        <input type="email" placeholder="Email"> <!-- Changed type from password to email -->
        <input type="password" placeholder="Password">
        <input type="password" placeholder="Confirm Password">
        <input type="date" placeholder="Date Of Birth"> <!-- Changed type from password to date -->
        <button id="confirmSignup">Sign Up</button> <!-- Changed id from confirmLogin to confirmSignup -->
        <p>Already have an Account?<button id="login">Login</button></p>
        `;
        const loginButton = main.querySelector("#login");
        loginButton.addEventListener("click", login);
    history.pushState({page: "signup"}, "signup", "signup");
};

async function login() {
    const main = document.querySelector("main");
    main.innerHTML = `
        <h1>Cors App</h1>
        <p>High Intensity Training App</p>

        <input type="text" placeholder="Username">
        <input type="password" placeholder="Password">
        <button id="confirmLogin">Login</button>
        <p>Dont have an Account?<button id="signup">Sign Up</button></p>
        `;
        const signupButton = main.querySelector("#signup");
        signupButton.addEventListener("click", signup);
    history.pushState({page: "login"}, "login", "login");
};

window.addEventListener('popstate', function(event) {
    if(event.state && event.state.page === "login") {
        login();
    }
    else if(event.state && event.state.page === "signup") {
        signup();
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