document.addEventListener('DOMContentLoaded', async function(){
    document.querySelector("#menuIcon").addEventListener("click", () => {
        document.querySelector("#sidebar").classList.add("fade");
        document.querySelector("#sidebar").style.opacity = 1;
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest("#controlButtons")) {
            document.querySelector("#sidebar").style.opacity = 0;
        }
    });
    document.querySelector("#logoutButton").addEventListener("click", async () => {
        localStorage.removeItem("userLoggedIn");
        localStorage.removeItem("userName");
        window.location.href = `/`;
    });
    const check = localStorage.getItem("userLoggedIn");
    const username = localStorage.getItem("userName");

    if (check  === 'true'){
        greetUser();
        const userData = await fetchUserData();
        const workoutPlans = await fetchWorkoutPlans(userData.userID);
        displayWorkoutPlans(workoutPlans);
    }
    else{
        alert("not logged in");
        window.location.href = `/`;
    }
});

function greetUser() {
    const userName = localStorage.getItem("userName");
    document.querySelector("#userNameGreet").textContent = `Hello ${userName}`;
}

async function fetchUserData() {
    const username = localStorage.getItem("userName");
    const payload = { username };
    const response = await fetch('/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return response.json();
}

async function fetchWorkoutPlans(User_ID) {
    const payload = { User_ID };
    const response = await fetch('/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return response.json();
}

function displayWorkoutPlans(workoutPlans) {
    const workoutsContainer = document.querySelector("#content");

    workoutPlans.forEach(plan => {
        const cardDiv = document.createElement('div');
        cardDiv.className = "cards";

        const planName = document.createElement('h1');
        planName.textContent = plan.Plan_Name;
        cardDiv.appendChild(planName);

        const infoIcon = document.createElement('span');
        infoIcon.id = "infoIcon";
        infoIcon.innerHTML = '<i class="fa-solid fa-circle-info"></i>'
        infoIcon.style.cursor = 'pointer';
        infoIcon.style.marginLeft = '10px';
        infoIcon.addEventListener('click', () => {
            const overlay = createOverlay();
            const workoutsList = createWorkoutsList(plan.Workouts);
            overlay.appendChild(workoutsList);
            document.body.appendChild(overlay);
        });
        planName.appendChild(infoIcon);

        const duration = document.createElement('p');
        duration.textContent = `Duration: ${plan.Total_Workout_Time} Minutes`;
        cardDiv.appendChild(duration);

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => window.location.href = `workout.html?planID=${plan.Plan_ID}`);
        cardDiv.appendChild(loadButton);

        workoutsContainer.appendChild(cardDiv);
    });
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.animation = 'fade-in 0.5s';
    overlay.addEventListener('click', () => overlay.remove());
    return overlay;
}

function createWorkoutsList(workouts) {
    const workoutsList = document.createElement('div');
    workoutsList.innerHTML = `<h1>Workouts Included</h1>`;
    workoutsList.style.height = "30vh";
    workoutsList.style.overflowY = "scroll";
    workoutsList.style.overflowX = "hidden";
    workoutsList.style.padding = "25px"
    workouts.forEach(workout => {
        const workoutItem = document.createElement('p');
        workoutItem.style.textAlign = "center";
        workoutItem.textContent = workout;
        workoutsList.appendChild(workoutItem);
    });
    return workoutsList;
}
