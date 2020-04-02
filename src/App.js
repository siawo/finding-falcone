import React, { Component } from 'react';
import './App.css';
import DropDwon from './components/DropDown.js';
import Radio from './components/Radio.js';
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
    this.planetSelected = (planetName, selectIndex) => {
      this.setState(state => {
        let { resourceAllocation,
          selectedPlanetList,
          planets
        } = state;
        selectedPlanetList.delete(resourceAllocation[selectIndex].planetName);
        if (planetName === 'Select') {
          Object.assign(resourceAllocation[selectIndex], {
            planetName: undefined,
            distance: undefined
          });
        } else {
          Object.assign(resourceAllocation[selectIndex], {
            planetName: planetName,
            distance: planets[planets.findIndex(eachPlanet => eachPlanet.name === planetName)].distance
          });
          selectedPlanetList.add(planetName);
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
      .then(([{ data: planets }, { data: vehicles }]) => {
        this.setState({
          planets,
          vehicles
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
      vehicles,
      selectedPlanetList } = this.state;
    return error ? (<h1> connect to Internet</h1>) : (
      <div className="App">
        <h1>Finding Falcon</h1>
        <p>Select planets you want to search in:</p>
        <div>
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
        <div>
          {
            resourceAllocation.map((res, i) =>
              (<Radio
                resource={res}
                key={i}
                vehicles={vehicles}
              />))
          }
        </div>
      </div>
    );
  }
}

export default App;
