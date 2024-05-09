import { notify } from './assets.js';

// Toggles the menu icon based on window width
function addOrRemoveMenuIcon() {
  const navbar = document.querySelector('nav');
  const windowWidth = window.innerWidth;

  if (windowWidth <= 850) {
    let triple = document.querySelector('.menu-icon');
    if (!triple) {
      triple = document.createElement('div');
      triple.setAttribute('class', 'menu-icon');
      navbar.appendChild(triple);

      triple.addEventListener('click', () => {
        triple.style.opacity = '0';
        document.body.classList.add('menu-visible');
        const closeMenu = document.querySelector('#closeMobile');
        closeMenu.addEventListener('click', () => {
          document.body.classList.remove('menu-visible');
          triple.style.opacity = '1';
        });
      });
    }
  } else {
    const triple = document.querySelector('.menu-icon');
    if (triple) {
      navbar.removeChild(triple);
    }
  }
}

// Creates an input field with an icon
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

// Creates a button with specified attributes
function createButton(id, className, text) {
  const button = document.createElement('button');
  button.id = id;
  button.className = className;
  button.textContent = text;
  return button;
}

// Handles the signup process
function signup() {
  const main = document.querySelector('main');
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
  sTextP.style.top = '100%';

  inputCard.appendChild(inputContainer);
  inputCard.appendChild(sTextP);
  main.appendChild(inputCard);

  loginButton.addEventListener('click', login);

  // Validates and submits the signup form
  function validateSignUp() {
    main.querySelector('#confirmSignup').addEventListener('click', async () => {
      const usernameField = main.querySelector('#username');
      const emailField = main.querySelector('#email');
      const passwordField = main.querySelector('#password');
      const confirmPasswordField = main.querySelector('#confirmPassword');
      const dobField = main.querySelector('#dob');

      const username = usernameField.value;
      const email = emailField.value;
      const password = passwordField.value;
      const confirmPassword = confirmPasswordField.value;
      const dob = dobField.value;

      if (!username || !email || !password || !confirmPassword || !dob) {
        notify('All fields Required', 'red');
        return;
      }

      // Email validation regex
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        notify('Invalid email format', 'red');
        return;
      }

      if (password !== confirmPassword) {
        notify('Password Does Not Match', 'red');
        return;
      }

      const payload = {
        username,
        email,
        password,
        dob,
      };
      console.log(payload);

      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        notify('Signed Up Successfully!', 'green');
          usernameField.value = '';
          emailField.value = '';
          passwordField.value = '';
          confirmPasswordField.value = '';
          dobField.value = '';
          login();
      } else if (response.status === 400) {
        notify('Username already exists', 'red');
      } else {
        notify('Failed to sign up. Please try again.', 'red');
      }
    });
  }

  validateSignUp();
}

// Handles the login process
function login() {
  const main = document.querySelector('main');
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
  sTextP.appendChild(signupButton);

  inputCard.appendChild(inputContainer);
  inputCard.appendChild(sTextP);
  main.appendChild(inputCard);

  signupButton.addEventListener('click', signup);
  const confirmLoginButton = main.querySelector('#confirmLogin');
  // Attempts to log in with provided credentials
  async function attemptLogin() {
    const username = main.querySelector('#username').value.trim();
    const password = main.querySelector('#password').value.trim();

    if (!username || !password) {
      notify('All fields Required', 'red');
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
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userName', payload.username);
      location.href = '/homepage';
    } else {
      notify('Incorrect Details.', 'red');
    }
  }

  confirmLoginButton.addEventListener('click', attemptLogin);
  document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      attemptLogin();
    }
  });
}

// Initializes the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  addOrRemoveMenuIcon();
  const loginButton = document.querySelector('#begin');
  if (loginButton) {
    loginButton.addEventListener('click', login);
  }
  const signupButton = document.querySelector('#signup');
  if (signupButton) {
    signupButton.addEventListener('click', signup);
  }
});
window.addEventListener('resize', addOrRemoveMenuIcon);
