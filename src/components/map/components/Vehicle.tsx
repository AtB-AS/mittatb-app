import React from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {VehicleIcon} from '@atb/components/vehicle-icon';

type VehicleProps = {
  vehicle: VehicleFragment;
};
export const Vehicle = ({vehicle}: VehicleProps) => {
  return (
    <MapboxGL.PointAnnotation
      id={vehicle.id}
      coordinate={[vehicle.lon, vehicle.lat]}
    >
      <VehicleIcon formFactor={vehicle.vehicleType.formFactor} />
    </MapboxGL.PointAnnotation>
  );
};
