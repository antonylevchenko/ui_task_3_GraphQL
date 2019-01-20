import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';

import gql from 'graphql-tag';
import { MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';

const PRODUCTS_QUERY = gql`
query products($limit:Int) {
  products(limit:$limit) {
      id
      name
      rubPrice {
        amount
        currencyCode
      }
      currencyPrice {
        amount
        currencyCode
      }
    }
  }
`;

const CURRENCIES_QUERY = gql`
query currencies($limit:Int) {
  currencies(limit:$limit)
  }
`;

const PRICE_QUERY = gql`
query price($rubAmount: Int, $currencyCode: String) {
  price(rubAmount:$rubAmount,currencyCode:$currencyCode) {
    amount
    currencyCode
  }
}
`;


@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit {

  public displayedColumns: string[] = ['number', 'name', 'currencyControl', 'priceAmount', 'addButton'];

  public currencies: string[];
  public products: any[];

  private productsQuery: QueryRef<any>;
  private currenciesQuery: QueryRef<any>;


  dataSource = new MatTableDataSource<any>();

  constructor(private apollo: Apollo) {}

    ngOnInit() {
      this.productsQuery = this.apollo.watchQuery({
        query: PRODUCTS_QUERY,
        variables: {limit: 0}
      });

      this.productsQuery.valueChanges.subscribe(result => {
        this.products = result.data && result.data.products;
        this.currenciesQuery = this.apollo.watchQuery({
          query: CURRENCIES_QUERY,
          variables: {limit: 0}
        });
        this.currenciesQuery.valueChanges.subscribe(res => {
          this.currencies = res.data && res.data.currencies;
          console.log(this.currencies);
          this.getDataSource();
        });
      });

    }


    getDataSource() {
      const mappedDataArray = [];
      let counter = 0;
      this.products.forEach(product => {
        counter++;
        const newItem = {
          id: product.id,
          number: counter,
          name: product.name,
          currencyControl: null,
          rubAmount: product.rubPrice.amount,
          priceAmount: product.rubPrice.amount
        };
        mappedDataArray.push(newItem);
      });
      mappedDataArray.forEach(item => {
        item.currencyControl = this.createCurrencyControlForElement(item);
      });
      this.dataSource = new MatTableDataSource<any>(mappedDataArray);
      console.log(this.dataSource);
    }

  createCurrencyControlForElement(item: any) {
    const currencyControl = new FormControl('RUB');
    currencyControl.valueChanges.subscribe((newCurrencyCode) => {
      let priceQuery: QueryRef<any>;
      priceQuery = this.apollo.watchQuery({
        query: PRICE_QUERY,
        variables: {rubAmount: item.rubAmount, currencyCode: newCurrencyCode}
      });
      priceQuery.valueChanges.subscribe(res => {
        item.priceAmount = res.data && res.data.price.amount;
      });
    });
    return currencyControl;
  }


}

