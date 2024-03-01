CREATE TABLE IF NOT EXISTS Users (
    User_ID INTEGER PRIMARY KEY, 
    User_Name TEXT,
    User_Email TEXT, 
    User_DOB TEXT,
    User_Password TEXT
);

INSERT INTO Users (User_Name, User_Email, User_DOB, User_Password) VALUES
    ("admin", "admin@admin.com", "01/01/2000", "admin");

CREATE TABLE IF NOT EXISTS Workouts ( 
    Workout_ID INTEGER PRIMARY KEY,
    Workout_Name TEXT,
    Workout_Description TEXT,
    Workout_Duration TEXT
);
CREATE TABLE IF NOT EXISTS WorkoutPlans ( 
    Plan_ID INTEGER PRIMARY KEY,
    User_ID INTEGER,
    Plan_Name TEXT,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);

CREATE TABLE IF NOT EXISTS PlanWorkouts (
    PlanWorkout_ID INTEGER PRIMARY KEY,
    Plan_ID INTEGER,
    Workout_ID INTEGER,
    FOREIGN KEY (Plan_ID) REFERENCES WorkoutPlans(Plan_ID),
    FOREIGN KEY (Workout_ID) REFERENCES Workouts(Workout_ID)
);

INSERT INTO Workouts (Workout_Name, Workout_Description, Workout_Duration) VALUES
    ("Burpees","A combination of jump, squat, plank, and push up. Burns calories, improves cardio health, and works out the entire body.","5"),
    ("Jumping Jacks","Aerobic exercise and resistance work. Works your heart, lungs, and muscles at the same time.","5"),
    ("High Knees","Gets your heart pumping, and improves your coordination and flexibility.","5"),
    ("Mountain Climbers","Gets your heart pumping, and improves your coordination and flexibility.","5"),
    ("Squat Jumps","Plyometric exercise that can help you develop leg strength and explosive power.","5"),
    ("Push Ups", "Builds upper body strength. Works your chest, shoulders, triceps, and core.","5"),
    ("Plank", "Builds core strength. Works your abs, obliques, and lower back.","5"),
    ("Squat", "Builds leg strength. Works your quads, hamstrings, and glutes.","5"),
    ("Lunge", "Builds leg strength. Works your quads, hamstrings, and glutes.","5"),
    ("Deadlift", "Builds leg strength. Works your quads, hamstrings, and glutes.","5"),
    ("Russian Twists", "Builds core strength. Works your abs, obliques, and lower back.","5"),
    ("Butt Kicks", "Gets your heart pumping, and improves your coordination and flexibility.","5"),
    ("Tuck Jumps", "Plyometric exercise that can help you develop leg strength and explosive power.","5");

