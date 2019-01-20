import { HeaderComponent } from './components/header/header.component';
import {Apollo, ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {DeferLoadModule} from '@trademe/ng-defer-load';
import { ProductsListComponent } from './components/products-list/products-list.component';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri: 'http://localhost:5000/graphql'}),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  declarations: [
    AppComponent,
    ProductsListComponent,
    HeaderComponent
  ],
  imports: [
    ApolloModule,
    BrowserModule,
    AngularMaterialModule,
    ScrollDispatchModule,
    AppRoutingModule,
    HttpClientModule,
    ScrollingModule,
    FlexLayoutModule,
    DeferLoadModule,
    HttpLinkModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


