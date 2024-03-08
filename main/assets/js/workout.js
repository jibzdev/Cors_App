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
    const BACK = document.querySelector("#backButton");
    const FORWARD = document.querySelector("#forwardButton");
    let isPlaying = false;
    let workoutInterval;

    PLAY.addEventListener('click', () => {
        document.querySelector("#screen").classList.add("fade");
        if (isPlaying) {
            clearInterval(workoutInterval);
            PLAY.innerHTML = `<i class="fa-solid fa-play"></i>`;
        } else {
            if (currentWorkoutIndex >= workoutDetails.length) {
                currentWorkoutIndex = 0;
            }
            startWorkout();
        }
        isPlaying = !isPlaying;
    });

    BACK.addEventListener('click', () => {
        document.querySelector("#screen").classList.add("fade");
        if (currentWorkoutIndex > 0) {
            clearInterval(workoutInterval);
            currentWorkoutIndex--;
            startWorkout();
        }
    });

    FORWARD.addEventListener('click', () => {
        document.querySelector("#screen").classList.add("fade");
        if (currentWorkoutIndex < workoutDetails.length - 1) {
            clearInterval(workoutInterval);
            currentWorkoutIndex++;
            startWorkout();
        }
    });

    async function startWorkout() {
        document.querySelector("#screen").innerHTML = '';
        document.querySelector("#screen").classList.add("fade");
        PLAY.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        displayWorkout(workoutDetails[currentWorkoutIndex + 1]);
        let workout = workoutDetails[currentWorkoutIndex];
        let workoutNameForGif = workout.Workout_Name.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
        let workoutContainer = document.createElement("div");
        let workoutDurationInSeconds = parseInt(workout.Workout_Duration, 10) * 60;
        workoutContainer.innerHTML = `
        <p>Current Workout:<br>${workout.Workout_Name}</p><br>
        <img src="/assets/img/gifs/${workoutNameForGif}.gif" alt="Workout In Progress"><br>
        <p>${workout.Workout_Description}</p>
        <p id="workoutTimer">${Math.floor(workoutDurationInSeconds / 60)}:${(workoutDurationInSeconds % 60).toString().padStart(2, '0')}</p>
        `;
        document.querySelector("#screen").append(workoutContainer);
        let remainingSeconds = workoutDurationInSeconds;
        workoutInterval = setInterval(async () => {
            if (remainingSeconds <= 0) {
                clearInterval(workoutInterval);
                workoutContainer.remove();
                notify("Keep Going!", "green");
                currentWorkoutIndex++;
                if (currentWorkoutIndex < workoutDetails.length - 1) {
                    startWorkout();
                } else if (currentWorkoutIndex === workoutDetails.length - 1) {
                    displayWorkout(workoutDetails[currentWorkoutIndex]);
                    notify("Final Workout!", "green");
                } else {
                    notify("Plan Completed!", "green");
                    document.querySelector("#screen").innerHTML = "<h1>Workout Plan Completed!</h1><p>Press play to replay.</p>";
                    PLAY.innerHTML = `<i class="fa-solid fa-play"></i>`;
                    isPlaying = false;
                }
            } else {
                let minutes = Math.floor(remainingSeconds / 60);
                let seconds = remainingSeconds % 60;
                document.getElementById("workoutTimer").innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                remainingSeconds--;
            }
        }, 1000);
    }
}

function displayWorkout(workout) {
    const workoutInfo = `
    <img src="assets/img/workoutImgs/${workout.Workout_ID}.jpg">
    <div id="textNext">
        <h1>Up Next</h1>
        <p>${workout.Workout_Name}</p>
    </div>    
    `;
    document.querySelector("#upNext").classList = "fade";
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
            showAllWorkoutsButton(workoutDetails);
        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.error('No PlanID provided in the query parameters.');
    }
});

function showAllWorkoutsButton(workoutDetails){
    document.querySelector("#showAllWorkouts").addEventListener("click", function() {
        let overlay = document.createElement("div");
        overlay.classList = "fade";
        overlay.id = "overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.zIndex = "1000";
        
        let allWorkoutsDiv = document.createElement("div");
        allWorkoutsDiv.id = "allWorkoutsContainer";
        
        let closeButton = document.createElement("button");
        closeButton.innerText = "X";
        closeButton.style.position = "fixed";
        closeButton.style.top = "5px";
        closeButton.style.right = "10px";
        closeButton.onclick = function() {
            overlay.remove();
        };
        
        allWorkoutsDiv.appendChild(closeButton);
        workoutDetails.forEach(workout => {
            const workoutElement = document.createElement("div");
            workoutElement.id = "workoutElementCard";
            workoutElement.innerHTML = `
            <img src="assets/img/workoutImgs/${workout.Workout_ID}.jpg">
            <h3>${workout.Workout_Name}</h3>
            <p>${workout.Workout_Duration} Minutes</p>`;
            allWorkoutsDiv.appendChild(workoutElement);
        });
        
        overlay.appendChild(allWorkoutsDiv);
        document.body.append(overlay);
    });
}