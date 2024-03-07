import { notify } from './notification.js';

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

    const PLAY = document.querySelector("#playButton");
    PLAY.addEventListener('click', async () => {
        document.querySelector("#screen").innerHTML = '';
        PLAY.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        let countdownContainer = document.createElement("div");
        document.querySelector("#screen").appendChild(countdownContainer);
        for (let countdown = 5; countdown > 0; countdown--) {
            await new Promise(resolve => setTimeout(() => {
                countdownContainer.innerHTML = `Starting in ${countdown}`;
                resolve();
            }, 1000));
        }
        countdownContainer.remove(); // Remove countdown display
        
        while (currentWorkoutIndex < workoutDetails.length) {
            let workout = workoutDetails[currentWorkoutIndex];
            let workoutNameForGif = workout.Workout_Name.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
            let workoutContainer = document.createElement("div");
            workoutContainer.innerHTML = `
            <img src="/assets/img/gifs/${workoutNameForGif}.gif" alt="Workout In Progress">
            <p>${workout.Workout_Description}</p>
            <p id="workoutTimer">10 seconds</p>
            `;
            document.querySelector("#screen").append(workoutContainer);
            let workoutDuration = 2;
            for (let seconds = workoutDuration; seconds > 0; seconds--) {
                await new Promise(resolve => setTimeout(() => {
                    document.getElementById("workoutTimer").innerHTML = `${seconds} seconds`;
                    resolve();
                }, 1000));
            }
            workoutContainer.remove();
            notify("Good work, keep going!","green")
            currentWorkoutIndex++;
            if (currentWorkoutIndex < workoutDetails.length) {
                displayWorkout(workoutDetails[currentWorkoutIndex]);
            }
        }
        
        if (currentWorkoutIndex >= workoutDetails.length) {
            notify("Plan Completed!","green")
            document.querySelector("#upNext").innerHTML = "All workouts completed!";
            PLAY.innerHTML = `<i class="fa-solid fa-play"></i>`;
        }
    });
}

function displayWorkout(workout) {
    const workoutInfo = `
    <div>
        <h3>Up Next: ${workout.Workout_Name}</h3>
        <p>${workout.Workout_Description}</p>
    </div>
    `;
    document.querySelector("#upNext").innerHTML = workoutInfo;
}


document.addEventListener('DOMContentLoaded', async function() {
    document.querySelector("#userNameGreet").innerHTML = `${localStorage.getItem("userName")}`;
    notify("Workout Created!", "green");
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
            document.querySelector("#screen").innerHTML = `Total Workout Duration: ${totalDuration} minutes<br>Press play to begin`;
            fetchWorkoutDetails(id);
        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.error('No PlanID provided in the query parameters.');
    }
});