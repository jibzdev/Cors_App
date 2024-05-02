import express from 'express';
import * as databaseCMDS from './database/sql.mjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import bodyParser from 'body-parser';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
app.use(express.static('main'));
app.use(bodyParser.json());

function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

// ADMIN FUNCTIONS

async function fetchAllPlans(req, res) {
  const workouts = await databaseCMDS.fetchPlans();
  res.send(workouts);
}
app.get('/plans', asyncWrap(fetchAllPlans));

async function fetchWorkouts(req, res) {
  const workouts = await databaseCMDS.fetchWorkouts();
  res.send(workouts);
}
app.get('/workouts', asyncWrap(fetchWorkouts));

async function logUsers(req, res) {
  const workouts = await databaseCMDS.logUsers();
  res.send(workouts);
}
app.get('/users', asyncWrap(logUsers));
/// /////////////////////////////////////////////////////////

async function sendNewUser(req) {
  const data = req.body;
  await console.log('Recieved User Data: ', data);
  databaseCMDS.createUser(data);
}

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

async function getUserIDHandler(req, res) {
  const data = req.body;
  const user = await databaseCMDS.getUserID(data.username);
  if (user !== null) {
    res.status(200).json({ userID: user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}

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

async function getWorkout(req, res) {
  const plan = await databaseCMDS.getPlan(req.params.workoutID);
  res.send(plan);
}

app.get('/getWorkout/:workoutID', asyncWrap(getWorkout));


// handle Pages

const handlePage = (page) => (req, res) => {
  res.sendFile(`${__dirname}/main/${page}.html`);
};
app.get('/homepage', handlePage('userArea'));
app.get('/newWorkout', handlePage('userArea'));
app.get('/createPlan', handlePage('userArea'));
app.get('/savedWorkouts', handlePage('userSavedWorkouts'));

const handleError = () => (req, res) => {
  res.status(404).sendFile(`${__dirname}/404.html`);
};
app.get('*', handleError());


console.log('Server is running on port 8080');
app.listen(8080);
