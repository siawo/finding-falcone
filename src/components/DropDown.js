import React from 'react';
export default (props) => {
    let { planets = [],
        planetSelected = () => { },
        index = 0,
        resource = {},
        selectedPlanetList = new Set()
    } = props,
        nonSelectedPlanets = planets.filter(
            planet => !selectedPlanetList.has(planet.name) || resource.planet === planet.name
        );
    return (
        <select defaultValue={resource.planet} onChange={e => { planetSelected(e.target.value, index) }}>
            <option key='select'>Select</option>
            {
                nonSelectedPlanets.map(
                    planet => (<option key={planet.name}>{planet.name}</option>)
                )
            }
        </select>
    );
};