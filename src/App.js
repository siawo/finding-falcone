import React, { Component } from 'react';
import './App.css';
import DropDwon from './components/DropDown.js';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      vehicles: [],
      planets: [],
      selectedPlanetList: new Set(),
      resourceAllocation: new Array(4).fill().map(() => ({})),
      resourceRestriction: 4,
      totalTime: 0
    }
    this.planetSelected = (planet, selectIndex) => {
      this.setState(state => {
        let { resourceAllocation,
          selectedPlanetList } = state;
        selectedPlanetList.delete(resourceAllocation[selectIndex].planet);
        if (planet === 'Select') {
          Object.assign(resourceAllocation[selectIndex], {
            planet: undefined
          });
        } else {
          Object.assign(resourceAllocation[selectIndex], {
            planet
          });
          selectedPlanetList.add(planet);
        }
        return {
          resourceAllocation,
          selectedPlanetList
        }
      })
    }
  }
  componentDidMount() {
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
  render() {
    let { error,
      resourceAllocation,
      planets,
      selectedPlanetList } = this.state;
    return error ? (<h1> connect to Internet</h1>) : (
      <div className="App">
        <h1>Finding Falcon</h1>
        <p>Select planets you want to search in:</p>
        {
          resourceAllocation.map((res, i) =>
            (<DropDwon
              resource={res}
              planetSelected={this.planetSelected}
              key={i}
              index={i}
              planets={planets}
              selectedPlanetList={selectedPlanetList}
            />))
        }
      </div>
    );
  }
}

export default App;
