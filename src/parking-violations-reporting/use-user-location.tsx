import {useEffect, useState} from 'react';
import {useGeolocationState} from '@atb/GeolocationContext';
import {Coordinates} from '@atb/utils/coordinates';

export class PermissionRequiredError extends Error {
  constructor() {
    super('Permission required');
  }
}

export const useUserLocation = () => {
  const [error, setError] = useState<Error>();
  const [position, setPosition] = useState<Coordinates>();

  const {
    location: userPosition,
    status: locationPermissionStatus,
    requestPermission,
  } = useGeolocationState();

  useEffect(() => {
    if (locationPermissionStatus !== 'granted') {
      requestPermission()
        .then((s) => {
          s === 'granted'
            ? setError(undefined)
            : setError(new PermissionRequiredError());
        })
        .catch(setError);
    }
    if (userPosition) {
      setPosition({
        latitude: userPosition.coordinates.latitude,
        longitude: userPosition.coordinates.longitude,
      });
    }
  }, [userPosition, locationPermissionStatus]);

  return {position, error};
};
