const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const fs = require('fs');

const objectId = require("mongodb").ObjectID;

const dataPath = path.join(__dirname, '/data/');

const productsDataFileName = 'products-data.json';

const productsDataFilePath = dataPath + productsDataFileName;

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
  console.log('Seeding...');
  seedDbFromFile();
  console.log('Done.');
});

function seedDbFromFile() {
  const file = fs.readFileSync(productsDataFilePath);
  const jsonProducts = JSON.parse(file);
  const productsForDb = [];
  jsonProducts.forEach(product => {
    const productForDb = {
      id: new objectId(product.id),
      name: product.name,
      price: product.price
    };
    productsForDb.push(productForDb);
  });
  const productsCollection = app.locals.productsCollection;
  productsCollection.insertMany(productsForDb);
}
