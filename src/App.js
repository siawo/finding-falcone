import React, { Component } from 'react';
import './App.css';
// import DropDwon from './components/DropDown.js';
import axios from 'axios';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      error: false,
      vehicles: [],
      planets: [],
      totalTime: 0
    }
  }
  componentDidMount () {
    axios.all([
      axios.get('https://findfalcone.herokuapp.com/planets'),
      axios.get('https://findfalcone.herokuapp.com/vehicles')
    ])
    .then(([planetsRes, vehiclesRes]) => {
      this.setState({
        vehicles: vehiclesRes.data,
        planets: planetsRes.data
      })
    })
    .catch(() => {
      this.setState({
        error: true
      });
    })
  }
  render () {
    let { error } = this.state;
    return error ? (<h1> connect to Internet</h1>) : (
      <div className="App">
        <h1>Finding Falcon</h1>
        <p>Select planets you want to search in:</p>
      </div>
    );
  }
}

export default App;
