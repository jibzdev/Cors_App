import { logoutHandler, sidebarHandler, dayHandler, notify} from './assets.js';

// Event listener for window load
window.addEventListener('load', async () => {
  // Handlers for logout, sidebar, and day operations
  logoutHandler();
  sidebarHandler();
  dayHandler();
  
  // Set the admin page state in history
  history.pushState({ page: 'admin' }, 'admin', '/admin');
  
  // Retrieve and display the username from local storage
  const username = localStorage.getItem('userName');
  document.querySelector('#userNameGreet').innerHTML = `Hello ${username}`;
  
  // Check if the current user is valid
  const currentUserResponse = await fetch('/checkUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username })
  });
  
  // Handle response failure
  if (!currentUserResponse.ok) {
    notify("fetch failed", "red");
    location.href = "/";
    return;
  }
  
  // Validate the current user as admin
  const currentUser = await currentUserResponse.json();
  if (!currentUser || currentUser.User_Name !== 'admin') {
    alert("Access Denied.");
    location.href = "/";
    return;
  }
  
  // Fetch and display workout plans
  const plansContainer = document.querySelector('#logWorkouts');
  const response = await fetch('/plans');
  if (!response.ok) {
    notify("Failed to fetch plans.", "red");
    return;
  }

  // Event listener for updating workout durations
  document.querySelector('#alterWorkouts button').addEventListener('click', async () => {
    const updateResponse = await fetch('/updateWorkoutDurations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ duration: 5 })
    });

    // Handle update failure
    if (!updateResponse.ok) {
      notify("Failed to update workout durations.", "red");
      return;
    }

    // Notify success on duration update
    notify("durations set to 5 seconds.", "green");
  });

  // Process and display each plan
  const plans = await response.json();
  plans.forEach(plan => {
    const planDiv = document.createElement('div');
    planDiv.className = 'planCard';

    const planName = document.createElement('h1');
    planName.textContent = plan.Plan_Name;
    planDiv.appendChild(planName);

    const user = document.createElement('p');
    user.textContent = `${plan.User_ID}`;
    planDiv.appendChild(user);

    const totalWorkoutTime = document.createElement('p');
    totalWorkoutTime.textContent = `${plan.Plan_ID}`;
    planDiv.appendChild(totalWorkoutTime);

    plansContainer.appendChild(planDiv);
  });

  // Fetch and display user logs
  const usersContainer = document.querySelector('#logUsers');
  const response2 = await fetch('/users');
  const users = await response2.json();
  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'userCard';

    const id = document.createElement('h1');
    id.textContent = user.User_ID;
    userDiv.appendChild(id);

    const userName = document.createElement('p');
    userName.textContent = `${user.User_Name}`;
    userDiv.appendChild(userName);

    const email = document.createElement('p');
    email.textContent = `${user.User_Email}`;
    userDiv.appendChild(email);

    const dob = document.createElement('p');
    dob.textContent = `${user.User_DOB}`;
    userDiv.appendChild(dob);

    const password = document.createElement('p');
    password.textContent = `${user.User_Password}`;
    userDiv.appendChild(password);

    usersContainer.appendChild(userDiv);
  });
});
