import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function connect() {
    const database = await open({
        filename: './database/storage/db.sqlite',
        driver: sqlite3.Database,
        verbose: true,
    });
    await database.migrate({ migrationsPath: './database'});
    return database;
};

const connectDB = connect();

export async function fetchWorkouts(){
    const db = await connectDB;
    return db.all("SELECT * FROM Workouts");
}

export async function getUser(username, password){
    const db = await connectDB;
    return db.get("SELECT * FROM Users WHERE User_Name = ? AND User_Password = ?", [username, password]);
}

export async function getUserID(username){
    const db = await connectDB;
    const user = await db.get("SELECT * FROM Users WHERE User_Name = ?", [username]);
    return user ? user.User_ID : null;
}


export async function checkUser(username){
    const db = await connectDB;
    return db.get("SELECT * FROM Users WHERE User_Name = ?", [username]);
}

export async function createUser(userData){
    const db = await connectDB;
    const checkForExistingUser = await db.get('SELECT * FROM Users WHERE User_Name = ?', userData.username);

    if (checkForExistingUser) {
      await db.run('DELETE FROM Users WHERE User_Name = ?', userData.username);
    }
  
    return db.run('INSERT INTO Users (User_Name, User_Email, User_Password, User_DOB) VALUES (?, ?, ?, ?)', [userData.username, userData.email, userData.password, userData.dob]);
}


export async function createPlan(userData) {
    const db = await connectDB;
    const planQuery = `INSERT INTO WorkoutPlans (User_ID, Plan_Name) VALUES (?, ?)`;
    const { lastID } = await db.run(planQuery, [userData.User_ID, userData.Plan_Name]);
    const workoutInsertQuery = `INSERT INTO PlanWorkouts (Plan_ID, Workout_ID) VALUES (?, ?)`;
    for (const workoutID of userData.Workouts) {
        await db.run(workoutInsertQuery, [lastID, workoutID]);
    }
    return lastID; 
}

export async function showUserPlans(userData){
    const db = await connectDB;
    const plansQuery = `
        SELECT wp.Plan_ID, wp.Plan_Name, GROUP_CONCAT(w.Workout_Name) AS Workouts, SUM(w.Workout_Duration) AS Total_Workout_Time
        FROM WorkoutPlans wp
        LEFT JOIN PlanWorkouts pw ON wp.Plan_ID = pw.Plan_ID
        LEFT JOIN Workouts w ON pw.Workout_ID = w.Workout_ID
        WHERE wp.User_ID = ?
        GROUP BY wp.Plan_ID
    `;
    const plans = await db.all(plansQuery, [userData.User_ID]);
    return plans.map(plan => ({
        ...plan,
        Workouts: plan.Workouts ? plan.Workouts.split(',') : [],
        Total_Workout_Time: plan.Total_Workout_Time ? plan.Total_Workout_Time : 0
    })); 
}

export async function getPlan(id){
    const db = await connectDB;
    return db.all(`
        SELECT pw.Plan_ID, w.Workout_ID, w.Workout_Name, w.Workout_Description, w.Workout_Duration, w.Workout_Sets
        FROM PlanWorkouts pw
        JOIN Workouts w ON pw.Workout_ID = w.Workout_ID
        WHERE pw.Plan_ID = ?`, [id]);
}