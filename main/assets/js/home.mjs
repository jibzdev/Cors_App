import { notify } from './notification.mjs';

document.addEventListener("DOMContentLoaded", () => {
    const check = localStorage.getItem("userLoggedIn");
    const name = localStorage.getItem("userName");

    if (check  === 'true'){
        homepage(name);
        let sidebarIcon = document.querySelector("#userSideBar");
        sidebarIcon.addEventListener("click", () => {
            const nav = document.querySelector("nav");
            if (nav.style.transform === "translateX(0%)") {
                nav.style.transform = "translateX(-100%)";
            } else {
                nav.style.transform = "translateX(0%)";
            }
        });
        document.addEventListener("click", (e) => {
            const nav = document.querySelector("nav");
            if (!sidebarIcon.contains(e.target) && !nav.contains(e.target)) {
                nav.style.transform = "translateX(-100%)";
            }
        });
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
    history.pushState({page: "homepage"}, "homepage", "homepage");
    const main = document.querySelector("body");
    main.innerHTML = `
    <nav>
    <a id="logoutButton">Logout</a>
    </nav>
    <div id="userSideBar"></div>
    <div id="userArea">
        
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
        history.pushState({page: "nameWorkout"}, "nameWorkout", "nameWorkout");
        const selectionArea = document.querySelector("#content");
        selectionArea.innerHTML = ``;
        selectionArea.innerHTML = `
        <div id="nameWorkout">
            <label for="workoutName">Name your workout plan:</label>
            <input type="text" id="workoutName" name="workoutName" placeholder="My Workout Plan">
        </div>
        `;
        const workoutNameInput = document.querySelector("#workoutName");
        workoutNameInput.addEventListener("change", async () => {
            history.pushState({page: "createPlan"}, "createPlan", "createPlan");
            const workoutName = workoutNameInput.value.trim();
            if(workoutName) {
                selectionArea.innerHTML = ``;
                const selection = document.querySelector("#content");
                document.querySelector("#content").style.marginTop = "2vw";
                let selected = document.createElement("div");
                selected.setAttribute("id","selectedWorkouts");
                document.querySelector("#userArea").after(selected);
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
                        const workoutTime = card.querySelector("p").textContent;
                        const workoutImageSrc = card.querySelector("img").src;
                        if (!addedWorkouts.has(workoutTitle)) {
                            addedWorkouts.set(workoutTitle, workoutId);
                            
                            let workoutDiv = document.createElement("div");
                            workoutDiv.setAttribute("class","selectedCards");
                            workoutDiv.innerHTML = `
                                <img src="${workoutImageSrc}" alt="Workout Image">
                                <div class="textContent">
                                <h1>${workoutTitle}</h1>
                                <p>${workoutTime}</p>
                                </div>
                            `;
                            let removeButton = document.createElement("button");
                            removeButton.textContent = "X";
                            workoutDiv.querySelector(".textContent").appendChild(removeButton);

                            selected.append(workoutDiv);
                            notify(`Added ${workoutTitle}`, "green");

                            removeButton.addEventListener("click", () => {
                                addedWorkouts.delete(workoutTitle);
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
            }
        });
    });
    notify("Successfully Logged In.", "green");
};

window.addEventListener('popstate', function(event) {
    if(event.state && event.state.page === "homepage") {
        homepage(localStorage.getItem("userName"));
    }
    else if(event.state && event.state.page === "nameWorkout") {
        document.querySelector("#newWorkout").click();
    }
    else if(event.state && event.state.page === "createPlan") {
        document.querySelector("#workoutName").dispatchEvent(new Event('change'));
    }
});