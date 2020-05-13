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
      resourceAllocation: new Array(4).fill().map(() => ({}))
    }

    this.selectedPlanetList = new Set();
    this.selectedVehicles = new Map();

    this.planetSelected = (planetName, selectIndex) => {
      const
        {
          resourceAllocation,
          planets,
        } = this.state,
        {
          selectedPlanetList,
          selectedVehicles
        } = this,
        resource = {
          ...resourceAllocation[selectIndex]
        };

      selectedPlanetList.delete(resource.planetName);

      if (planetName === 'Select') {
        delete resource.planetName;
        delete resource.distance;
      } else {
        resource.planetName = planetName;
        resource.distance = planets[planets.findIndex(eachPlanet => eachPlanet.name === planetName)].distance;
        selectedPlanetList.add(planetName);
      }

      // reset the radio selection
      if (resource.vehicleName) {
        let value = selectedVehicles.get(resource.vehicleName);
        selectedVehicles.set(resource.vehicleName, --value);
        delete resource.vehicleName;
        delete resource.time;
      }

      this.setState(state => 
        ({
          ...state,
          resourceAllocation: state.resourceAllocation.map((res, i) => i === selectIndex ? resource : res)
        })
      );
    };

    this.radioClicked = (vehicleName, selectIndex, speed) => {
      const
        {
          resourceAllocation,
        } = this.state,
        {
          selectedVehicles
        } = this,
        resource = {
          ...resourceAllocation[selectIndex]
        };

      if (resource.vehicleName) {
        let value = selectedVehicles.get(resource.vehicleName);
        selectedVehicles.set(resource.vehicleName, --value);
      }

      resource.vehicleName = vehicleName;
      let value = selectedVehicles.get(vehicleName) || 0;
      selectedVehicles.set(vehicleName, ++value);

      resource.time = resource.distance  / speed;

      this.setState(state => 
        ({
          ...state,
          resourceAllocation: state.resourceAllocation.map((res, i) => i === selectIndex ? resource : res)
        })
      );
    };
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

  getTotalTime () {
    return this.state.resourceAllocation.reduce((acc, res) => acc += (res.time || 0), 0)
  }

  render() {
    let { error,
      resourceAllocation,
      planets,
      vehicles
    } = this.state,
      {
        selectedPlanetList,
        selectedVehicles
      } = this;
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
        <div>Time Taken: {this.getTotalTime()}</div>
      </div>
    );
  }
}

export default App;
