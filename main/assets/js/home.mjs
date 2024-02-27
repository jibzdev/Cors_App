import { notify } from './notification.mjs';

document.addEventListener("DOMContentLoaded", () => {
    const check = localStorage.getItem("userLoggedIn");
    const name = localStorage.getItem("userName");

    if (check  === 'true'){
        homepage(name);
    }
    else{
        alert("not logged in");
    }

});

function createWorkoutCard(imageSrc, category, title, description, workoutDuration, id) {
    let workoutCard = document.createElement('div');
    workoutCard.classList.add('workoutCards');
    workoutCard.id = id;

    let image = document.createElement('img');
    image.src = imageSrc;

    let container = document.createElement('div');
    container.classList.add('container');

    let categoryLink = document.createElement('a');
    categoryLink.textContent = category;

    let titleElement = document.createElement('h1');
    titleElement.textContent = title;

    let descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;

    let duration = document.createElement('p');
    duration.setAttribute("id","workoutCardTimer");
    duration.textContent = `${workoutDuration}`;

    container.appendChild(categoryLink);
    container.appendChild(titleElement);
    container.appendChild(descriptionElement);

    workoutCard.appendChild(image);
    workoutCard.appendChild(duration);
    workoutCard.appendChild(container);

    return workoutCard;
}

async function homepage(username) {
    const main = document.querySelector("body");
    main.innerHTML = `
    <div id="userArea">

    <div id="user">
        <img src="./assets/img/user.png" alt="Cors App Logo 1" class="sidebar" style="width: 4vh;">
        <p>${username}</p>
    </div>

    <img src="./assets/img/logo1.png" alt="Cors App Logo 1" style="width: 4vh;" id="userLogo">
    </div>

    <div id="selection">
        
        <div id="info">
        <h1>Hello <span style="color: #b67806">${username}</span></h1>
        <p>Choose from one of the options bellow.</p>
        </div>
        <div id="options">
        ${createWorkoutCard("./assets/img/selection1.png","","New Workout","Create your own HIIT workout plan.","","newWorkout").outerHTML}
        ${createWorkoutCard("./assets/img/selection2.png","","Saved Workout","Access your saved HIIT workout plans.","","savedWorkout").outerHTML}
        ${createWorkoutCard("./assets/img/selection3.png","","Share Workout","Share your HIIT workout plan with friends.","","shareWorkout").outerHTML}
        </div>

    </div>
    `;

    let mininav = document.createElement("div");
    mininav.setAttribute("id", "miniNav");
    mininav.style.display = "none";

    let miniNavSelection1 = document.createElement("button");
    miniNavSelection1.setAttribute("id", "logoutButton");
    miniNavSelection1.textContent = "Logout";
    let miniNavSelection2 = document.createElement("button");
    miniNavSelection2.setAttribute("id", "settingsButton");
    miniNavSelection2.textContent = "Home";
    let miniNavSelection3 = document.createElement("button");
    miniNavSelection3.setAttribute("id", "homeButton");
    miniNavSelection3.textContent = "Settings";

    mininav.appendChild(miniNavSelection2);
    mininav.appendChild(miniNavSelection3);
    mininav.appendChild(miniNavSelection1);
    main.append(mininav);

    document.querySelector('.sidebar').addEventListener("click", () => {
        mininav.style.display = mininav.style.display === "none" ? "flex" : "none";
    });

    document.addEventListener("click", (event) => {
        if (!mininav.contains(event.target) && !document.querySelector('.sidebar').contains(event.target)) {
            mininav.style.display = "none";
        }
    });

    document.querySelector("#logoutButton").addEventListener("click", async () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = `/`;
    });

    const newWorkoutButton = document.querySelector("#newWorkout");
    const savedWorkoutsButton = document.querySelector("#savedWorkout");

    savedWorkoutsButton.addEventListener("click", () => {

    });

    newWorkoutButton.addEventListener("click", async () => {
        const selectionArea = document.querySelector("#options");
        const info = document.querySelector("#info");

        selectionArea.innerHTML = ``;
        info.innerHTML = `
        <div>
            <label for="workoutName">Name your workout plan:</label>
            <input type="text" id="workoutName" name="workoutName" placeholder="My Workout Plan">
        </div>
        <h1>Create your own Workout Plan.</h1>
        <p>Workout intensity can be altered.</p>
        `;
        const workoutNameInput = document.querySelector("#workoutName");
        workoutNameInput.addEventListener("change", async () => {
            const workoutName = workoutNameInput.value.trim();
            if(workoutName) {
                info.innerHTML = `
                <h1>Create your own Workout Plan.</h1>
                <p>Workout intensity can be altered.</p>`;
                const selection = document.querySelector("#selection");
                let selected = document.createElement("div");
                selected.setAttribute("id","selectedWorkouts");
                selection.append(selected);
                let workoutInfo = document.createElement("div");
                workoutInfo.setAttribute("id","workoutInfo");
                workoutInfo.innerHTML = `<p>Workout Name: ${workoutName}</p><br><button id="createWorkout">Create</button>`;
                selected.append(workoutInfo);

                const workouts = await fetch('/workouts');
                let workoutData = await workouts.json();
                
                console.log(workoutData);
                const workoutCards = workoutData.map((workout, index) => {
                    return createWorkoutCard(
                        `./assets/img/selection1.png`,
                        'CATEGORY',
                        workout.Workout_Name,
                        workout.Workout_Description,
                        `${workout.Workout_Duration}`,
                        `${workout.Workout_ID}`
                    );
                });

                const addedWorkouts = new Map();

                workoutCards.forEach(card => {
                    selectionArea.append(card);
                    card.addEventListener("click", () => {
                        const workoutTitle = card.querySelector("h1").textContent;
                        const workoutId = card.id;
                        if (!addedWorkouts.has(workoutTitle)) {
                            addedWorkouts.set(workoutTitle, workoutId);
                            let title = document.createElement("h1");
                            title.textContent = workoutTitle;
                            selected.append(title);

                            let time = document.createElement("p");
                            time.textContent = card.querySelector("p").textContent;
                            selected.append(time);
                            notify(`Added ${workoutTitle}`,"green");
                        } else {
                            notify(`${workoutTitle} has already been added.`, "red");
                        }
                    });
                });

                document.querySelector("#createWorkout").addEventListener("click", async () =>{
                    if (addedWorkouts.size === 0) {
                        notify("No workouts added. Please add workouts before creating a plan.", "red");
                        return;
                    }

                    const payload1 = {
                        username
                    };
                    const response = await fetch('/user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload1),
                    });
                    const userData = await response.json();
                    const User_ID = `${userData.userID}`;
                    console.log(User_ID);

                    const workoutIds = Array.from(addedWorkouts.values());
                    const payload2 = {
                        User_ID,
                        Workouts: workoutIds
                    };
                    const response2 = await fetch('/workouts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload2),
                    });
                    const workoutPlanID = await response2.text();
                    console.log(workoutPlanID);
                });
            }
        });
    });

    notify("Successfully Logged In.", "green");
};