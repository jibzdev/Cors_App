const version = "1.0";

import express from 'express';
import * as databaseCMDS from './sql.mjs';
import bodyParser from 'body-parser';

const app = express();
app.use(express.static('main'));
app.use(bodyParser.json());

function asyncWrap(f) {
    return (req, res, next) => {
        Promise.resolve(f(req,res,next))
      .catch((e) => next(e || new Error()));
  };
}

// Test Functions
async function getAllUsers(req, res){
    const allUsers = await databaseCMDS.listUsers();
    res.send(allUsers);
};
async function fetchWorkouts(req, res){
    const workouts = await databaseCMDS.fetchWorkouts();
    res.send(workouts);
}

async function getAllPlans(req, res){
    const allUsers = await databaseCMDS.WorkoutPlans();
    res.send(allUsers);
};
////////////////////////////////////

async function sendNewUser(req){
    const data = req.body;
    await console.log("Recieved User Data: ", data);
    databaseCMDS.createUser(data);
}

async function login(req, res){
    const data = req.body;
    const user = await databaseCMDS.getUser(data.username, data.password);
    if (user) {
        console.log(data.username, "Logged in at: ", new Date().toLocaleString());
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Login failed');
    }
}

async function getUserIDHandler(req, res){
    const data = req.body;
    const user = await databaseCMDS.getUserID(data.username);
    if (user !== null) {
        res.status(200).json({ userID: user });
    } else {
        res.status(404).json({ error: "User not found" });
    }
}

async function sendNewWorkoutPlan(req){
    const data = req.body;
    await console.log("Recieved User Plan: ", data);
    databaseCMDS.createPlan(data);
}

async function showUserPlans(req,res){
    const data = req.body;
    const userPlan = await databaseCMDS.showUserPlans(data);
    if (userPlan) {
        res.status(200).send(userPlan);
    } else {
        res.status(401).send('Failed to fetch plans');
    }
}

app.post('/signup', asyncWrap(sendNewUser));
app.post('/login', asyncWrap(login));

app.post('/user', asyncWrap(getUserIDHandler));
app.get('/allUsers', asyncWrap(getAllUsers));
app.get('/getAllPlans', asyncWrap(getAllPlans));

app.get('/workouts', asyncWrap(fetchWorkouts));
app.post('/fetchWorkouts', asyncWrap(showUserPlans));
app.post('/workouts', asyncWrap(sendNewWorkoutPlan));

app.listen(8080);

console.log(`App running om Version: ${version}`);
