import { notify } from './notification.mjs';


function createWorkoutCard(name, time, description) {

}

export async function homepage(username) {
    const main = document.querySelector("body");
    main.innerHTML = `
    <div id="userArea">

    <div id="user">
        <img src="./assets/img/user.png" alt="Cors App Logo 1">
        <p>${username}</p>
    </div>

    <img src="./assets/img/logo1.png" alt="Cors App Logo 1" style="width: 4vh;" id="userLogo">

    <div class="sidebar"></div>  
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

    notify("Successfully Logged In.", "green");
};