import { sidebarHandler, notify, dayHandler } from "./assets.js";

// Function to display the workout cards
function displayCards() {
    const workoutForm = document.createElement('form');
    workoutForm.id = 'workoutForm';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Workout Name';
    nameLabel.htmlFor = 'workoutName';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'workoutName';
    nameInput.name = 'workoutName';
    nameInput.required = true;

    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Workout Description';
    descriptionLabel.htmlFor = 'workoutDescription';
    const descriptionInput = document.createElement('textarea');
    descriptionInput.id = 'workoutDescription';
    descriptionInput.name = 'workoutDescription';
    descriptionInput.required = true;

    const durationLabel = document.createElement('label');
    durationLabel.textContent = 'Duration (in seconds)';
    durationLabel.htmlFor = 'workoutDuration';
    const durationInput = document.createElement('input');
    durationInput.type = 'number';
    durationInput.id = 'workoutDuration';
    durationInput.name = 'workoutDuration';
    durationInput.required = true;

    const setsLabel = document.createElement('label');
    setsLabel.textContent = 'Sets';
    setsLabel.htmlFor = 'workoutSets';

    const setsInput = document.createElement('input');
    setsInput.type = 'text';
    setsInput.id = 'workoutSets';
    setsInput.name = 'workoutSets';
    setsInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.id = 'createWorkoutButton';
    submitButton.type = 'submit';
    submitButton.textContent = 'Create Workout';

    workoutForm.appendChild(nameLabel);
    workoutForm.appendChild(nameInput);
    workoutForm.appendChild(descriptionLabel);
    workoutForm.appendChild(descriptionInput);
    workoutForm.appendChild(durationLabel);
    workoutForm.appendChild(durationInput);
    workoutForm.appendChild(setsLabel);
    workoutForm.appendChild(setsInput);
    workoutForm.appendChild(submitButton);

    document.querySelector('#content2').appendChild(workoutForm);
    
    // Function to update the custom card preview
    function updateCustomCardPreview() {
        const title = document.querySelector('#mockupCustomCard h3');
        title.textContent = nameInput.value || 'Title';

        const description = document.querySelector('#mockupCustomCard p.description');
        description.textContent = descriptionInput.value || 'Description';

        const duration = document.querySelector('#mockupCustomCard p.duration');
        duration.textContent = durationInput.value ? `${durationInput.value / 60} Minutes` : 'Workout Duration';

        const sets = document.querySelector('#mockupCustomCard p.sets');
        sets.textContent = setsInput.value || 'Number Of Sets';
    }

    // Function to display the custom card preview
    function displayCustomCardPreview() {
        const card = document.createElement('div');
        card.id = 'mockupCustomCard';

        const image = document.createElement('img');
        image.src = './assets/img/selection3.png';
        image.alt = 'Workout Preview';
        image.style.width = '100%';

        const infoDiv = document.createElement("div");
        infoDiv.id = "infoDiv";

        const title = document.createElement('h3');
        title.textContent = nameInput.value || 'Title';

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = descriptionInput.value || 'Description';

        const duration = document.createElement('p');
        duration.className = 'duration';
        duration.textContent = durationInput.value ? `${durationInput.value / 60} Minutes` : 'Workout Duration';

        const sets = document.createElement('p');
        sets.className = 'sets';
        sets.textContent = setsInput.value || 'Number Of Sets';

        infoDiv.appendChild(sets);
        infoDiv.appendChild(title);
        infoDiv.appendChild(description);

        card.appendChild(image);
        card.appendChild(duration);
        card.append(infoDiv);

        document.querySelector('#content2').appendChild(card);

        nameInput.addEventListener('input', updateCustomCardPreview);
        descriptionInput.addEventListener('input', updateCustomCardPreview);
        durationInput.addEventListener('input', updateCustomCardPreview);
        setsInput.addEventListener('input', updateCustomCardPreview);
    }

    displayCustomCardPreview();

    // Event listener for the submit button
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!nameInput.value || !descriptionInput.value || !durationInput.value || !setsInput.value) {
            notify("Please fill in all fields.", "red");
            return;
        }

        const payload = {
            workoutName: nameInput.value,
            workoutDescription: descriptionInput.value,
            workoutDuration: durationInput.value,
            workoutSets: setsInput.value,
            isCustom: 'TRUE'
        };

        const response = await fetch('/createWorkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const responseData = await response.json();
        console.log('Workout created:', responseData);
        notify("Workout Created!", "green");
        nameInput.value = '';
        descriptionInput.value = '';
        durationInput.value = '';
        setsInput.value = '';
        updateCustomCardPreview()
    });
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem('userName');
    document.querySelector("#userNameGreet").textContent = username;
    dayHandler();
    sidebarHandler();
    displayCards();
});