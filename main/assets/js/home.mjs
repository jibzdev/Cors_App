import { create } from 'domain';
import { notify } from './notification.mjs';

export async function homepage(username) {
    // const payload = username;
    // console.log(username);
    // const response = await fetch('/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    // });
    const main = document.querySelector("body");
    main.innerHTML = `
    <div id="userArea">
    <img src="assets/img/logo1.png" alt="Cors App Logo 1" style="width: 7.5vh;">
    <p>Hello there ${username}</p>
    <button id="logoutButton">Logout</button>
    </div>

    <div id="selection">
        <h1>Please Select an option</h1>
        <button id="newWorkoutButton">New Workout</button>
        <button>Saved Workouts</button>
        <button>Share Workouts</button>
    </div>
    `;

    document.querySelector("#logoutButton").addEventListener("click", async () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = `/`;
    });

    document.querySelector("#newWorkoutButton").addEventListener("click", () => {
        let workoutName = prompt("Please enter a name for your workout:", "My HIIT Workout");
        if (workoutName === null || workoutName === "") {
            workoutName = "Untitled Workout 1";
        }
        const workoutOptions = document.querySelector("#selection");

        workoutOptions.innerHTML = `
        <h2>${workoutName}</h2>
        <h3>Create your Workout Plan.</h3>
        <p>Choose between 3 - 7 Workouts, form your own High Intensity workout plan.</p>
        `;

        const userSelection = document.createElement("div");
        userSelection.setAttribute("id","userSelection");

        let workouts = ["Workout 1", "Workout 2", "Workout 3", "Workout 4", "Workout 5", "Workout 6", "Workout 7", "Workout 8", "Workout 9", "Workout 10", "Workout 11", "Workout 12", "Workout 13", "Workout 14", "Workout 15"];
        let selectedWorkouts = [];
        workouts.forEach(workout => {
            const button = document.createElement("button");
            button.textContent = workout;
            button.addEventListener("click", function selectWorkout() {
                console.log(`${workoutName}: ${workout} selected`);
                const workoutElement = document.createElement("p");
                workoutElement.textContent = workout;
                userSelection.appendChild(workoutElement);
                workouts = workouts.filter(item => item !== workout);
                button.remove();
                selectedWorkouts.push(workout);
                console.log(selectedWorkouts);
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "X";
                deleteButton.addEventListener("click", function removeWorkout() {
                    userSelection.removeChild(workoutElement);
                    workouts.push(workout);
                    selectedWorkouts = selectedWorkouts.filter(item => item !== workout);
                    const reAddButton = document.createElement("button");
                    reAddButton.textContent = workout;
                    reAddButton.addEventListener("click", function selectWorkout() {
                        console.log(`${workoutName}: ${workout} selected`);
                        userSelection.appendChild(workoutElement);
                        workouts = workouts.filter(item => item !== workout);
                        selectedWorkouts.push(workout);
                        workoutElement.appendChild(deleteButton);
                        reAddButton.remove();
                    });
                    workoutOptions.appendChild(reAddButton);
                    deleteButton.remove();
                    console.log(selectedWorkouts);
                });
                workoutElement.appendChild(deleteButton);
            });
            workoutOptions.appendChild(button);
        });
        main.appendChild(userSelection);
        main.appendChild(workoutOptions);

        let createPlan = document.createElement("button");
        createPlan.id = "createPlan";

        main.appendChild(createPlan);

        createPlan.addEventListener("click", async () => {
            
        })
    });

    // history.pushState({ page: "homepage" }, "homepage", "homepage");
    notify("Successfully Logged In.", "green");
};