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
    duration.textContent = `DURATION: ${workoutDuration}`;

    container.appendChild(categoryLink);
    container.appendChild(titleElement);
    container.appendChild(descriptionElement);

    workoutCard.appendChild(image);
    workoutCard.appendChild(duration);
    workoutCard.appendChild(container);

    return workoutCard;
}

export async function homepage(username) {
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

        <div class="workoutCards" id="newWorkout">
        <img src="./assets/img/selection1.png">
            <div class="container">
            <h1>New Workout</h1>
            <p>Create your own HIIT workout plan.</p>
            </div>
        </div>

            <div class="workoutCards" id="savedWorkout">
            <img src="./assets/img/selection2.png">
                <div class="container">
                <h1>Saved Workouts</h1>
                <p>View all of your saved workouts.</p>
                </div>
            </div>


            <div class="workoutCards" id="shareWorkout">
            <img src="./assets/img/selection3.png">
                <div class="container">
                <h1>Share Workouts</h1>
                <p>Share your workouts so people can follow your plan.</p>
                </div>
            </div>
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

    newWorkoutButton.addEventListener("click", () => {
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
        workoutNameInput.addEventListener("change", () => {
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

                const workoutCards = [
                    createWorkoutCard("./assets/img/selection2.png","CARDIO","Jump Rope","Blah Blah","60s","1"),
                    createWorkoutCard("./assets/img/selection3.png","STRENGTH","Squats","Blah Blah","60s","2"),
                    createWorkoutCard("./assets/img/selection1.png","FLEXIBILITY","Yoga","Blah Blah","60s","3")
                ];

                const addedWorkouts = new Set();

                workoutCards.forEach(card => {
                    selectionArea.append(card);
                    card.addEventListener("click", () => {
                        const workoutTitle = card.querySelector("h1").textContent;
                        if (!addedWorkouts.has(workoutTitle)) {
                            addedWorkouts.add(workoutTitle);
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
                    const payload = {
                        username
                    };
                    const response = await fetch('/user', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    const data = await response.text();
                    console.log(data);
                });
            }
        });
    });

    notify("Successfully Logged In.", "green");
};