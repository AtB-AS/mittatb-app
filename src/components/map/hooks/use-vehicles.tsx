import {useEffect, useState} from 'react';
import {getVehicles} from '@atb/api/vehicles';
import {VehicleFragment} from '@atb/api/types/generated/fragments/vehicles';
import {Coordinates} from '@atb/utils/coordinates';

export const useVehicles = (
  {latitude: lat, longitude: lon}: Coordinates,
  zoom: number,
) => {
  const [vehicles, setVehicles] = useState<VehicleFragment[]>([]);
  useEffect(() => {
    if (zoom > 13) {
      console.log(
        `useVehicles: Deps changed. Loading vehicles: ${JSON.stringify({
          lat,
          lon,
          zoom,
        })}`,
      );
      getVehicles({lat, lon, range: 500}).then(setVehicles);
    }
  }, [lat, lon, zoom]);

  return vehicles;
};
