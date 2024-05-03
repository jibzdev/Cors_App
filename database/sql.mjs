import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Connecting to the database
async function connect() {
  const database = await open({
    filename: './database/storage/db.sqlite',
    driver: sqlite3.Database,
    verbose: true,
  });
  await database.migrate({ migrationsPath: './database' });
  return database;
}

const connectDB = connect();

// ADMIN FUNCTIONS
// Fetching * from important tables
export async function fetchWorkouts() {
  const db = await connectDB;
  return db.all('SELECT * FROM Workouts');
}

export async function fetchPlans() {
  const db = await connectDB;
  return db.all('SELECT * FROM WorkoutPlans');
}

export async function logUsers() {
  const db = await connectDB;
  return db.all('SELECT * FROM Users');
}

export async function updateAllWorkoutDurations(duration) {
  const db = await connectDB;
  return db.run(`
    UPDATE Workouts 
    SET Workout_Duration = ?
    WHERE Workout_ID IN (
      SELECT Workout_ID 
      FROM PlanWorkouts 
      JOIN WorkoutPlans ON PlanWorkouts.Plan_ID = WorkoutPlans.Plan_ID
      WHERE WorkoutPlans.User_ID = (
        SELECT User_ID 
        FROM Users 
        WHERE User_Name = 'admin'
      )
    )
  `, [duration]);
}

/// ////////////////////////////////////////////

// Get a specific user to check for login
export async function getUser(username, password) {
  const db = await connectDB;
  return db.get('SELECT * FROM Users WHERE User_Name = ? AND User_Password = ?', [username, password]);
}

// getting a userID from username
export async function getUserID(username) {
  const db = await connectDB;
  const user = await db.get('SELECT * FROM Users WHERE User_Name = ?', [username]);
  return user ? user.User_ID : null;
}

// getting userid from a username
export async function checkUser(username) {
  const db = await connectDB;
  return db.get('SELECT * FROM Users WHERE User_Name = ?', [username]);
}

// creating a user
export async function createUser(userData) {
  const db = await connectDB;
  const checkForExistingUser = await db.get('SELECT * FROM Users WHERE User_Name = ?', userData.username);

  if (checkForExistingUser) {
    throw new Error('Username already exists');
  }

  return db.run('INSERT INTO Users (User_Name, User_Email, User_Password, User_DOB) VALUES (?, ?, ?, ?)', [userData.username, userData.email, userData.password, userData.dob]);
}


// creating a workoutplan, get userData first to create plan for specific user
export async function createPlan(userData) {
  console.log(userData);
  const db = await connectDB;
  const planQuery = 'INSERT INTO WorkoutPlans (User_ID, Plan_Name) VALUES (?, ?)';
  const { lastID } = await db.run(planQuery, [userData.userID, userData.Plan_Name]);
  const workoutInsertQuery = 'INSERT INTO PlanWorkouts (Plan_ID, Workout_ID) VALUES (?, ?)';
  for (const workoutID of userData.Workouts) {
    await db.run(workoutInsertQuery, [lastID, workoutID]);
  }
  return lastID;
}

// show all the plans a user has
export async function showUserPlans(userData) {
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
    Total_Workout_Time: plan.Total_Workout_Time ? plan.Total_Workout_Time : 0,
  }));
}

// getting a plan based on ID
export async function getPlan(id) {
  const db = await connectDB;
  return db.all(`
        SELECT pw.Plan_ID, w.Workout_ID, w.Workout_Name, w.Workout_Description, w.Workout_Duration, w.Workout_Sets
        FROM PlanWorkouts pw
        JOIN Workouts w ON pw.Workout_ID = w.Workout_ID
        WHERE pw.Plan_ID = ?`, [id]);
}

// deleting a plan
export async function deletePlan(planID) {
  const db = await connectDB;
  const result = await db.run('DELETE FROM WorkoutPlans WHERE Plan_ID = ?', planID);
  return result.changes > 0;
}
