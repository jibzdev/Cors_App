import express from 'express';
import * as databaseCMDS from './sql.mjs';
import bodyParser from 'body-parser';
import { readFileSync, writeFileSync } from 'fs';

let version;

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

import { createInterface } from 'readline';
import { exit } from 'process';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

try {
    let data = readFileSync('readme.md', 'utf8');
    let versionNumber = parseFloat(data.split('\n')[0].split(' ')[1]);

    rl.question('New version update detected. Update? (y/n) ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            versionNumber += 0.1;
            let version = versionNumber.toFixed(1);
            data = data.replace(/Version: \d+\.\d+/, `Version: ${version}`);
            writeFileSync('readme.md', data, 'utf8');
            console.log(`Updated to Version: 1.${version}`);
        } else {
            console.log("Version update canceled");
        }
        console.log(`App running on Version: 1.${versionNumber.toFixed(1)}`);
        console.log("Database Initialized.\n--------------Logs-----------\n");
        rl.close();
    });
} catch (err) {
    console.error(err);
    exit;
}

app.listen(8080);
