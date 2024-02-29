import { notify } from './notification.mjs';

document.addEventListener('DOMContentLoaded', async function(){
    notify("Workout Created!", "green");
    const params = new URLSearchParams(document.location.search);
    const id = params.get('planID');
    if (id) {
        const response = await fetch(`./getWorkout/${id}`);
        if (response.ok) {
            const workoutDetails = await response.json();
            const allWorkoutsContainer = document.getElementById('allWorkouts');
            workoutDetails.forEach(workout => {
                const workoutDiv = document.createElement('div');
                workoutDiv.innerHTML = `
                    <h3>${workout.Workout_Name}</h3>
                    <p>Description: ${workout.Workout_Description}</p>
                    <p>Duration: ${workout.Workout_Duration}</p>
                `;
                allWorkoutsContainer.appendChild(workoutDiv);
            });
        } else {
            console.error('Failed to fetch workout details:', response.statusText);
        }
    } else {
        console.error('No PlanID provided in the query parameters.');
    }
});