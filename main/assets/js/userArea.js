import { notify, logoutHandler, sidebarHandler, dayHandler } from './assets.js';

// Function to create a workout card element
function createWorkoutCard(imageSrc, category, title, description, workoutDuration, id) {
  const workoutCard = document.createElement('div');
  workoutCard.classList.add('workoutCards');
  workoutCard.id = id;

  const image = document.createElement('img');
  image.src = imageSrc;

  const container = document.createElement('div');
  container.classList.add('container');

  const categoryLink = document.createElement('a');
  categoryLink.textContent = category;

  const titleElement = document.createElement('h1');
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = description;

  const duration = document.createElement('p');
  duration.setAttribute('id', 'workoutCardTimer');
  duration.textContent = `${workoutDuration}`;

  container.appendChild(categoryLink);
  container.appendChild(titleElement);
  container.appendChild(descriptionElement);

  workoutCard.appendChild(image);
  workoutCard.appendChild(duration);
  workoutCard.appendChild(container);

  return workoutCard;
}

// Function to handle homepage setup
function homepage(username) {
  history.pushState({ page: 'homepage' }, 'homepage', '/homepage');
  logoutHandler();
  dayHandler();

  document.querySelector('#userNameGreet').innerHTML = `Hello ${username}`;
  document.querySelector('#content').innerHTML = `
    ${createWorkoutCard('./assets/img/selection1.png', '', 'New Workout', 'Create your own HIIT workout plan.', '', 'newWorkout').outerHTML}
    ${createWorkoutCard('./assets/img/selection2.png', '', 'Saved Workout', 'Access your saved HIIT workout plans.', '', 'savedWorkout').outerHTML}
    ${createWorkoutCard('./assets/img/selection3.png', '', 'Create Workout', 'Design your perfect optimized workout.', '', 'createNewWorkout').outerHTML}`;

  const newWorkoutButton = document.querySelector('#newWorkout');
  const savedWorkoutsButton = document.querySelector('#savedWorkout');
  const createNewWorkoutButton = document.querySelector('#createNewWorkout');

  savedWorkoutsButton.addEventListener('click', () => {
    location.href = '/savedWorkouts';
  });

  createNewWorkoutButton.addEventListener('click', () => {
    location.href = '/createNewWorkout';
  });

  newWorkoutButton.addEventListener('click', async () => {
    history.pushState({ page: 'newWorkout' }, 'newWorkout', '/newWorkout');
    await newWorkout(username);
  });
}

// Function to handle new workout creation
function newWorkout(username) {
  document.querySelector('#content').innerHTML = '';

  const selectionArea = document.querySelector('#content');
  const selectedWorkoutsDiv = document.querySelector('#selectedWorkouts');

  if (selectedWorkoutsDiv) selectedWorkoutsDiv.remove();

  const nameWorkoutDiv = document.createElement('div');
  nameWorkoutDiv.setAttribute('id', 'nameWorkout');

  const label = document.createElement('label');
  label.setAttribute('for', 'workoutName');
  label.textContent = 'Name your workout plan:';

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'workoutName');
  input.setAttribute('name', 'workoutName');
  input.setAttribute('placeholder', 'My Workout Plan');

  nameWorkoutDiv.appendChild(label);
  nameWorkoutDiv.appendChild(input);
  selectionArea.appendChild(nameWorkoutDiv);

  const workoutNameInput = document.querySelector('#workoutName');
  workoutNameInput.addEventListener('change', async () => {
    const workoutName = workoutNameInput.value.trim();
    if (workoutName) {
      history.pushState({ page: 'createPlan', workoutName }, 'createPlan', '/createPlan');
      await createPlan(workoutName, username);
    }
  });
}

// Function to create a workout plan
async function createPlan(workoutName, username) {
  let totalWorkoutTime = { value: 0 }; // Changed to an object to maintain reference
  const customArea = document.createElement('section');
  customArea.id = `customArea`;
  const selectionArea = document.querySelector('#content');
  selectionArea.innerHTML = ``;
  selectionArea.append(customArea);
  document.querySelector('#content').style.marginTop = '2vw';

  const selected = document.createElement('div');
  selected.setAttribute('id', 'selectedWorkouts');
  document.querySelector('#content').append(selected);

  const workoutCardsDiv = document.createElement('div');
  workoutCardsDiv.setAttribute('id', 'workoutCardsDiv');
  selectionArea.appendChild(workoutCardsDiv);

  let pointer = document.createElement('p');
  pointer.setAttribute('id', 'pointer');
  pointer.textContent = 'Select your workouts from below.';
  document.querySelector('#userArea').after(selected);

  const workoutInfo = document.createElement('div');
  workoutInfo.setAttribute('id', 'workoutInfo');

  const planParagraph = document.createElement('p');
  planParagraph.textContent = `Plan: ${workoutName}`;

  const timeParagraph = document.createElement('p');
  timeParagraph.textContent = 'Workout Time: ';

  const timeSpan = document.createElement('span');
  timeSpan.setAttribute('id', 'totalWorkoutTime');
  timeSpan.style.color = '#b67806';
  timeSpan.textContent = '0 minutes';
  timeParagraph.appendChild(timeSpan);

  const createButton = document.createElement('button');
  createButton.setAttribute('id', 'createWorkout');
  createButton.textContent = 'Create';

  workoutInfo.appendChild(planParagraph);
  workoutInfo.appendChild(timeParagraph);
  workoutInfo.appendChild(createButton);
  selected.appendChild(workoutInfo);
  selected.appendChild(pointer);
  const workouts = await fetch('/workouts');
  const workoutData = await workouts.json();
  const customWorkoutCards = workoutData.filter(workout => workout.isCustom === "TRUE").map((workout, index) => {
    const imageIndex = index + 1;
    return createWorkoutCard(
            `./assets/img/selection3.png`,
            workout.Workout_Sets,
            workout.Workout_Name,
            workout.Workout_Description,
            `${workout.Workout_Duration / 60} Minutes`,
            `${workout.Workout_ID}`,
    );
  });
  const regularWorkoutCards = workoutData.filter(workout => workout.isCustom !== "TRUE").map((workout, index) => {
    const imageIndex = index + 1;
    return createWorkoutCard(
            `./assets/img/workoutImgs/${imageIndex}.jpg`,
            workout.Workout_Sets,
            workout.Workout_Name,
            workout.Workout_Description,
            `${workout.Workout_Duration / 60} Minutes`,
            `${workout.Workout_ID}`,
    );
  });
  const addedWorkouts = new Map();
  if (customWorkoutCards.length === 0) {
    customArea.innerHTML = `<p style="font-family: 'Kanit';color: grey;">No custom workouts available.</p>`;
  } else {
    customWorkoutCards.forEach(card => {
      customArea.append(card);
      addCardEventListener(card, addedWorkouts, totalWorkoutTime, selected, pointer);
    });
  }
  regularWorkoutCards.forEach(card => {
    workoutCardsDiv.append(card);
    addCardEventListener(card, addedWorkouts, totalWorkoutTime, selected, pointer);
  });

  document.querySelector('#createWorkout').addEventListener('click', async () => {
    if (addedWorkouts.size === 0) {
      notify('No Workouts added!', 'red');
      return;
    }

    const IDPayload = {
      username,
    };
    const response = await fetch('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(IDPayload),
    });
    if (response.ok) {
      const userData = await response.json();
      const userID = `${userData.userID}`;
      const workoutIds = Array.from(addedWorkouts.values());
      const planPayload = {
        userID,
        Plan_Name: workoutName,
        Workouts: workoutIds,
      };
      console.log(planPayload);
      const planResponse = await fetch('/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planPayload),
      });
      if (planResponse.ok) {
        const planData = await planResponse.json();
        if (planData && planData.planID) {
          const planID = planData.planID;
          window.location.href = `/assets/pages/userWorkoutArea.html?planID=${planID}`;
          notify('Failed to retrieve plan ID.', 'red');
        }
      } else {
        notify('Failed to create workout plan.', 'red');
      }
    } else {
      notify('Error fetching user data', 'red');
    }
  });
}

function addCardEventListener(card, addedWorkouts, totalWorkoutTime, selected, pointer) {
  card.addEventListener('click', () => {
    const workoutTitle = card.querySelector('h1').textContent;
    const workoutId = card.id;
    const workoutTime = parseInt(card.querySelector('p').textContent);
    const workoutSets = card.querySelector('a').textContent;
    const workoutImageSrc = card.querySelector('img').src;

    if (!addedWorkouts.has(workoutTitle)) {
      addedWorkouts.set(workoutTitle, workoutId);
      totalWorkoutTime.value += workoutTime; // Correctly updating the object property

      document.querySelector('#totalWorkoutTime').textContent = totalWorkoutTime.value + ' minutes';

      const workoutDiv = document.createElement('div');
      workoutDiv.setAttribute('class', 'selectedCards');

      const workoutImage = document.createElement('img');
      workoutImage.src = workoutImageSrc;
      workoutImage.alt = 'Workout Image';
      workoutDiv.appendChild(workoutImage);

      const textContentDiv = document.createElement('div');
      textContentDiv.setAttribute('class', 'textContent');

      const textContentDetails2 = document.createElement('div');
      textContentDetails2.setAttribute('id', 'textContentDetails2');

      const workoutTimeP = document.createElement('p');
      workoutTimeP.style.color = '#b67806';
      workoutTimeP.textContent = `${workoutTime} minutes`;

      textContentDetails2.appendChild(workoutTimeP);

      const textContentDetails1 = document.createElement('div');
      textContentDetails1.setAttribute('id', 'textContentDetails1');

      const workoutTitleH1 = document.createElement('h1');
      workoutTitleH1.textContent = workoutTitle;

      const workoutRepsP = document.createElement('p');
      workoutRepsP.textContent = workoutSets;

      textContentDetails1.appendChild(workoutTitleH1);
      textContentDetails1.appendChild(workoutRepsP);
      textContentDiv.appendChild(textContentDetails2);
      textContentDiv.appendChild(textContentDetails1);
      workoutDiv.appendChild(textContentDiv);

      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      textContentDetails2.appendChild(removeButton);
      let poo = document.createElement("div");
      poo.id = "changeMe";
      poo.appendChild(workoutDiv);
      selected.append(poo);

      notify(`Added ${workoutTitle}`, 'green');
      if (pointer) {
        pointer.remove();
        pointer = null;
      }
      removeButton.addEventListener('click', () => {
        addedWorkouts.delete(workoutTitle);
        totalWorkoutTime.value -= workoutTime;
        document.querySelector('#totalWorkoutTime').textContent = totalWorkoutTime.value + ' minutes';
        notify(`Removed ${workoutTitle}`, 'red');
        workoutDiv.remove();
      });
    } else {
      notify(`${workoutTitle} has already been added.`, 'red');
    }
  });
}

// Event listener for handling browser back and forward operations
window.addEventListener('popstate', function (event) {
  if (event.state) {
    const username = localStorage.getItem('userName');
    switch (event.state.page) {
      case 'homepage':
        homepage(username);
        break;
      case 'newWorkout':
        newWorkout(username);
        break;
      case 'createPlan':
        createPlan(event.state.workoutName, username);
        break;
      default:
        console.log('No such page state exists.');
    }
  }
});

// Initial setup when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  sidebarHandler();
  const check = localStorage.getItem('userLoggedIn');
  const username = localStorage.getItem('userName');

  if (check === 'true') {
    homepage(username);
  } else {
    alert('not logged in');
    window.location.href = '/';
  }
});
