import React from 'react';
export default (props) => {
	let {
		vehicles,
		resource,
		index,
		radioClicked,
		selectedVehicles
	} = props;
	return resource.planetName ? (<div>
		{vehicles.map((vehicle, i) => {
			let vehiclesLeft = vehicle.total_no - (selectedVehicles.get(vehicle.name) || 0),
				isSameVehicleSelected = vehicle.name === resource.vehicleName;
			return (<React.Fragment key={i}>

			<input
				type='radio'
				name={'group-' + index}
				value={vehicle.name}
				checked={isSameVehicleSelected}
				disabled={!(vehiclesLeft || isSameVehicleSelected) || (vehicle.max_distance - resource.distance < 0)}
				onChange={(e) => radioClicked(e.target.value, index, vehicle.speed)}
			></input>

			<label>
				{vehicle.name}({vehiclesLeft})
      </label>

		</React.Fragment>
		)
		})}
	</div>)
		: <></>;
};