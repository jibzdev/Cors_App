
-- Creating user table
CREATE TABLE IF NOT EXISTS Users (
    User_ID INTEGER PRIMARY KEY, 
    User_Name TEXT,
    User_Email TEXT, 
    User_DOB TEXT,
    User_Password TEXT
);

-- creating default admin user
INSERT INTO Users (User_Name, User_Email, User_DOB, User_Password) VALUES
("admin", "admin@admin.com", "01/01/2000", "admin");

-- Creating Workouts table
CREATE TABLE IF NOT EXISTS Workouts ( 
    Workout_ID INTEGER PRIMARY KEY,
    Workout_Name TEXT,
    Workout_Description TEXT,
    Workout_Duration INTEGER,
    Workout_Sets TEXT
);

-- Creating Plans table
CREATE TABLE IF NOT EXISTS WorkoutPlans ( 
    Plan_ID INTEGER PRIMARY KEY,
    User_ID INTEGER,
    Plan_Name TEXT,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);

-- Creating workout plans table
CREATE TABLE IF NOT EXISTS PlanWorkouts (
    PlanWorkout_ID INTEGER PRIMARY KEY,
    Plan_ID INTEGER,
    Workout_ID INTEGER,
    FOREIGN KEY (Plan_ID) REFERENCES WorkoutPlans(Plan_ID),
    FOREIGN KEY (Workout_ID) REFERENCES Workouts(Workout_ID)
);

-- Creating ineserts for workouts table
INSERT INTO Workouts (Workout_Name, Workout_Description, Workout_Duration, Workout_Sets) VALUES
    ("Burpees","A combination of jump, squat, plank, and push up. Improves overall cardio.", 300, "4x15"),
    ("Sprint Intervals","Short bursts of high intensity running followed by recovery periods.", 360, "5x100m"),
    ("Box Jumps","Plyometric exercise that improves power, speed, and strength.", 240, "4x12"),
    ("Kettlebell Swings","A full body exercise that improves power, strength, and endurance.", 300, "3x20"),
    ("Battle Ropes","High intensity intervals of waves, slams, and whips with heavy ropes.", 180, "5x30s"),
    ("Deadlifts","A weight lifting exercise that targets the lower back, hamstrings, and glutes.", 300, "3x8"),
    ("Clean and Press","Compound move of a clean and an overhead press.", 360, "4x6"),
    ("High Knees","Gets your heart pumping, and improves your coordination and flexibility.", 180, "5x20"),
    ("Mountain Climbers","Gets your heart pumping, and improves your coordination and flexibility.", 240, "4x15"),
    ("Squat Jumps","Plyometric exercise that can help you develop leg strength and explosive power.", 300, "5x12"),
    ("Tuck Jumps", "Plyometric exercise that can help you develop leg strength and explosive power.", 300, "4x10"),
    ("Skipping Rope","Improves cardio health and coordination. High intensity fast intervals.", 240, "4x1min"),
    ("Thrusters","A combination of a front squat and an overhead press. Works the legs, shoulders, and arms.", 300, "4x8"),
    ("Power Cleans","A high-intensity, explosive lift that improves power and coordination.", 300, "3x5"),
    ("Wall Balls","A full-body, high-intensity move involving a medicine ball thrown against a wall.", 240, "4x20"),
    ("Handstand Push-Ups","An upper body exercise that develops shoulder and arm strength.", 300, "3x10"),
    ("Agility Ladder","Improves speed, agility, and coordination.", 240, "5x through"),
    ("Sandbag Throws","Full body exercise focusing on power and explosiveness.", 300, "4x12"),
    ("Push Ups","Increases upper body strength and explosiveness.", 300, "4x12"),
    ("Diamond Push Ups","Increases upper body strength and explosiveness.", 300, "4x10"),
    ("Plyometric Push-Ups","Increases upper body strength and explosiveness.", 240, "3x8"),
    ("Planks", "Core strengthening exercise that improves posture and flexibility.", 180, "3x1min"),
    ("Russian Twists", "Core exercise that improves oblique strength and definition.", 240, "4x20"),
    ("Lunges", "Strengthens the legs and buttocks while improving flexibility.", 300, "4x12 Each Leg"),
    ("Squats", "Full body exercise that targets the lower body and core.", 300, "4x15"),
    ("Back Flicks", "Improves flexibility and strength in the lower back.", 240, "4x15");
