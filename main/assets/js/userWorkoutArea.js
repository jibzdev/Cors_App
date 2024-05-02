// WORKING ON FIXING

import { activateWorkoutMenus, logoutHandler, notify, sidebarHandler } from './assets.js';
const beepAudio = new Audio('/assets/audio/beep.wav');
const beepAudioFinal = new Audio('/assets/audio/finalbeep.wav');
const songs = ['/assets/audio/music1.mp3', '/assets/audio/music2.mp3', '/assets/audio/music3.mp3'];
const music = new Audio(songs[Math.floor(Math.random() * songs.length)]);

async function fetchWorkoutDetails(id) {
  const response = await fetch(`./getWorkout/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch workout details: ' + response.statusText);
  }
  const workoutDetails = await response.json();
  if (workoutDetails.length === 0) {
    throw new Error('No workouts found.');
  }
  let currentWorkoutIndex = 0;
  displayWorkout(workoutDetails[currentWorkoutIndex]);

  const playButton = document.querySelector('#playButton');
  let isPlaying = false;
  let isFirstClick = true;
  let workoutInterval;
  let restInterval;
  let durationInSeconds = 5; // for testing, initial duration in seconds
  let restDurationInSeconds = getUserDefinedRestTime(); // convert minutes to seconds
  let inRest = false;

  playButton.addEventListener('click', () => {
    if (inRest) {
      notify('cant pause in rest', 'red');
    } else {
      if (!isPlaying) {
        if (isFirstClick) {
          isFirstClick = false;
          let preWorkoutCountdown = 3;
          const countdownInterval = setInterval(() => {
            document.querySelector('#screen').innerHTML = `Workout starts in ${preWorkoutCountdown}...`;
            preWorkoutCountdown--;
            if (preWorkoutCountdown < 0) {
              clearInterval(countdownInterval);
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

  function workoutInfo(workout, durationInSeconds, isRest) {
    const div = document.querySelector('#workoutTimer');
    const screen = document.querySelector('#screen');

    if (workout === null && durationInSeconds === null && isRest === null) {
      screen.innerHTML = 'Workout Completed, Press Play To Restart.';
      playButton.addEventListener('click', () => {
        location.reload();
      });
    } else {
      if (workout === null && durationInSeconds === null) {
        div.innerHTML = '';
        screen.innerHTML = `
                <p>${isRest} Seconds</p>
                `;
      } else {
        div.innerHTML = '';

        const timeRemaining = document.createElement('p');
        timeRemaining.setAttribute('id', 'specificTimer');
        timeRemaining.innerHTML = `${Math.floor(durationInSeconds / 60)}:${durationInSeconds % 60 < 10 ? '0' + durationInSeconds % 60 : durationInSeconds % 60}`;
        const icon = document.querySelector('p');
        icon.innerHTML = `<i id="iconforTimer" class="fa-solid fa-clock"></i>`;
        div.appendChild(icon);
        div.appendChild(timeRemaining);

        const imagineName = workout.Workout_Name.toLowerCase().replace(/\s/g, '');
        screen.innerHTML = `
                <img src="/assets/img/gifs/${imagineName}.gif">
                <p>${workout.Workout_Description}</p>
                <div id="extraInfo">
                <p>${workout.Workout_Name}</p>
                <p>${workout.Workout_Sets}</p>
                </div>
                `;
      }
    }
  }

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
          durationInSeconds = 5; // reset to initial duration in seconds
          displayWorkout(workoutDetails[currentWorkoutIndex]);
          startRestPeriod();
        } else {
          displayWorkout();
          workoutInfo(null, null, null); // Call with all null to indicate completion
        }
      }
    }, 1000);
  }

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
        restDurationInSeconds = getUserDefinedRestTime(); // reset rest duration in seconds
        startWorkoutInterval();
      }
    }, 1000);
  }

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

  function removePauseOverlay() {
    const overlay = document.querySelector('#pauseOverlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

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
  return parseInt(adjustRestTimeButton.value) || 5; // CHANGE ME
}

function displayWorkout(workout) {
  if (!workout) {
    const workoutInfo = `
        <img src="assets/img/workoutImgs/finished.jpg">
        <div id="textNext">
            <p>Final Workout</p>
        </div>    
        `;
    document.querySelector('#upNext').classList = 'fade';
    document.querySelector('#upNext').innerHTML = workoutInfo;
  } else {
    const workoutInfo = `
        <img src="assets/img/workoutImgs/${workout.Workout_ID}.jpg">
        <div id="textNext">
            <h1>Up Next</h1>
            <p>${workout.Workout_Name}</p>
        </div>    
        `;
    document.querySelector('#upNext').classList = 'fade';
    document.querySelector('#upNext').innerHTML = workoutInfo;
  }
}

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
            <img src="assets/img/workoutImgs/${workout.Workout_ID}.jpg">
            <h3>${workout.Workout_Name}</h3>
            <p>${workout.Workout_Duration} Minutes</p>`;
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

  function seMusic(volumeLevel) {
    music.volume = volumeLevel;
  }
}

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
        const response = await fetch(`./getWorkout/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch workout details: ' + response.statusText);
        }
        const workoutDetails = await response.json();
        if (workoutDetails.length === 0) {
          throw new Error('No workouts found.');
        }
        const totalDuration = workoutDetails.reduce((acc, workout) => acc + parseInt(workout.Workout_Duration, 10), 0);
        const time = document.createElement('h1');
        time.textContent = totalDuration + ' Minutes';
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
