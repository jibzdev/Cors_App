import { notify } from './notification.mjs';

export async function homepage(username) {
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
            workoutName = "Default Workout Name";
        }
        const workoutOptions = document.createElement("div");
        workoutOptions.id = "workoutOptions";
        workoutOptions.innerHTML = `<h2>${workoutName}</h2><h3>Choose a HIIT Workout</h3>`;
        const workouts = ["Workout 1", "Workout 2", "Workout 3", "Workout 4", "Workout 5", "Workout 6", "Workout 7", "Workout 8", "Workout 9", "Workout 10", "Workout 11", "Workout 12", "Workout 13", "Workout 14", "Workout 15"];
        workouts.forEach(workout => {
            const button = document.createElement("button");
            button.textContent = workout;
            button.addEventListener("click", () => {
                console.log(`${workoutName}: ${workout} selected`);
            });
            workoutOptions.appendChild(button);
        });
        main.appendChild(workoutOptions);
    });

    history.pushState({ page: "homepage" }, "homepage", "homepage");
    notify("Successfully Logged In.", "green");
};