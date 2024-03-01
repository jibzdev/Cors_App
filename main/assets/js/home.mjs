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
    document.querySelector("#userNameGreet").innerHTML = `Hello ${username}`;
    document.querySelector("#content").innerHTML = `
    ${createWorkoutCard("./assets/img/selection1.png","","New Workout","Create your own HIIT workout plan.","","newWorkout").outerHTML}
    ${createWorkoutCard("./assets/img/selection2.png","","Saved Workout","Access your saved HIIT workout plans.","","savedWorkout").outerHTML}`;
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
        history.pushState({page: "newWorkout"}, "newWorkout", "/newWorkout");
        await newWorkout(username);
    });

    notify("Successfully Logged In.", "green");
};

async function newWorkout(username) {
    document.querySelector("#content").innerHTML = '';
    const selectionArea = document.querySelector("#content");
    document.querySelector("#content").style.marginTop = "10vw";
    const selectedWorkoutsDiv = document.querySelector("#selectedWorkouts");
    if (selectedWorkoutsDiv) selectedWorkoutsDiv.remove();
    const nameWorkoutDiv = document.createElement('div');
    nameWorkoutDiv.setAttribute('id', 'nameWorkout');
    const label = document.createElement('label');
    label.setAttribute('for', 'workoutName');
    label.textContent = 'Name your workout plan:';
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', 'workoutName');
    input.setAttribute('name', 'workoutName');
    input.setAttribute('placeholder', 'My Workout Plan');
    nameWorkoutDiv.appendChild(label);
    nameWorkoutDiv.appendChild(input);
    selectionArea.appendChild(nameWorkoutDiv);
    const workoutNameInput = document.querySelector("#workoutName");
    workoutNameInput.addEventListener("change", async () => {
        const workoutName = workoutNameInput.value.trim();
        if(workoutName) {
            history.pushState({page: "createPlan", workoutName: workoutName}, "createPlan", "/createPlan");
            await createPlan(workoutName,username);
        }
    });
};

async function createPlan(workoutName, username) {
    document.querySelector("#content").innerHTML = '';
    const selectionArea = document.querySelector("#content");
    document.querySelector("#content").style.marginTop = "2vw";
    let selected = document.createElement("div");
    selected.setAttribute("id", "selectedWorkouts");
    let workoutCardsDiv = document.createElement("div");
    workoutCardsDiv.setAttribute('id', 'workoutCardsDiv');
    let pointer = document.createElement("p");
    pointer.setAttribute('id', 'pointer');
    pointer.textContent = "Select your workouts from below.";
    document.querySelector("#userArea").after(selected);
    let workoutInfo = document.createElement("div");
    workoutInfo.setAttribute("id", "workoutInfo");
    let totalWorkoutTime = 0;
    let planParagraph = document.createElement("p");
    planParagraph.textContent = `Plan: ${workoutName}`;
    let timeParagraph = document.createElement("p");
    timeParagraph.textContent = "Workout Time: ";
    let timeSpan = document.createElement("span");
    timeSpan.setAttribute("id", "totalWorkoutTime");
    timeSpan.style.color = "#b67806";
    timeSpan.textContent = "0 minutes";
    timeParagraph.appendChild(timeSpan);
    let createButton = document.createElement("button");
    createButton.setAttribute("id", "createWorkout");
    createButton.textContent = "Create";
    workoutInfo.appendChild(planParagraph);
    workoutInfo.appendChild(timeParagraph);
    workoutInfo.appendChild(createButton);
    selected.appendChild(workoutInfo);
    selected.appendChild(workoutCardsDiv);
    selected.appendChild(pointer);
    const workouts = await fetch('/workouts');
    let workoutData = await workouts.json();
    console.log(workoutData);
    const workoutCards = workoutData.map((workout, index) => {
        let imageIndex = index + 1;
        return createWorkoutCard(
            `./assets/img/workoutImgs/${imageIndex}.jpg`,
            workout.Workout_Sets,
            workout.Workout_Name,
            workout.Workout_Description,
            `${workout.Workout_Duration} Minutes`,
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
            const workoutSets = card.querySelector("a").textContent;
            const workoutImageSrc = card.querySelector("img").src;
            if (!addedWorkouts.has(workoutTitle)) {
                addedWorkouts.set(workoutTitle, workoutId);
                totalWorkoutTime += workoutTime;
                document.getElementById("totalWorkoutTime").textContent = totalWorkoutTime + " minutes";
                let workoutDiv = document.createElement("div");
                workoutDiv.setAttribute("class", "selectedCards");
                let workoutImage = document.createElement("img");
                workoutImage.src = workoutImageSrc;
                workoutImage.alt = "Workout Image";
                workoutDiv.appendChild(workoutImage);
                let textContentDiv = document.createElement("div");
                textContentDiv.setAttribute("class", "textContent");
                let textContentDetails2 = document.createElement("div");
                textContentDetails2.setAttribute("id", "textContentDetails2");
                let workoutTimeP = document.createElement("p");
                workoutTimeP.style.color = "#b67806";
                workoutTimeP.textContent = `${workoutTime} minutes`;
                textContentDetails2.appendChild(workoutTimeP);
                let textContentDetails1 = document.createElement("div");
                textContentDetails1.setAttribute("id", "textContentDetails1");
                let workoutTitleH1 = document.createElement("h1");
                workoutTitleH1.textContent = workoutTitle;
                let workoutRepsP = document.createElement("p");
                workoutRepsP.textContent = workoutSets;
                textContentDetails1.appendChild(workoutTitleH1);
                textContentDetails1.appendChild(workoutRepsP);
                textContentDiv.appendChild(textContentDetails2);
                textContentDiv.appendChild(textContentDetails1);
                workoutDiv.appendChild(textContentDiv);
                let removeButton = document.createElement("button");
                removeButton.textContent = "X";
                textContentDetails2.appendChild(removeButton);
                workoutCardsDiv.appendChild(workoutDiv);

                notify(`Added ${workoutTitle}`, "green");
                if (pointer) {
                    pointer.remove();
                    pointer = null;
                }
                removeButton.addEventListener("click", () => {
                    addedWorkouts.delete(workoutTitle);
                    totalWorkoutTime -= workoutTime;
                    document.getElementById("totalWorkoutTime").textContent = totalWorkoutTime + " minutes";
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
            const planResponse = await fetch('/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(planPayload),
            });
            if (planResponse.ok) {
                const planData = await planResponse.json();
                if(planData && planData.planID) {
                    const planID = planData.planID;
                    window.location.href = `/workout.html?planID=${planID}`;
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
        const username = localStorage.getItem("userName");
        switch(event.state.page) {
            case "homepage":
                homepage(username);
                break;
            case "newWorkout":
                newWorkout(username);
                break;
            case "createPlan":
                createPlan(event.state.workoutName, username);
                break;
            default:
                console.log("No such page state exists.");
        }
    }
});
