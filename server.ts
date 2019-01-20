const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const request = require('request');
const cors = require('cors');
const axios = require('axios');

const app = express().use(cors());

const schema = buildSchema(`
  type Query {
    products(limit:Int): [Product]
    currencies(limit:Int): [String]
    price(rubAmount:Int, currencyCode:String): Price
  }

  type Price {
    amount:Int
    currencyCode:String
  }

  type Product {
    id:String
    name:String
    rubPrice:Price
    currencyPrice:Price
  }

`);

// const schema = buildSchema(`
//   type Query {
//     products(limit:Int): [Product]
//     currencies(linit:Int): [String]
//     price(product:Product): Price
//   }

//   type Price {
//     amount:Int
//     currencyCode:String
//   }

//   type Product {
//     id:String
//     name:String
//     rubPrice:Price
//     currencyPrice:Price
//   }

// `);


app.use(express.static('dist'));

const root = {
  products: args => {
    try {
      console.log('trying to get products');
      return getProductsList();
    } catch (error) {
      console.log(error);
    }
  },
  currencies: args => {
    try {
      console.log('trying to get currencies');
      const result = getCurrenciesList();
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  },
  price: args => {
    try {
      console.log('trying to get new price with arguments');
      console.log(args);
      const result = getPrice(args);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
};

async function getPrice(args) {
  if (args.currencyCode === 'RUB') {
    return {
      amount: args.rubAmount,
      currencyCode: args.currencyCode
    };
  } else {
    const response = await axios.post('http://localhost:6000/api/rates/get-price', args);
    const data = response.data;
    return data;
  }
}

async function getCurrenciesList() {
  const response = await axios.get('http://localhost:6000/api/rates/list-currencies');
  const data = response.data;
  const currencies = data;
  return currencies;
}

async function getProductsList() {
    try {
      const response = await axios.get('http://localhost:3000/api/products/list');
      const data = response.data;
      const products = data;
      let mappedProducts = [];
      products.forEach(product => {
          const mappedProduct = {
            id: product.id,
            name: product.name,
            rubPrice: {
              amount: product.price.amount,
              currencyCode: product.price.currencyCode
            },
            currencyPrice: {
              amount: product.price.amount,
              currencyCode: product.price.currencyCode
            }
          };
          mappedProducts.push(mappedProduct);
        });
        return mappedProducts;

    } catch (error) {
      console.log(error);
    }
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(5000, err => {
  if (err) {
    return console.log(err);
  }
  return console.log('server is listening on port 5000');
});
