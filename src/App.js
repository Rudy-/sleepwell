import React, { Component } from 'react';
import './App.css';

import data from './data/starredCastle.json'

import CardColumns from 'react-bootstrap/CardColumns'
import Card from "react-bootstrap/Card";

import Result from './components/Result';
import Search from './components/Search';

var _ = require('lodash');

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filteredData: []
    };
  }

  filterData = (value = '', sortBy) => {
    let filteredData = data.filter(element => {
      return element.hotelName.includes(value) || element.chef.includes(value) || element.address.includes(value);
    })

    switch(sortBy) {
      case 'name':
        filteredData = _.sortBy(filteredData, ['hotelName']);
        break;

        case 'stars':
          filteredData = _.sortBy(filteredData, ['nbStars']).reverse();
          break;

        case 'hotelPrice':
          filteredData = _.sortBy(filteredData, ['priceRange']);
          break;

        case 'restaurantPrice':
          filteredData = _.SortyBy(filteredData, ['restaurantPrices']);
          break;

        default:
          console.log('No sorting.');
          break;
    }

    return this.setState({ filteredData })
  }

  render() {
    return (
      <div className="App">
        <Card>
          <Card.Body>
            <Card.Title>Sleep well with Relais & Châteaux</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">We help you to find your future destination.</Card.Subtitle>
            <Card.Text>
              <Search callback={this.filterData} />
            </Card.Text>
          </Card.Body>
        </Card>

        {this.state.filteredData.map((el, i) => {
          return (
            <Result key={i} element={el} />
          )
        })}
      </div>
    );
  }
}

export default App;
