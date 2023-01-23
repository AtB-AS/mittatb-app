import {useEffect, useState} from 'react';
import {getVehicles} from '@atb/api/vehicles';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {GetVehiclesQueryVariables} from '@atb/api/types/generated/VehiclesQuery';

export const useVehicles = (variables: GetVehiclesQueryVariables) => {
  const [vehicles, setVehicles] = useState<VehicleFragment[]>([]);
  useEffect(() => {
    console.log(`useVehicles: Deps changed. Loading vehicles`, variables);
    getVehicles(variables).then(setVehicles);
  }, [variables.lat, variables.lon, variables.range]);

  return vehicles;
};
