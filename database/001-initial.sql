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
    Workouts TEXT,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);

INSERT INTO Workouts (Workout_Name, Workout_Description, Workout_Duration) VALUES
    ("Burpees","A combination of jump, squat, plank, and push up. Burns calories, improves cardio health, and works out the entire body.","5 minutes"),
    ("Jumping Jacks","Aerobic exercise and resistance work. Works your heart, lungs, and muscles at the same time.","5 minutes"),
    ("High Knees","Gets your heart pumping, and improves your coordination and flexibility.","5 minutes"),
    ("Mountain Climbers","Gets your heart pumping, and improves your coordination and flexibility.","5 minutes"),
    ("Squat Jumps","Plyometric exercise that can help you develop leg strength and explosive power.","5 minutes"),
    ("Push Ups", "Builds upper body strength. Works your chest, shoulders, triceps, and core.","5 minutes"),
    ("Plank", "Builds core strength. Works your abs, obliques, and lower back.","5 minutes"),
    ("Squat", "Builds leg strength. Works your quads, hamstrings, and glutes.","5 minutes"),
    ("Lunge", "Builds leg strength. Works your quads, hamstrings, and glutes.","5 minutes"),
    ("Deadlift", "Builds leg strength. Works your quads, hamstrings, and glutes.","5 minutes"),
    ("Mountain Climbers", "Gets your heart pumping, and improves your coordination and flexibility.","5 minutes"),
    ("Russian Twists", "Builds core strength. Works your abs, obliques, and lower back.","5 minutes"),
    ("Butt Kicks", "Gets your heart pumping, and improves your coordination and flexibility.","5 minutes"),
    ("Tuck Jumps", "Plyometric exercise that can help you develop leg strength and explosive power.","5 minutes");

