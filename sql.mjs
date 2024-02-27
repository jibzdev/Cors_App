import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function connect() {
    const database = await open({
        filename: './database/storage/db.sqlite',
        driver: sqlite3.Database,
        verbose: true,
    });
    await database.migrate({ migrationsPath: './database'});
    console.log("Database Initialized.\n--------------Logs-----------\n");
    return database;
};

const connectDB = connect();

// Test Functions
export async function listUsers(){
    const db = await connectDB;
    return db.all("SELECT * FROM Users");
}

export async function fetchWorkouts(){
    const db = await connectDB;
    return db.all("SELECT * FROM Workouts");
}

export async function WorkoutPlans(){
    const db = await connectDB;
    return db.all("SELECT * FROM WorkoutPlans");
}
////////////////


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


export async function createPlan(userData){
    const db = await connectDB;
    const workouts = userData.Workouts.join(',');
    return db.run('INSERT INTO WorkoutPlans (User_ID, Workouts) VALUES (?, ?)', [userData.User_ID, workouts]);
}

export async function showUserPlans(userData){
    const db = await connectDB;
    return db.get("SELECT * FROM WorkoutPlans WHERE User_ID = ?", [userData.User_ID]); 
}