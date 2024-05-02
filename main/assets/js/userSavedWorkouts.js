// FIXED

import { logoutHandler, notify, sidebarHandler, dayHandler } from './assets.js';

function greetUser() {
  const userName = localStorage.getItem('userName');
  document.querySelector('#userNameGreet').textContent = `Hello ${userName}`;
}

async function fetchUserData() {
  const username = localStorage.getItem('userName');
  const payload = { username };
  const response = await fetch('/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

// eslint-disable-next-line camelcase
async function fetchWorkoutPlans(User_ID) {
  // eslint-disable-next-line camelcase
  const payload = { User_ID };
  const response = await fetch('/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return response.json();
}

function displayWorkoutPlans(workoutPlans) {
  const workoutsContainer = document.querySelector('#content');

  workoutPlans.forEach(plan => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'cards';

    const planName = document.createElement('h1');
    planName.textContent = plan.Plan_Name;
    cardDiv.appendChild(planName);

    const infoIcon = document.createElement('span');
    infoIcon.setAttribute('id', 'infoIcon');
    infoIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
    infoIcon.addEventListener('click', () => {
      const overlay = createOverlay();
      const workoutsList = createWorkoutsList(plan.Workouts);
      overlay.appendChild(workoutsList);
      document.body.appendChild(overlay);
    });
    planName.appendChild(infoIcon);

    const duration = document.createElement('p');
    duration.textContent = `Duration: ${plan.Total_Workout_Time} Minutes`;
    cardDiv.appendChild(duration);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load';
    loadButton.addEventListener('click', () => { window.location.href = `userWorkoutArea.html?planID=${plan.Plan_ID}`; });
    cardDiv.appendChild(loadButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.className = 'deleteButton';
    deleteButton.addEventListener('click', () => deleteWorkoutPlan(plan.Plan_ID));
    cardDiv.appendChild(deleteButton);

    workoutsContainer.appendChild(cardDiv);
  });
}

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.setAttribute('class', 'overlay');
  overlay.addEventListener('click', () => overlay.remove());
  return overlay;
}

function createWorkoutsList(workouts) {
  const workoutsList = document.createElement('div');
  workoutsList.setAttribute('class', 'workoutLists');
  const workoutHeader = document.createElement('h1');
  workoutHeader.textContent = 'Workouts Included';
  workoutsList.append(workoutHeader);
  workouts.forEach(workout => {
    const workoutItem = document.createElement('p');
    workoutItem.style.textAlign = 'center';
    workoutItem.textContent = workout;
    workoutsList.appendChild(workoutItem);
  });
  return workoutsList;
}

async function deleteWorkoutPlan(planID) {
  const response = await fetch(`/plans/${planID}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    window.location.reload();
  } else {
    notify('Failed to delete workout', 'red');
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  history.pushState('savedWorkouts', 'savedWorkouts', '/savedWorkouts');
  logoutHandler();
  sidebarHandler();
  dayHandler();

  const check = localStorage.getItem('userLoggedIn');

  if (check === 'true') {
    greetUser();
    const userData = await fetchUserData();
    const workoutPlans = await fetchWorkoutPlans(userData.userID);
    displayWorkoutPlans(workoutPlans);
  } else {
    alert('not logged in');
    window.location.href = '/';
  }
});
