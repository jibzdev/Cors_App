document.addEventListener('DOMContentLoaded', async function(){
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
    const today = new Date().toLocaleString('en-us', {weekday: 'short'});
    const todayElement = document.getElementById(today);
    if(todayElement) {
        todayElement.style.color = '#b67806';
    }
    const workoutsContainer = document.querySelector("#content");

    workoutPlans.forEach(plan => {
        const cardDiv = document.createElement('div');
        cardDiv.className = "cards";

        const img = document.createElement('img');
        let number =  Math.floor(Math.random() * 25) + 1;
        img.src = `assets/img/workoutimgs/${number}.jpg`;
        img.alt = "Workout Plan Image";
        cardDiv.appendChild(img);

        const headerAndButtonDiv = document.createElement('div');
        headerAndButtonDiv.className = "header-button";

        const planName = document.createElement('h1');
        planName.textContent = plan.Plan_Name;
        headerAndButtonDiv.appendChild(planName);

        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.addEventListener('click', () => window.location.href = `workout.html?planID=${plan.Plan_ID}`);
        headerAndButtonDiv.appendChild(loadButton);

        const workoutsDivCard = document.createElement('div');
        workoutsDivCard.setAttribute("class","ptexts");
        workoutsDivCard.style.maxHeight = "10%";
        workoutsDivCard.style.overflow = "scroll";
        
        if (!Array.isArray(plan.Workouts)) {
            console.error('plan.Workouts is not an array:', plan.Workouts);
        } else {
            const workoutsList = document.createElement('ul');
            plan.Workouts.forEach(workout => {
                const workoutItem = document.createElement('li');
                workoutItem.textContent = workout.trim();
                workoutsList.appendChild(workoutItem);
            });
            workoutsDivCard.innerHTML = `<h1>Total Time: ${plan.Total_Workout_Time} Minutes</h1>`;
            workoutsDivCard.appendChild(workoutsList);
        }

        let container = document.createElement("div");
        container.setAttribute("id","container");
        container.appendChild(workoutsDivCard);
        container.appendChild(headerAndButtonDiv);
        cardDiv.appendChild(container);

        workoutsContainer.appendChild(cardDiv);
    });
}
