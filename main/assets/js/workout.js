import { notify } from './notification.mjs';

async function fetchWorkoutDetails(id) {
    const response = await fetch(`./getWorkout/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch workout details: ' + response.statusText);
    }
    return response.json();
}

function updateWorkoutDisplay(workout, container) {
    container.innerHTML = `
        <h3>${workout.Workout_Name}</h3>
        <p>Description: ${workout.Workout_Description}</p>
        <p>Duration: <span id="workoutTimer">${workout.Workout_Duration}</span></p>
    `;
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds; 
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
        }
    }, 1000);
}

function calculateTotalDuration(workoutDetails) {
    return workoutDetails.reduce((total, workout) => total + parseInt(workout.Workout_Duration, 10), 0);
}

function displayTotalDuration(totalDuration) {
    const totalDurationElement = document.createElement('p');
    totalDurationElement.textContent = `Total Duration: ${totalDuration} minutes`;
    document.body.appendChild(totalDurationElement);
}

async function playWorkout(workoutDetails, currentWorkoutIndex, allWorkoutsContainer) {
    if (currentWorkoutIndex < workoutDetails.length) {
        const workout = workoutDetails[currentWorkoutIndex];
        updateWorkoutDisplay(workout, allWorkoutsContainer);
        const timerDisplay = document.getElementById('workoutTimer');
        startTimer(workout.Workout_Duration, timerDisplay);
        setTimeout(() => {
            startTimer(0.5, timerDisplay);
            setTimeout(() => {
                if (currentWorkoutIndex < workoutDetails.length - 1) {
                    playWorkout(workoutDetails, ++currentWorkoutIndex, allWorkoutsContainer);
                } else {
                    notify("Workout Plan Completed!", "blue");
                }
            }, 30000);
        }, workout.Workout_Duration * 60000);
    }
}

function skipToWorkout(workoutDetails, newIndex, allWorkoutsContainer) {
    if (newIndex >= 0 && newIndex < workoutDetails.length) {
        playWorkout(workoutDetails, newIndex, allWorkoutsContainer);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    document.querySelector("#userNameGreet").innerHTML = `Hello ${localStorage.getItem("userName")}`;
    notify("Workout Created!", "green");
    const params = new URLSearchParams(document.location.search);
    const id = params.get('planID');
    if (id) {
        try {
            const workoutDetails = await fetchWorkoutDetails(id);
            const allWorkoutsContainer = document.getElementById('allWorkouts');
            let currentWorkoutIndex = 0;

            const totalDuration = calculateTotalDuration(workoutDetails);
            displayTotalDuration(totalDuration);

            document.getElementById('playButton').addEventListener('click', () => {
                if (currentWorkoutIndex === 0 || currentWorkoutIndex >= workoutDetails.length) {
                    playWorkout(workoutDetails, currentWorkoutIndex, allWorkoutsContainer);
                } else {
                    notify("Workout is already in progress", "red");
                }
            });

            document.getElementById('forwards').addEventListener('click', () => {
                skipToWorkout(workoutDetails, ++currentWorkoutIndex, allWorkoutsContainer);
            });

            document.getElementById('backwards').addEventListener('click', () => {
                skipToWorkout(workoutDetails, --currentWorkoutIndex, allWorkoutsContainer);
            });

        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.error('No PlanID provided in the query parameters.');
    }
});