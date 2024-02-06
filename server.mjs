const version = "1.0";

import express from 'express';
// import * as databaseCMDS from './sql.mjs';
import bodyParser from 'body-parser';

const app = express();
app.use(express.static('main'));
app.use(bodyParser.json());

// async function getPets(req, res) {
//   const pets = await safe.listPets();
//   res.send(pets);
// }

// async function getPet(req, res) {
//   const pets = await safe.getPet(req.params.id);
//   res.send(pets);
// }

// async function postPet(req) {
//   const data = req.body;
//   await console.log('Received pet data:', data);
//   safe.addPet(data);
// }

// function asyncWrap(f) {
//   return (req, res, next) => {
//     Promise.resolve(f(req, res, next))
//       .catch((e) => next(e || new Error()));
//   };
// }

// app.get('/pets', getPets);
// app.post('/pets', postPet);
// app.get('/pets/:id', asyncWrap(getPet));

app.listen(8080);

console.log(`
Database Initialized
Connected
App running om Version: ${version}
`);
