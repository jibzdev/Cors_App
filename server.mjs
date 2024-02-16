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

async function getAllUsers(req, res){
    const allUsers = await databaseCMDS.listUsers();
    res.send(allUsers);
    console.log(allUsers);
};

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

async function checkLogin(req,res) {
    const data = req.body;
    const user = await databaseCMDS.checkUser(data.username);
    if (user) {
        console.log(data.username, "Logged in at: ", new Date().toLocaleString());
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Login failed');
    }
}

app.get('/allUsers', asyncWrap(getAllUsers));
app.post('/signup', asyncWrap(sendNewUser));
app.post('/login', asyncWrap(login));


app.listen(8080);

console.log(`App running om Version: ${version}`);
