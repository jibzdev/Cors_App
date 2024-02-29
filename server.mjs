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


async function fetchWorkouts(req, res){
    const workouts = await databaseCMDS.fetchWorkouts();
    res.send(workouts);
}


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

async function sendNewWorkoutPlan(req, res){
    const data = req.body;
    console.log("Received User Plan: ", data);
    try {
        const planID = await databaseCMDS.createPlan(data);
        if(planID) {
            res.status(200).json({planID: planID});
        } else {
            throw new Error('Plan ID not returned');
        }
    } catch (error) {
        console.error("Error creating workout plan:", error);
        res.status(500).send("Failed to create workout plan due to an internal error.");
    }
}

async function showUserPlans(req, res) {
    const data = req.body;
    const userPlans = await databaseCMDS.showUserPlans(data);
    res.send(userPlans);
}

app.post('/signup', asyncWrap(sendNewUser));
app.post('/login', asyncWrap(login));

app.post('/user', asyncWrap(getUserIDHandler));

app.post('/plans', asyncWrap(showUserPlans));

app.get('/workouts', asyncWrap(fetchWorkouts));

app.post('/workouts', asyncWrap(sendNewWorkoutPlan));

async function getWorkout(req, res) {
    const plan = await databaseCMDS.getPlan(req.params.workoutID);
    res.send(plan);
}

app.get('/getWorkout/:workoutID', asyncWrap(getWorkout));
app.listen(8080);

console.log(`App running on Version: ${version}`);
