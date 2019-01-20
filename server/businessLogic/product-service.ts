const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;


const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient('mongodb://localhost:27017/', {
  useNewUrlParser: true
});

let dbClient;

mongoClient.connect(function(err, client) {
  if (err) {
    return console.log(err);
  }
  dbClient = client;
  app.locals.productsCollection = client.db('StudyShopDb').collection('Products');
  app.listen(3000, function() {
    console.log('product-service is ready...');
  });
});

app.get('/api/products/list', function(req, res) {
  const collection = req.app.locals.productsCollection;
  collection.find({}).toArray(function(err, products) {
      if (err) { return console.log(err); }
      res.send(products);
  });
});
