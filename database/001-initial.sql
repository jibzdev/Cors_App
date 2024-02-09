CREATE TABLE IF NOT EXISTS Users (
    User_ID INTEGER PRIMARY KEY, 
    User_Name TEXT,
    User_Email TEXT, 
    User_DOB TEXT,
    User_Password TEXT
);

CREATE TABLE IF NOT EXISTS Workouts ( 
    WorkoutPlan_ID INTEGER PRIMARY KEY,
    User_ID INTEGER,
    Workouts TEXT,
    FOREIGN KEY(User_ID) REFERENCES Users(User_ID)
);