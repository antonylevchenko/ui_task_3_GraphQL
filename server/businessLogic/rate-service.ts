const express = require('express');
const request = require('request');
const path = require('path');
const fs = require('fs');
const jsonParser = express.json();
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
const currentRates = [];

const dataPath = path.join(__dirname, '/data/');
const currentRatesFileName = 'current-rates.json';
const currentRatesFilePath = dataPath + currentRatesFileName;

getCurrentRates();

app.listen(6000, function() {
  console.log('rate-service is ready...');
});

app.post('/api/rates/get-price', function(req, res) {
  const args = req.body;
  const currencyCode = args.currencyCode;
  const rubAmount = args.rubAmount;
  console.log(args);
  const file = fs.readFileSync(currentRatesFilePath);
  const ratesData = JSON.parse(file).Valute;
  const rateInfo = ratesData[currencyCode];
  let resultAmount = rateInfo['Nominal'] * rubAmount / rateInfo['Value'] ;
  resultAmount = +resultAmount.toFixed(0);
  const result = {
    amount: resultAmount,
    currencyCode: currencyCode
  };
  console.log(result);
  res.send(result);

});

app.get('/api/rates/list-currencies', function(req, res) {
  if (!fs.exists(currentRatesFilePath)) {
    getCurrentRates();
  }
  const file = fs.readFileSync(currentRatesFilePath);
  const ratesData = JSON.parse(file).Valute;
  const currencies = Object.keys(ratesData);
  currencies.push('RUB');
  res.send(currencies);
});

async function getCurrentRates() {
      const response = await axios.get('https://www.cbr-xml-daily.ru/daily_json.js');
      const responseData = JSON.stringify(response.data);
      const responseDate = new Date(response.data.Date).setHours(0, 0, 0, 0);
      const currentDate = new Date().setHours(0, 0, 0, 0);
      if (responseDate !== currentDate) {
        fs.writeFileSync(currentRatesFilePath, responseData);
      }
      // console.log(body);

}

