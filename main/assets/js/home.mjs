import { notify } from './notification.mjs';


function createWorkoutCard(imageSrc, category, title, description) {
    let workoutCard = document.createElement('div');
    workoutCard.classList.add('workoutCards');
    workoutCard.id = 'savedWorkout';

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

    container.appendChild(categoryLink);
    container.appendChild(titleElement);
    container.appendChild(descriptionElement);

    workoutCard.appendChild(image);
    workoutCard.appendChild(container);

    return workoutCard;
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
        
        <h1>Hello <span style="color: #b67806">${username}</span></h1>
        <p>Choose from one of the options bellow.</p><br><br><br>
        <div id="options">

        <div class="workoutCards" id="newWorkout">
        <img src="./assets/img/selection1.png">
            <div class="container">
            <a>CATEGORY</a>
            <h1>New Workout</h1>
            <p>Create your own HIIT workout plan.</p>
            </div>
        </div>

            <div class="workoutCards" id="savedWorkout">
            <img src="./assets/img/selection2.png">
                <div class="container">
                <a>CATEGORY</a>
                <h1>Saved Workouts</h1>
                <p>View all of your saved workouts.</p>
                </div>
            </div>


            <div class="workoutCards" id="shareWorkout">
            <img src="./assets/img/selection3.png">
                <div class="container">
                <a>CATEGORY</a>
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

    newWorkoutButton.addEventListener("click", () => {
        const selectionArea = document.querySelector("#options");

        selectionArea.innerHTML = ``;
        selectionArea.append(createWorkoutCard("./assets/img/selection2.png","CARDIO","Jump Rope","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection3.png","STRENGTH","Squats","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection1.png","FLEXIBILITY","Yoga","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection2.png","CARDIO","Jump Rope","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection3.png","STRENGTH","Squats","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection1.png","FLEXIBILITY","Yoga","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection2.png","CARDIO","Jump Rope","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection3.png","STRENGTH","Squats","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection1.png","FLEXIBILITY","Yoga","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection2.png","CARDIO","Jump Rope","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection3.png","STRENGTH","Squats","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection1.png","FLEXIBILITY","Yoga","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection2.png","CARDIO","Jump Rope","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection3.png","STRENGTH","Squats","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection1.png","FLEXIBILITY","Yoga","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection2.png","CARDIO","Jump Rope","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection3.png","STRENGTH","Squats","Blah Blah"));
        selectionArea.append(createWorkoutCard("./assets/img/selection1.png","FLEXIBILITY","Yoga","Blah Blah"));
    });

    notify("Successfully Logged In.", "green");
};