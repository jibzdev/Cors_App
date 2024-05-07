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

- Second year Web Programming Coursework / UP2115783

## Coursework Description

This coursework project is all about building a web application for managing workout plans. It's designed to help users keep track of their fitness routines and make adjustments as needed. The app is pretty straightforward but packs a lot of features under the hood. Everything from creating and modifying workout plans to tracking your progress over time is included. It's built to be user-friendly so that even if you're not a tech whiz, you'll find it easy to navigate and use.

## Key features

1. **User Account Creation and Login**: Users can create their own account and log in. The system handles user data and stores it in the database.

2. **Custom Workout Plans**: After logging in, users can create personalized workout plans. They can:
   - Name their workout plan.
   - Add or remove specific workouts from a predefined list.

3. **Workout Execution**: Once a workout plan is created, users can:
   - Start, pause, and stop the workout as needed.
   - Adjust rest times between activities during the workout.
   - Control sound volumes for alerts and notifications during the workout.
   - View a list of the chosen workouts to keep track of the current activity and what's next.

4. **Workout Sharing and Management**: Users can:
   - Share their workout plans with friends or on social media.
   - Access, review, and delete their saved workout plans at any time.

5. **Persistent Storage**: All user-created workout plans are saved in the user's profile for future access. This allows users to maintain and improve their fitness routines over time without needing to recreate plans.

6. **Modern Styling and Mobile Compatibility**: The application is designed with a modern aesthetic and is fully compatible with mobile devices, ensuring a seamless user experience across all platforms.
These features ensure that users have a comprehensive and user-friendly experience while managing their workouts, making the CORS APP an essential tool for personal fitness management.


## Additional Features (If More Time Was Available)

1. **Code Optimization for Enhanced Performance**:
    - Clean up the current code to remove repeated parts and make it easier to manage by using functions and parts that can be reused. This will make the app work smoother and perform better.
    - If i had more time to work on the project i would have made sure i do not use innerHTML alot because there are better ways of going about it , i prevented using innerHTML alot however the userWorkoutArea.js i had to implement it because i endede up going crazy and i needed to save time so i had to comprimise. Also i ended up using ALOT OF ID's which looking over my code i could have done a million times better. I had alot of stuff going on in my life during this coursework therefore it really did kill alot of my time.

2. **Enhanced Security Measures**:
   - Implement encryption for sensitive user information, especially passwords, to ensure data privacy and security.
   - Introduce comprehensive security protocols to safeguard against unauthorized access and data breaches.

3. **Expanded Administrative Control**:
   - Provide administrators with enhanced capabilities to manage user accounts and workout plans.
   - Allow staff to create and manage other staff accounts, enabling better oversight and delegation of responsibilities.
   - Implement features for administrators to monitor user activities and modify user information as needed.

4. **User Profile Customization**:
   - Enable users to update their profile information, such as name, email, and password, directly from their account settings.
   - Improve the efficiency of the system to ensure smoother and faster user interactions with fewer bugs.

5. **Notification System**:
   - Develop a notification system to keep users informed about important updates, maintenance periods, and optimal usage times.
   - Consider integrating email notifications to alert users about significant events or changes related to their workout plans.

6. **Workout Customization**:
    - Allow users to customize the duration of each workout and rest period according to their preferences.
    - Enable users to adjust the sequence of workouts, adding or removing specific exercises as desired.
    - Provide options to modify the intensity of workouts, such as changing weights or speeds, to better suit the user's fitness level.
    - Include functionality for users to save these customizations as part of their personal workout plans, which can be reused or further modified in the future.

** CORE REQUIREMENTS MET **
- Build a custom HIIT workout from scratch. ✓
    - Create multiple activities, where each activity has: ✓
        - a name (e.g. Squats, Lunges, Rest) ✓
        - a description ✓
        - a duration ✓
- Start, stop and pause workouts ✓

When a workout is started it should:
- Accurately keep time ✓
- Keep the user informed about what they are supposed to do, and when to change activities ✓
