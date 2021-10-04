const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url);

let result;
setInterval(
  () =>
    mongoClient.connect(function (err, client) {
      const db = client.db('diplom');
      const collection = db.collection('parameters');

      if (err) return console.log(err);

      collection.find().toArray(function (err, results) {
        result = results;
      });
    }),
  1000
);

var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors());

app.get('/', function (req, res, next) {
  res.json({ result });
});

app.listen(3001, function () {
  console.log('conected to port 3001');
});
