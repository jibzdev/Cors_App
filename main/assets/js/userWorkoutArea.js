// WORKING ON FIXING

import { activateWorkoutMenus, logoutHandler, notify, sidebarHandler } from './assets.js';
const beepAudio = new Audio('/assets/audio/beep.wav');
const beepAudioFinal = new Audio('/assets/audio/finalbeep.wav');
const screen = document.querySelector("#screen");

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
    let isPlaying = false;
    let workoutInterval;
    let countdownInterval;
    let time;

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
            startWorkout(time);
            isPlaying = true;
        });
    }

    function removePauseOverlay() {
        const overlay = document.querySelector('#pauseOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    function togglePlay() {
        if (isPlaying === true) {
                clearInterval(workoutInterval);
                clearInterval(countdownInterval);
                isPlaying = false;
                createPauseOverlay();
        } else {
            if (currentWorkoutIndex >= workoutDetails.length) {
                if (confirm("Do you wish to restart the workout?")) {
                    currentWorkoutIndex = 0;
                    displayWorkout(workoutDetails[currentWorkoutIndex]);
                    removePauseOverlay();
                    startWorkout(time);
                } else {
                    notify("Workout Finished", "red");
                    return;
                }
            }
            else{
                removePauseOverlay();
                startWorkout(time);
            }
        }
        isPlaying = true;
        document.querySelector("#screen").classList.add("fade");
    }

    PLAY.addEventListener('click', togglePlay);
    
    async function startWorkout(remainingTime = 0) {
        document.querySelector("#screen").innerHTML = '';
        document.querySelector("#screen").classList.add("fade");
        let workout = workoutDetails[currentWorkoutIndex];
        let workoutNameForGif = workout.Workout_Name.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
        let workoutContainer = document.createElement("div");
        let workoutDurationInSeconds = remainingTime || (currentWorkoutIndex === 0 ? 3 : 7);

        document.querySelector("#screen").innerHTML = `<p style="font-size:4vh;color:#b67806;">${workoutDurationInSeconds}</p>`;
        if (workoutDurationInSeconds === 3) {
            beepAudio.play();
        }
        countdownInterval = setInterval(() => {
            if (window.innerWidth <= 768) {
                screen.style.top = "60%";
                screen.style.left = "50%";
                screen.style.transform = "translate(-50%, -60%)";
            }
            workoutDurationInSeconds--;
            time = workoutDurationInSeconds;
            if (workoutDurationInSeconds <= 3 && workoutDurationInSeconds > 0) {
                beepAudio.play();
            }
            if (workoutDurationInSeconds <= 0) {
                beepAudioFinal.play();
                clearInterval(countdownInterval);
                displayWorkout(workoutDetails[currentWorkoutIndex + 1]);
                workoutContainer.innerHTML = `
                <img src="/assets/img/gifs/${workoutNameForGif}.gif" alt="Workout In Progress"><br>
                <p>${workout.Workout_Description}</p>
                `;
                document.querySelector("#screen").innerHTML = '';
                document.querySelector("#screen").append(workoutContainer);
                if (window.innerWidth <= 768) {
                    screen.style.top = "75%";
                    screen.style.left = "50%";
                    screen.style.transform = "translate(-50%, -75%)";
                }
                startActualWorkout(workout);
            } else {
                document.querySelector("#screen").innerHTML = `Prepare for: <p>${workout.Workout_Name}</p><br><p style="font-size:4vh;color:#b67806;">${workoutDurationInSeconds}</p>`;
            }
        }, 1000);
    }

    async function startActualWorkout(workout) {
        const existingTimerContainer = document.getElementById("workoutTimer");
        if (existingTimerContainer) {
            existingTimerContainer.remove();
        }
        // let workoutDurationInSeconds = parseInt(workout.Workout_Duration) * 60;
        let workoutDurationInSeconds = 5;
        let workoutTimerContainer = document.createElement("div");
        workoutTimerContainer.id = "workoutTimer";
        workoutTimerContainer.innerHTML = `
                <div id="sectionsForShit">
                <p><i class="fa-solid fa-pencil"></i> ${workout.Workout_Name}</p>
                <p id="specificTimer"><i class="fa-solid fa-clock"></i> ${Math.floor(workoutDurationInSeconds / 60)}:${(workoutDurationInSeconds % 60).toString().padStart(2, '0')}</p>
                <p><i class="fa-solid fa-dumbbell"></i> ${workout.Workout_Sets}</p>
                </div>
                <svg id="shit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 59.2"><g data-name="Layer 2"><path d="M60.75 0H3.25A3.26 3.26 0 0 0 0 3.25v39.39a3.26 3.26 0 0 0 3.25 3.26H21l-1.07 4.68-5.43 2.81a1 1 0 0 0-.54.89v3.92a1 1 0 0 0 1 1H49a1 1 0 0 0 1-1v-3.92a1 1 0 0 0-.54-.89l-5.39-2.81L43 45.9h17.7a3.26 3.26 0 0 0 3.3-3.26V3.25A3.26 3.26 0 0 0 60.75 0zM48 57.2H16v-2.32l5-2.63h22l5 2.63zm-6-6.95H22l1-4.36h18zm20-7.61a1.26 1.26 0 0 1-1.25 1.26H3.25A1.26 1.26 0 0 1 2 42.64V3.25A1.25 1.25 0 0 1 3.25 2h57.5A1.25 1.25 0 0 1 62 3.25z"/><path d="M57.17 6.31H6.83a1 1 0 0 0-1 1v31.27a1 1 0 0 0 1 1h50.34a1 1 0 0 0 1-1V7.31a1 1 0 0 0-1-1zm-1 31.28H7.83V8.31h48.34z"/><path d="M41.76 32.29h6.32a1 1 0 0 0 1-1V16.15a1 1 0 0 0-1-1h-6.32a1 1 0 0 0-1 1v15.14a1 1 0 0 0 1 1zm1-15.13h4.32v13.13h-4.32zM28.52 32.29h6.32a1 1 0 0 0 1-1V20a1 1 0 0 0-1-1h-6.32a1 1 0 0 0-1 1v11.3a1 1 0 0 0 1 .99zm1-11.3h4.32v9.3h-4.32zM15.63 32.29h6.32a1 1 0 0 0 1-1v-6.63a1 1 0 0 0-1-1h-6.32a1 1 0 0 0-1 1v6.63a1 1 0 0 0 1 1zm1-6.63h4.32v4.63h-4.32z"/></g></svg>
                `;
        document.querySelector("#stats").append(workoutTimerContainer);

        let remainingSeconds = workoutDurationInSeconds;
        time = remainingSeconds;
        workoutInterval = setInterval(() => {
            if (remainingSeconds <= 0) {
                workoutTimerContainer.remove();
                clearInterval(workoutInterval);
                notify("Keep Going!", "green");
                currentWorkoutIndex++;
                if (currentWorkoutIndex < workoutDetails.length) {
                    startWorkout(time);
                } else {
                    if (window.innerWidth <= 768) {
                        screen.style.top = "60%";
                        screen.style.left = "50%";
                        screen.style.transform = "translate(-50%, -60%)";
                    }
                    notify("Plan Completed!", "green");
                    document.querySelector("#screen").innerHTML = "<h1>Workout Plan Completed!</h1><p>Press play to replay.</p>";
                    isPlaying = false;
                }
            } else {
                let minutes = Math.floor(remainingSeconds / 60);
                let seconds = remainingSeconds % 60;
                document.getElementById("workoutTimer").innerHTML = `
                <div id="sectionsForShit">
                <p><i class="fa-solid fa-pencil"></i> ${workout.Workout_Name}</p>
                <p id="specificTimer"><i class="fa-solid fa-clock"></i> ${minutes}:${seconds.toString().padStart(2, '0')}</p>
                <p><i class="fa-solid fa-dumbbell"></i> ${workout.Workout_Sets}</p>
                </div>
                <svg id="shit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 59.2"><g data-name="Layer 2"><path d="M60.75 0H3.25A3.26 3.26 0 0 0 0 3.25v39.39a3.26 3.26 0 0 0 3.25 3.26H21l-1.07 4.68-5.43 2.81a1 1 0 0 0-.54.89v3.92a1 1 0 0 0 1 1H49a1 1 0 0 0 1-1v-3.92a1 1 0 0 0-.54-.89l-5.39-2.81L43 45.9h17.7a3.26 3.26 0 0 0 3.3-3.26V3.25A3.26 3.26 0 0 0 60.75 0zM48 57.2H16v-2.32l5-2.63h22l5 2.63zm-6-6.95H22l1-4.36h18zm20-7.61a1.26 1.26 0 0 1-1.25 1.26H3.25A1.26 1.26 0 0 1 2 42.64V3.25A1.25 1.25 0 0 1 3.25 2h57.5A1.25 1.25 0 0 1 62 3.25z"/><path d="M57.17 6.31H6.83a1 1 0 0 0-1 1v31.27a1 1 0 0 0 1 1h50.34a1 1 0 0 0 1-1V7.31a1 1 0 0 0-1-1zm-1 31.28H7.83V8.31h48.34z"/><path d="M41.76 32.29h6.32a1 1 0 0 0 1-1V16.15a1 1 0 0 0-1-1h-6.32a1 1 0 0 0-1 1v15.14a1 1 0 0 0 1 1zm1-15.13h4.32v13.13h-4.32zM28.52 32.29h6.32a1 1 0 0 0 1-1V20a1 1 0 0 0-1-1h-6.32a1 1 0 0 0-1 1v11.3a1 1 0 0 0 1 .99zm1-11.3h4.32v9.3h-4.32zM15.63 32.29h6.32a1 1 0 0 0 1-1v-6.63a1 1 0 0 0-1-1h-6.32a1 1 0 0 0-1 1v6.63a1 1 0 0 0 1 1zm1-6.63h4.32v4.63h-4.32z"/></g></svg>
                `;
                remainingSeconds--;
                time = remainingSeconds;
            }
        }, 1000);
    }
}

function displayWorkout(workout) {
    if (!workout){
        const workoutInfo = `
        <img src="assets/img/workoutImgs/finished.jpg">
        <div id="textNext">
            <p>Final Workout</p>
        </div>    
        `;
        document.querySelector("#upNext").classList = "fade";
        document.querySelector("#upNext").innerHTML = workoutInfo;  
    }
    else{
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

}

function showAllWorkoutsButton(workoutDetails){
    document.querySelector("#showAllWorkouts").addEventListener("click", function() {
        let overlay = document.createElement("div");
        overlay.className = "fade";
        overlay.id = "overlay";
        let allWorkoutsDiv = document.createElement("div");
        allWorkoutsDiv.id = "allWorkoutsContainer";
        
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
        document.body.appendChild(overlay);

        overlay.addEventListener("click", function(event) {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', async function() {
    activateWorkoutMenus();
    sidebarHandler();
    logoutHandler();
    document.querySelector("#userNameGreet").innerHTML = `${localStorage.getItem("userName")}`;
    notify("Workout Loaded", "green");
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
            let time = document.createElement("h1");
            time.textContent = totalDuration + " Minutes";
            time.style.fontSize = "4vh";
            time.style.color = "#b67806"
            let pressPlay = document.createElement("p");
            pressPlay.style.color = "#525252"
            pressPlay.textContent = "Press play to begin"
            document.querySelector("#screen").append(time);
            document.querySelector("#screen").append(pressPlay);
            fetchWorkoutDetails(id);
            showAllWorkoutsButton(workoutDetails);
        } catch (error) {
            console.error(error.message);
        }
    } else {
        console.error('No PlanID provided in the query parameters.');
    }
});

