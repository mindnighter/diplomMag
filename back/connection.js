const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url);
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let result;
setInterval(
 () =>
  mongoClient.connect(function (err, client) {
    const db = client.db('diplom');
    const collection = db.collection('Main');

    if (err) return console.log(err);

    collection.find().toArray(function (err, results) {
      result = results;
    });
  }),
    100
  );

app.get('/', function (req, res, next) {
  res.json({ result });
});

app.post('/', function (req, res) {
  const { name, node } = req.body;
  mongoClient.connect(function (err, client) {
    const db = client.db('diplom');
    const collection = db.collection('Main');

    if (err) return console.log(err);

    collection.insert({ name, node });
  });
});

app.listen(3001, function () {
  console.log('conected to port 3001');
});