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
    const main = document.querySelector("body");
    main.innerHTML = `
    <div id="userSideBar"></div>
    <nav>
        <a id="logoutButton">Logout</a>
    </nav>
    <div id="userArea">
        
        <div id="greet">
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

        <div id="greet2">
        <h1>Hello, ${username}</h1>
        </div>
    </div>

    <section id="content">
    ${createWorkoutCard("./assets/img/selection1.png","","New Workout","Create your own HIIT workout plan.","","newWorkout").outerHTML}
    ${createWorkoutCard("./assets/img/selection2.png","","Saved Workout","Access your saved HIIT workout plans.","","savedWorkout").outerHTML}
    </section>
    <div id="selectedWorkouts"></div>
    `;

    document.querySelector("#logoutButton").addEventListener("click", async () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = `/`;
    });

    const newWorkoutButton = document.querySelector("#newWorkout");
    const savedWorkoutsButton = document.querySelector("#savedWorkout");

    savedWorkoutsButton.addEventListener("click", () => {
        location.href = "workout.html"
    });

    newWorkoutButton.addEventListener("click", async () => {
        const selectionArea = document.querySelector("#content");
        selectionArea.innerHTML = ``;
        selectionArea.innerHTML = `
        <div>
            <label for="workoutName">Name your workout plan:</label>
            <input type="text" id="workoutName" name="workoutName" placeholder="My Workout Plan">
        </div>
        `;
        const workoutNameInput = document.querySelector("#workoutName");
        workoutNameInput.addEventListener("change", async () => {
            const workoutName = workoutNameInput.value.trim();
            if(workoutName) {
                selectionArea.innerHTML = ``;
                const selection = document.querySelector("#content");
                selection.style.display = 'flex';
                selection.style.justifyContent = 'center';
                selection.style.alignContent = 'flex-start';
                selection.style.flexWrap = 'wrap';
                selection.style.alignItems = 'center';
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
                    const userData = await response.json();
                    if (response.ok) {
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
                            window.location.href = `/workout.html`;
                        } else {
                            notify("Failed to create workout plan.", "red");
                        }
                    }
                    else{
                        notify("Error fetching user data","red");
                        return
                    }
                });
            }
        });
    });

    notify("Successfully Logged In.", "green");
};