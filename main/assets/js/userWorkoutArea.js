import { activateWorkoutMenus, logoutHandler, notify, sidebarHandler } from './assets.js';

// Audio setup for workout beeps
const beepAudio = new Audio('/assets/audio/beep.wav');
const beepAudioFinal = new Audio('/assets/audio/finalbeep.wav');

// Randomly select a song for the workout
const songs = ['/assets/audio/music1.mp3', '/assets/audio/music2.mp3', '/assets/audio/music3.mp3'];
const music = new Audio(songs[Math.floor(Math.random() * songs.length)]);

// Fetch workout details from server
async function fetchWorkoutDetails(id) {
  const response = await fetch(`/getWorkout/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch workout details: ' + response.statusText);
  }
  const workoutDetails = await response.json();
  if (workoutDetails.length === 0) {
    throw new Error('No workouts found.');
  }
  let currentWorkoutIndex = 0;
  displayWorkout(workoutDetails[currentWorkoutIndex]);

  // Setup play button and workout logic
  const playButton = document.querySelector('#playButton');
  let isPlaying = false;
  let isFirstClick = true;
  let workoutInterval;
  let restInterval;
  let durationInSeconds = parseInt(workoutDetails[currentWorkoutIndex].Workout_Duration);
  let restDurationInSeconds = getUserDefinedRestTime();
  let inRest = false;
  let inCountdown = false;

  playButton.addEventListener('click', () => {
    if (inRest) {
      notify('Cannot pause whilst Resting', 'red');
    } else if (inCountdown) {
      notify('Cannot pause during preworkout', 'red');
    } else {
      if (!isPlaying) {
        if (isFirstClick) {
          isFirstClick = false;
          inCountdown = true;
          let preWorkoutCountdown = 3;
          const countdownInterval = setInterval(() => {
            document.querySelector('#screen').innerHTML = `<h1>Workout starts in ${preWorkoutCountdown}</h1>`;
            preWorkoutCountdown--;
            if (preWorkoutCountdown < 0) {
              clearInterval(countdownInterval);
              inCountdown = false;
              isPlaying = true;
              startWorkoutInterval();
            }
          }, 1000);
        } else {
          isPlaying = true;
          startWorkoutInterval();
          displayWorkout(workoutDetails[currentWorkoutIndex + 1]);
        }
      } else {
        clearInterval(workoutInterval);
        clearInterval(restInterval);
        createPauseOverlay();
      }
    }
  });

  // Display workout information and manage timers
  function workoutInfo(workout, durationInSeconds, isRest) {
    const div = document.querySelector('#workoutTimer');
    const screen = document.querySelector('#screen');

    if (workout === null && durationInSeconds === null && isRest === null) {
      screen.innerHTML = '<h1>Workout Completed, Press Play To Restart.</h1>';
      playButton.addEventListener('click', () => {
        document.body.innerHTML = ``;
        location.reload();
      });
    } else {
      if (workout === null && durationInSeconds === null) {
        div.innerHTML = '';
        screen.innerHTML = `
                <h1>${isRest} Seconds</h1>
                `;
      } else {
        div.innerHTML = '';

        const timeRemaining = document.createElement('p');
        timeRemaining.setAttribute('id', 'specificTimer');
        timeRemaining.innerHTML = `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60 < 10 ? '0' + durationInSeconds % 60 : durationInSeconds % 60}`;
        const icon = document.querySelector('p');
        icon.innerHTML = '<i id="iconforTimer" class="fa-solid fa-clock"></i>';
        div.appendChild(icon);
        div.appendChild(timeRemaining);

        const validWorkouts = ['backflicks', 'battleropes', 'burpees', 'diamondpushups', 'highknees', 'lunges', 'mountainclimbers', 'planks', 'pushups', 'russiantwists', 'skippingrope', 'sprintintervals', 'squats'];
        const workoutNameFormatted = workout.Workout_Name.toLowerCase().replace(/[\s\-]/g, '');
        const imageName = validWorkouts.includes(workoutNameFormatted) ? workoutNameFormatted : 'default';

        screen.innerHTML = `
                <img src="/assets/img/gifs/${imageName}.gif">
                <p>${workout.Workout_Description}</p>
                <div id="extraInfo">
                <p><i class="fa-solid fa-pencil" style='transform: rotate(270deg);color: #b67806;'></i> ${workout.Workout_Name}</p>
                <p><i class="fa-solid fa-dumbbell" style='color: #b67806;'></i> ${workout.Workout_Sets}</p>
                </div>
                `;
      }
    }
  }

  // Manage workout intervals
  function startWorkoutInterval() {
    inRest = false;
    const currentWorkout = workoutDetails[currentWorkoutIndex];
    workoutInterval = setInterval(() => {
      durationInSeconds--;
      workoutInfo(currentWorkout, durationInSeconds);
      displayWorkout(workoutDetails[currentWorkoutIndex + 1]);
      if (durationInSeconds === 3 || durationInSeconds === 2 || durationInSeconds === 1) {
        beepAudio.play();
      } else if (durationInSeconds === 0) {
        beepAudioFinal.play();
      }

      if (durationInSeconds <= 0) {
        clearInterval(workoutInterval);
        if (currentWorkoutIndex < workoutDetails.length - 1) {
          currentWorkoutIndex++;
          notify('Rest Period', 'green');
          durationInSeconds = parseInt(workoutDetails[currentWorkoutIndex].Workout_Duration);
          displayWorkout(workoutDetails[currentWorkoutIndex]);
          startRestPeriod();
        } else {
          displayWorkout();
          workoutInfo(null, null, null);
        }
      }
    }, 1000);
  }

  // Manage rest intervals
  function startRestPeriod() {
    inRest = true;
    workoutInfo(null, null, restDurationInSeconds);
    restInterval = setInterval(() => {
      restDurationInSeconds--;
      workoutInfo(null, null, restDurationInSeconds);

      if (restDurationInSeconds === 3 || restDurationInSeconds === 2 || restDurationInSeconds === 1) {
        beepAudio.play();
      } else if (restDurationInSeconds === 0) {
        beepAudioFinal.play();
      }

      if (restDurationInSeconds <= 0) {
        clearInterval(restInterval);
        restDurationInSeconds = getUserDefinedRestTime();
        startWorkoutInterval();
      }
    }, 1000);
  }

  // Create pause overlay during workout
  function createPauseOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'pauseOverlay';
    overlay.className = 'overlay';
    overlay.innerHTML = `
            <div id="pauseMessage">
            <h1>Workout Paused</h1>
            <button id="resumeButton">Resume</button>
            </div>
        `;
    document.body.appendChild(overlay);
    document.querySelector('#resumeButton').addEventListener('click', () => {
      removePauseOverlay();
      isPlaying = true;
      startWorkoutInterval();
    });
  }

  // Remove pause overlay
  function removePauseOverlay() {
    const overlay = document.querySelector('#pauseOverlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

// Get user-defined rest time
function getUserDefinedRestTime() {
  const adjustRestTimeButton = document.querySelector('#adjustRestTime');
  adjustRestTimeButton.addEventListener('click', (event) => {
    event.stopPropagation();

    const existingOverlay = document.querySelector('#overlay');
    if (existingOverlay) {
      existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.innerHTML = `
            <select id="restTimeSelector">
                <option value="5">5s</option>
                <option value="10">10s</option>
                <option value="15">15s</option>
                <option value="20">20s</option>
                <option value="30">30s</option>
                <option value="45">45s</option>
                <option value="60">1min</option>
                <option value="120">2min</option>
            </select>
            <button id="applyRestTimeButton">Apply</button>
        `;
    document.body.appendChild(overlay);

    const applyButton = document.getElementById('applyRestTimeButton');
    applyButton.addEventListener('click', () => {
      const selectedTime = parseInt(document.getElementById('restTimeSelector').value);
      adjustRestTimeButton.value = selectedTime;
      overlay.remove();
      notify('Rest time changed', 'green');
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  });
  return parseInt(adjustRestTimeButton.value) || 5;
}

// Display workout details in UI
function displayWorkout(workout) {
  if (!workout) {
    const workoutInfo = `
        <img src="/assets/img/workoutImgs/finished.jpg">
        <div id="textNext">
            <p>Final Workout</p>
        </div>    
        `;
    document.querySelector('#upNext').classList = 'fade';
    document.querySelector('#upNext').innerHTML = workoutInfo;
  } else {
    const workoutImageSrc = workout.Workout_ID > 13 ? '/assets/img/selection3.png' : `/assets/img/workoutImgs/${workout.Workout_ID}.jpg`;
    const workoutInfo = `
        <img src="${workoutImageSrc}">
        <div id="textNext">
            <h1>Up Next</h1>
            <p>${workout.Workout_Name}</p>
        </div>    
        `;
    document.querySelector('#upNext').classList = 'fade';
    document.querySelector('#upNext').innerHTML = workoutInfo;
  }
}

// Show all workouts in an overlay
function showAllWorkoutsButton(workoutDetails) {
  document.querySelector('#showAllWorkouts').addEventListener('click', function () {
    const overlay = document.createElement('div');
    overlay.className = 'fade';
    overlay.id = 'overlay';
    const allWorkoutsDiv = document.createElement('div');
    allWorkoutsDiv.id = 'allWorkoutsContainer';

    workoutDetails.forEach(workout => {
      const workoutElement = document.createElement('div');
      workoutElement.id = 'workoutElementCard';
      workoutElement.innerHTML = `
            <img src="/assets/img/workoutImgs/${workout.Workout_ID}.jpg">
            <h3>${workout.Workout_Name}</h3>
            <p>${workout.Workout_Duration / 60} Minutes</p>`;
      allWorkoutsDiv.appendChild(workoutElement);
    });

    overlay.appendChild(allWorkoutsDiv);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        overlay.remove();
      }
    });
  });
}

// Adjust music volume
function adjustMusic() {
  seMusic(localStorage.getItem('userVolume'));
  const button = document.querySelector('#adjustVolume');
  button.addEventListener('click', function () {
    const overlay = document.createElement('div');
    overlay.id = 'volumeOverlay';
    overlay.className = 'overlay';

    const label = document.createElement('label');
    label.htmlFor = 'volumeSlider';
    label.textContent = 'Music';
    overlay.appendChild(label);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.01';
    slider.value = localStorage.getItem('userVolume') || '0.5';
    slider.id = 'volumeSlider';
    slider.className = 'volume-slider';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Volume';
    saveButton.id = 'saveVolumeButton';
    saveButton.className = 'save-button';
    saveButton.addEventListener('click', () => {
      notify('Volume changed', 'green');
      seMusic(slider.value);
      localStorage.setItem('userVolume', slider.value);
      overlay.remove();
    });

    slider.addEventListener('input', () => {
      seMusic(slider.value);
    });

    overlay.appendChild(slider);
    overlay.appendChild(saveButton);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });
  });

  // Set music volume
  function seMusic(volumeLevel) {
    music.volume = volumeLevel;
  }
}

// Adjust beep volume
function adjustBeep() {
  seMusic(localStorage.getItem('userVolumeBeep'));
  const button = document.querySelector('#adjustVolume');
  button.addEventListener('click', function () {
    const overlay = document.querySelector('#volumeOverlay');

    const label = document.createElement('label');
    label.htmlFor = 'volumeSliderBeep';
    label.textContent = 'Coutndown';
    overlay.appendChild(label);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.01';
    slider.value = localStorage.getItem('userVolumeBeep') || '0.5';
    slider.id = 'volumeSliderBeep';
    slider.className = 'volume-slider';

    const musicSlider = document.querySelector('#volumeSlider');
    overlay.insertBefore(label, musicSlider.nextSibling);
    overlay.insertBefore(slider, label.nextSibling);

    const saveButton = document.querySelector('#saveVolumeButton');
    saveButton.addEventListener('click', () => {
      seMusic(slider.value);
      localStorage.setItem('userVolumeBeep', slider.value);
      overlay.remove();
    });

    slider.addEventListener('input', () => {
      seMusic(slider.value);
    });

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });
  });

  // Set beep volume
  function seMusic(volumeLevel) {
    beepAudio.volume = volumeLevel;
    beepAudioFinal.volume = volumeLevel;
  }
}


document.addEventListener('DOMContentLoaded', async function () {
  const check = localStorage.getItem('userLoggedIn');
  document.addEventListener('click', function playMusic() {
    music.play();
    document.body.removeEventListener('click', playMusic);
  });
  if (check === 'true') {
    activateWorkoutMenus();
    sidebarHandler();
    logoutHandler();
    adjustMusic();
    adjustBeep();
    document.querySelector('#userNameGreet').innerHTML = `${localStorage.getItem('userName')}`;
    notify('Workout Loaded', 'green');
    const params = new URLSearchParams(document.location.search);
    const id = params.get('planID');
    if (id) {
      try {
        const response = await fetch(`/getWorkout/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch workout details: ' + response.statusText);
        }
        const workoutDetails = await response.json();
        if (workoutDetails.length === 0) {
          throw new Error('No workouts found.');
        }
        const totalDuration = workoutDetails.reduce((acc, workout) => acc + parseInt(workout.Workout_Duration, 10), 0);
        const time = document.createElement('h1');
        time.textContent = totalDuration / 60 + ' Minutes';
        time.style.fontSize = '4vh';
        time.style.color = '#b67806';
        const pressPlay = document.createElement('p');
        pressPlay.style.color = '#525252';
        pressPlay.textContent = 'Press play to begin';
        document.querySelector('#screen').append(time);
        document.querySelector('#screen').append(pressPlay);
        getUserDefinedRestTime();
        fetchWorkoutDetails(id);
        showAllWorkoutsButton(workoutDetails);
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error('No PlanID provided in the query parameters.');
    }
  } else {
    alert('not logged in');
    window.location.href = '/';
  }
});
