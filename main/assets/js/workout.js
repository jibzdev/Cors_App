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
    // displayWorkout(workoutDetails[currentWorkoutIndex]);

    const PLAY = document.querySelector("#playButton");
    const BACK = document.querySelector("#backButton");
    const FORWARD = document.querySelector("#forwardButton");
    let isPlaying = false;
    let workoutInterval;

    PLAY.addEventListener('click', () => {
        if (currentWorkoutIndex === workoutDetails.length + 1) {
            if (confirm("Do you wish to restart the workout?")) {
                currentWorkoutIndex = 0;
                startWorkout();
            } else {
                notify("Workout Finished", "red");
            }
        } else {
            document.querySelector("#screen").classList.add("fade");
            if (isPlaying) {
                clearInterval(workoutInterval);
                isPlaying = false;
            } else {
                startWorkout();
                isPlaying = true;
            }
        }
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
        // displayWorkout(workoutDetails[currentWorkoutIndex + 1]);
        let workout = workoutDetails[currentWorkoutIndex];
        let workoutNameForGif = workout.Workout_Name.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
        let workoutContainer = document.createElement("div");
        let workoutDurationInSeconds = currentWorkoutIndex === 0 ? 5 : 3;
        document.querySelector("#screen").innerHTML = `<p style="font-size:4vh;color:#b67806;">${workoutDurationInSeconds}</p>`;
        let countdownInterval = setInterval(() => {
            workoutDurationInSeconds--;
            if (workoutDurationInSeconds <= 0) {
                clearInterval(countdownInterval);
                workoutContainer.innerHTML = `
                <img src="/assets/img/gifs/${workoutNameForGif}.png" alt="Workout In Progress"><br>
                <p>${workout.Workout_Description}</p>
                `;
                document.querySelector("#screen").innerHTML = '';
                document.querySelector("#screen").append(workoutContainer);
                startActualWorkout(workout);
            } else {
                document.querySelector("#screen").innerHTML = `Prepare for: <p>${workout.Workout_Name}</p><br><p style="font-size:4vh;color:#b67806;">${workoutDurationInSeconds}</p>`;
            }
        }, 1000);
    }

    async function startActualWorkout(workout) {
        // let workoutDurationInSeconds = parseInt(workout.Workout_Duration) * 60;
        let workoutDurationInSeconds = 2;
        let workoutTimerContainer = document.createElement("p");
        workoutTimerContainer.id = "workoutTimer";
        workoutTimerContainer.innerHTML = `
                <div id="sectionsForShit">
                <p>${workout.Workout_Name}</p>
                <p>${Math.floor(workoutDurationInSeconds / 60)}:${(workoutDurationInSeconds % 60).toString().padStart(2, '0')}</p>
                </div>
                <svg id="shit" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="256" height="256" xml:space="preserve"><switch><g><g fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path stroke="#EE5325" d="M215.212 39.288 142.391 113.5M142 84v30h35"/><path stroke="#BABABA" d="M38.788 216.712 112 144M112 179v-35H77"/></g></g></switch></svg>
                `;
        document.querySelector("#screen").append(workoutTimerContainer);
        let remainingSeconds = workoutDurationInSeconds;
        workoutInterval = setInterval(() => {
            if (remainingSeconds <= 0) {
                clearInterval(workoutInterval);
                notify("Keep Going!", "green");
                currentWorkoutIndex++;
                if (currentWorkoutIndex < workoutDetails.length) {
                    startWorkout();
                } else {
                    notify("Plan Completed!", "green");
                    document.querySelector("#screen").innerHTML = "<h1>Workout Plan Completed!</h1><p>Press play to replay.</p>";
                    PLAY.innerHTML = `<i class="fa-solid fa-play"></i>`;
                    isPlaying = false;
                }
            } else {
                let minutes = Math.floor(remainingSeconds / 60);
                let seconds = remainingSeconds % 60;
                document.getElementById("workoutTimer").innerHTML = `
                <div id="sectionsForShit">
                <p>${workout.Workout_Name}</p>
                <p>${minutes}:${seconds.toString().padStart(2, '0')}</p>
                </div>
                <svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="256" height="256" xml:space="preserve"><switch><g><g fill="none" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path stroke="#EE5325" d="M215.212 39.288 142.391 113.5M142 84v30h35"/><path stroke="#BABABA" d="M38.788 216.712 112 144M112 179v-35H77"/></g></g></switch></svg>
                `;
                remainingSeconds--;
            }
        }, 1000);
    }
}

// function displayWorkout(workout) {
//     if (workout === "done"){
//         const workoutInfo = ``;
//         document.querySelector("#upNext").classList = "fade";
//         document.querySelector("#upNext").innerHTML = workoutInfo;  
//     }
//     else{
//         const workoutInfo = `
//         <img src="assets/img/workoutImgs/${workout.Workout_ID}.jpg">
//         <div id="textNext">
//             <h1>Up Next</h1>
//             <p>${workout.Workout_Name}</p>
//         </div>    
//         `;
//         document.querySelector("#upNext").classList = "fade";
//         document.querySelector("#upNext").innerHTML = workoutInfo; 
//     }

// }


document.addEventListener('DOMContentLoaded', async function() {
    activateMenus();
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

function activateMenus(){
    document.querySelector("#menuIcon").addEventListener("click", () => {
        const sidebar = document.querySelector("#sidebar");
        if (sidebar.style.opacity == "0") {
            sidebar.classList.add("fade");
            sidebar.style.opacity = 1;
        } else {
            sidebar.style.opacity = 0;
            sidebar.classList.remove("fade");
        }
    });
    document.querySelector("#arrow").addEventListener("click", () => {
        const sidebar2 = document.querySelector("#sidebar2");
        if (sidebar2.style.opacity == "0") {
            sidebar2.classList.add("fade");
            sidebar2.style.opacity = 1;
        } else {
            sidebar2.style.opacity = 0;
            sidebar2.classList.remove("fade");
        }
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest("#controlButtons")) {
            const sidebar = document.querySelector("#sidebar");
            const sidebar2 = document.querySelector("#sidebar2");
            sidebar.style.opacity = 0;
            sidebar2.style.opacity = 0;
            setTimeout(() => {
                sidebar.classList.remove("fade");
                sidebar2.classList.remove("fade");
            }, 500);
        }
    });

}