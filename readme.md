Version: 1.3


# Setup

Begin by running: 
`npm i` - to install modules

After that:
`npm start` - start the server


You should be prompted with
`Server is running on port 8080`

Then your good to go!



**PLEASE READ**

if you do not wish to sit through the durations of the workouts, a default user is created:

username: `admin`
password: `admin`

the admin user can access `localhost:8080/admin`
    - here you can adjust all workouts to 5 seconds so that you can test the app better and quicker, also this page provides all users info and their workout plans.



# CORS APP

- Second year Web Programming Coursework

## Coursework Description

This coursework project is all about building a web application for managing workout plans. It's designed to help users keep track of their fitness routines and make adjustments as needed. The app is pretty straightforward but packs a lot of features under the hood. Everything from creating and modifying workout plans to tracking your progress over time is included. It's built to be user-friendly so that even if you're not a tech whiz, you'll find it easy to navigate and use.

** CORE REQUIREMENTS MET **
- Build a custom HIIT workout from scratch. ✓
    -Create multiple activities, where each activity has: ✓
        - a name (e.g. Squats, Lunges, Rest) ✓
        - a description ✓
        - a duration ✓
- Start, stop and pause workouts ✓

When a workout is started it should:
- Accurately keep time ✓
- Keep the user informed about what they are supposed to do, and when to change activities ✓

## What I Have Accomplished

### In-Progress Features

## Additional Features (If More Time Was Available)
- **User Authentication**: Plans to implement a comprehensive user authentication system to secure user data and provide personalized experiences.
- **Workout Statistics**: Development of advanced tracking features to provide users with detailed statistics such as total workout time, calories burned, and most frequently used workouts.
- **Workout Reminders**: Addition of functionality to allow users to set reminders for their workouts, which could help in maintaining a consistent workout schedule.

## How It Works

The CORS APP is structured around a client-server architecture, designed to provide a robust and interactive workout management system. Below is a detailed explanation of its operation:

### Frontend
- **Technologies Used**: The frontend is constructed using HTML, which provides the structural foundation. CSS is used for styling, ensuring that the application is visually appealing and user-friendly. JavaScript is employed to add interactivity to the web pages, making the application dynamic and responsive to user actions.
- **Responsibilities**: The frontend is responsible for rendering the user interface, handling user inputs, and interacting with the backend server through API calls. It displays the workout data retrieved from the server and updates the interface accordingly based on user interactions.

### Backend
- **Technologies Used**: The backend utilizes Express.js, a flexible Node.js web application framework, to handle server-side logic. Sqlite is used for storing and retrieving data efficiently.
- **Responsibilities**: The backend is crucial for processing requests from the frontend, executing business logic such as user authentication, managing workout plans, and interacting with the database.  It ensures that data integrity is maintained and provides necessary data to the frontend as requested.
