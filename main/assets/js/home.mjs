import { notify } from './notification.mjs';

document.addEventListener("DOMContentLoaded", () => {
    const check = localStorage.getItem("userLoggedIn");
    const username = localStorage.getItem("userName");

    if (check  === 'true'){
        homepage(username);
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
    history.pushState({page: "homepage"}, "homepage", "/homepage");
    const main = document.querySelector("body");
    main.innerHTML = `
    <div id="userArea">
        <div id="controlButtons">
        <a id="logoutButton"><i class="fa-solid fa-right-from-bracket"></i></a>
        <a><i class="fa-solid fa-gear"></i></a>
        </div>
        <div id="greet">
        <h1>Hello, ${username}</h1><br>
        <p>Welcome back to CORS APP.</p>
        </div>

        <div id="weather">
        <p>Mon</p>
        <p>Tue</p>
        <p>Wed</p>
        <p>Thu</p>
        <p>Fri</p>
        <p>Sat</p>
        <p>Sun</p>
        </div>
    </div>

    <section id="content">
    ${createWorkoutCard("./assets/img/selection1.png","","New Workout","Create your own HIIT workout plan.","","newWorkout").outerHTML}
    ${createWorkoutCard("./assets/img/selection2.png","","Saved Workout","Access your saved HIIT workout plans.","","savedWorkout").outerHTML}
    </section>
    `;
    document.querySelector("#content").style.marginTop = "10vw";
    document.querySelector("#logoutButton").addEventListener("click", async () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = `/`;
    });

    const newWorkoutButton = document.querySelector("#newWorkout");
    const savedWorkoutsButton = document.querySelector("#savedWorkout");

    savedWorkoutsButton.addEventListener("click", () => {
        location.href = "savedWorkouts.html"
    });

    newWorkoutButton.addEventListener("click", async () => {
        await newWorkout(username);
    });

    notify("Successfully Logged In.", "green");
};

async function newWorkout(username) {
    history.pushState({page: "nameWorkout"}, "nameWorkout", "/nameWorkout");
    const selectionArea = document.querySelector("#content");
    document.querySelector("#content").style.marginTop = "10vw";
    const selectedWorkoutsDiv = document.querySelector("#selectedWorkouts");
    if (selectedWorkoutsDiv) selectedWorkoutsDiv.remove();
    selectionArea.innerHTML = `
    <div id="nameWorkout">
        <label for="workoutName">Name your workout plan:</label>
        <input type="text" id="workoutName" name="workoutName" placeholder="My Workout Plan">
    </div>
    `;
    const workoutNameInput = document.querySelector("#workoutName");
    workoutNameInput.addEventListener("change", async () => {
        const workoutName = workoutNameInput.value.trim();
        if(workoutName) {
            await createPlan(workoutName,username);
        }
    });
};

async function createPlan(workoutName,username) {
    history.replaceState({page: "createPlan", workoutName: workoutName}, "createPlan", "/createPlan");
    const selectionArea = document.querySelector("#content");
    selectionArea.innerHTML = ``;
    document.querySelector("#content").style.marginTop = "2vw";
    let selected = document.createElement("div");
    selected.setAttribute("id","selectedWorkouts");
    let workoutCardsDiv = document.createElement("div");
    workoutCardsDiv.setAttribute('id','workoutCardsDiv');
    let pointer = document.createElement("p");
    pointer.setAttribute('id','pointer');
    pointer.textContent = "Select your workouts from bellow.";
    document.querySelector("#userArea").after(selected);
    let workoutInfo = document.createElement("div");
    workoutInfo.setAttribute("id","workoutInfo");
    let totalWorkoutTime = 0;
    workoutInfo.innerHTML = `<p>Plan: ${workoutName}</p><p>Workout Time: <span id="totalWorkoutTime" style="color: #b67806;">0</span> minutes</p><button id="createWorkout">Create</button>`;
    selected.append(workoutInfo);
    selected.append(workoutCardsDiv);
    selected.append(pointer);

    const workouts = await fetch('/workouts');
    let workoutData = await workouts.json();
    
    console.log(workoutData);
    const workoutCards = workoutData.map((workout, index) => {
        let imageIndex = index + 1;
        return createWorkoutCard(
            `./assets/img/workoutImgs/${imageIndex}.jpg`,
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
            const workoutTime = parseInt(card.querySelector("p").textContent);
            const workoutImageSrc = card.querySelector("img").src;
            if (!addedWorkouts.has(workoutTitle)) {
                addedWorkouts.set(workoutTitle, workoutId);
                
                totalWorkoutTime += workoutTime;
                document.getElementById("totalWorkoutTime").textContent = totalWorkoutTime;
                
                let workoutDiv = document.createElement("div");
                workoutDiv.setAttribute("class","selectedCards");
                workoutDiv.innerHTML = `
                    <img src="${workoutImageSrc}" alt="Workout Image">
                    <div class="textContent">
                    <div id="textContentDetails2">
                    <p style="color: #b67806;">${workoutTime} minutes</p>
                    </div>
                    <div id="textContentDetails1">
                    <h1>${workoutTitle}</h1>
                    <p>3x10</p>
                    </div>
                    </div>
                `;
                let removeButton = document.createElement("button");
                removeButton.textContent = "X";
                workoutDiv.querySelector("#textContentDetails2").appendChild(removeButton);

                workoutCardsDiv.append(workoutDiv);
                notify(`Added ${workoutTitle}`, "green");

                if (pointer) {
                    pointer.remove();
                    pointer = null;
                }

                removeButton.addEventListener("click", () => {
                    addedWorkouts.delete(workoutTitle);
                    totalWorkoutTime -= workoutTime;
                    document.getElementById("totalWorkoutTime").textContent = totalWorkoutTime;
                    notify(`Removed ${workoutTitle}`, "red");
                    workoutDiv.remove();
                });
            } else {
                notify(`${workoutTitle} has already been added.`, "red");
            }
        });
    });
    document.querySelector("#createWorkout").addEventListener("click", async (event) => {
        if (addedWorkouts.size === 0) {
            notify("No workouts added. Please add workouts before creating a plan.", "red");
            return;
        }
    
        const IDPayload = {
            username
        };
        const response = await fetch('/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(IDPayload),
        });
        if (response.ok) {
            const userData = await response.json();
            const User_ID = `${userData.userID}`;
            const workoutIds = Array.from(addedWorkouts.values());
            const planPayload = {
                User_ID,
                Plan_Name: workoutName,
                Workouts: workoutIds
            };
            debugger;
            const planResponse = await fetch('/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planPayload),
            });
            if (planResponse.ok) {
                const planData = await planResponse.json(); // Correctly parsing the response to get planData
                if(planData && planData.planID) {
                    const planID = planData.planID; // Correctly using the parsed planData to get planID
                    window.location.href = `/workout.html?planID=${planID}`; // Redirecting to the plan details page with the planID as a query parameter
                } else {
                    notify("Failed to retrieve plan ID.", "red");
                }
            } else {
                notify("Failed to create workout plan.", "red");
            }
        } else {
            notify("Error fetching user data", "red");
            return;
        }
});
};

window.addEventListener('popstate', function(event) {
    if(event.state) {
        switch(event.state.page) {
            case "homepage":
                homepage(username);
                break;
            case "nameWorkout":
                newWorkout(username);
                break;
            case "createPlan":
                createPlan(event.state.workoutName,username);
                break;
            default:
                console.log("No such page state exists.");
        }
    }
});
