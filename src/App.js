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
      selectedVehicles: new Map(),
      resourceAllocation: new Array(4).fill().map(() => ({})),
      resourceRestriction: 4,
      totalTime: 0
    }
    this.planetSelected = (planetName, selectIndex) => {
      this.setState(state => {
        let { resourceAllocation,
          selectedPlanetList,
          planets,
          selectedVehicles
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
        // reset the radio selection
        if (resourceAllocation[selectIndex].vehicleName) {
          let lastSelectedVehicle = resourceAllocation[selectIndex].vehicleName,
            value = selectedVehicles.get(lastSelectedVehicle);
            delete resourceAllocation[selectIndex].vehicleName
          selectedVehicles.set(lastSelectedVehicle, --value)
         }
        return {
          resourceAllocation,
          selectedPlanetList
        }
      });
    }
    this.radioClicked = (vehicleName, selectIndex) => {
      this.setState(state => {
        let { 
          resourceAllocation,
          selectedVehicles
         } = state;
         if (resourceAllocation[selectIndex].vehicleName) {
          let lastSelectedVehicle = resourceAllocation[selectIndex].vehicleName,
            value = selectedVehicles.get(lastSelectedVehicle);
          selectedVehicles.set(lastSelectedVehicle, --value)
         }
        resourceAllocation[selectIndex].vehicleName = vehicleName;
          let value = selectedVehicles.get(vehicleName) || 0;
          selectedVehicles.set(vehicleName, ++value)
        return {
          resourceAllocation,
          selectedVehicles
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
      selectedPlanetList,
      selectedVehicles
    } = this.state;
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
                index={i}
                vehicles={vehicles}
                selectedVehicles={selectedVehicles}
                radioClicked={this.radioClicked}
              />))
          }
        </div>
      </div>
    );
  }
}

export default App;
