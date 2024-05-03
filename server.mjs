import express from 'express';
import * as databaseCMDS from './database/sql.mjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import bodyParser from 'body-parser';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
app.use(express.static('main'));
app.use(bodyParser.json());

// Wraps async functions to handle errors
function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

// ADMIN FUNCTIONS

// Fetches all workout plans from the database
async function fetchAllPlans(req, res) {
  const workouts = await databaseCMDS.fetchPlans();
  res.send(workouts);
}
app.get('/plans', asyncWrap(fetchAllPlans));

// Fetches all workouts from the database
async function fetchWorkouts(req, res) {
  const workouts = await databaseCMDS.fetchWorkouts();
  res.send(workouts);
}
app.get('/workouts', asyncWrap(fetchWorkouts));

// Logs all users from the database
async function logUsers(req, res) {
  const users = await databaseCMDS.logUsers();
  res.send(users);
}
app.get('/users', asyncWrap(logUsers));

// Checks if a username exists in the database
async function checkUsername(req, res) {
  const user = await databaseCMDS.checkUser(req.body.username);
  res.send(user);
}
app.post('/checkUser', asyncWrap(checkUsername));

// Updates workout durations for all workouts
async function updateWorkoutDurations(req, res) {
  const { duration } = req.body;
  try {
    await databaseCMDS.updateAllWorkoutDurations(duration);
    res.status(200).send('Workout durations updated successfully');
  } catch (error) {
    console.error('Error updating workout durations:', error);
    res.status(500).send('Internal Server Error');
  }
}
app.post('/updateWorkoutDurations', asyncWrap(updateWorkoutDurations));

/// /////////////////////////////////////////////////////////

// Creates a new user in the database
async function sendNewUser(req, res) {
  const data = req.body;
  await console.log('Received User Data: ', data);
  try {
    await databaseCMDS.createUser(data);
    res.status(200).send('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send('Bad request: ' + error.message);
  }
}

// Handles user login by checking credentials
async function login(req, res) {
  const data = req.body;
  const user = await databaseCMDS.getUser(data.username, data.password);
  if (user) {
    console.log(data.username, 'Logged in at: ', new Date().toLocaleString());
    res.status(200).send('Login successful');
  } else {
    res.status(401).send('Login failed');
  }
}

// Retrieves a user ID based on username
async function getUserIDHandler(req, res) {
  const data = req.body;
  const user = await databaseCMDS.getUserID(data.username);
  if (user !== null) {
    res.status(200).json({ userID: user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}

// Creates a new workout plan and returns the plan ID
async function sendNewWorkoutPlan(req, res) {
  const data = req.body;
  console.log('Received User Plan: ', data);
  try {
    const planID = await databaseCMDS.createPlan(data);
    if (planID) {
      res.status(200).json({ planID });
    } else {
      throw new Error('Plan ID not returned');
    }
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).send('Failed to create workout plan due to an internal error.');
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
app.delete('/plans/:planID', asyncWrap(async (req, res) => {
  const planID = req.params.planID;
  try {
    const result = await databaseCMDS.deletePlan(planID);
    if (result) {
      res.status(200).send('Plan deleted successfully');
    } else {
      res.status(404).send('Plan not found');
    }
  } catch (error) {
    console.error('Error deleting plan:', error);
  }
}));

app.post('/workouts', asyncWrap(sendNewWorkoutPlan));

// Retrieves a specific workout plan based on ID
async function getWorkout(req, res) {
  const plan = await databaseCMDS.getPlan(req.params.workoutID);
  res.send(plan);
}

app.get('/getWorkout/:workoutID', asyncWrap(getWorkout));


// handle Pages and non existant pages
const handlePage = (page) => (req, res) => {
  res.sendFile(`${__dirname}/main/${page}.html`);
};
app.get('/admin', handlePage('admin'));
app.get('/homepage', handlePage('userArea'));
app.get('/newWorkout', handlePage('userArea'));
app.get('/createPlan', handlePage('userArea'));
app.get('/savedWorkouts', handlePage('userSavedWorkouts'));

const handleError = () => (req, res) => {
  res.status(404).sendFile(`${__dirname}/404.html`);
};
app.get('*', handleError());


// display prompt when server is running
console.log('Server is running on port 8080');
app.listen(8080);
