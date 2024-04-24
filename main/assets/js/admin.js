window.addEventListener("load", async () =>{
    const plansContainer = document.querySelector("#logWorkouts");
        let response = await fetch("/plans");
        let plans = await response.json();
        plans.forEach(plan => {
            const planDiv = document.createElement('div');
            planDiv.className = "planCard";

            const planName = document.createElement('h1');
            planName.textContent = plan.Plan_Name;
            planDiv.appendChild(planName);

            const user = document.createElement('p');
            user.textContent = `User: ${plan.User_ID}`;
            planDiv.appendChild(user);

            const totalWorkoutTime = document.createElement('p');
            totalWorkoutTime.textContent = `plan id: ${plan.Plan_ID}`;
            planDiv.appendChild(totalWorkoutTime);

            plansContainer.appendChild(planDiv);
    });

    const usersContainer = document.querySelector("#logUsers");
    let response2 = await fetch("/users");
    let users = await response2.json();
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = "userCard";

        const id = document.createElement('h1');
        id.textContent = user.User_ID;
        userDiv.appendChild(id);

        const user_name = document.createElement('p');
        user_name.textContent = `${user.User_Name}`;
        userDiv.appendChild(user_name);

        const email = document.createElement('p');
        email.textContent = `Email: ${user.User_Email}`;
        userDiv.appendChild(email);

        const dob = document.createElement('p');
        dob.textContent = `Date of Birth: ${user.User_DOB}`;
        userDiv.appendChild(dob);

        const password = document.createElement('p');
        password.textContent = `password: ${user.User_Password}`;
        userDiv.appendChild(password);

        usersContainer.appendChild(userDiv);
});
});