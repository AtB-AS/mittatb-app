import {useCallback, useEffect, useState} from 'react';
import {useGeolocationState} from '@atb/GeolocationContext';
import {initViolationsReporting} from '@atb/api/mobility';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {Coordinates} from '@entur/sdk';

export class PermissionRequiredError extends Error {
  constructor() {
    super('Permission required');
  }
}

export const useParkingViolations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [violations, setViolations] = useState<ParkingViolationType[]>([]);
  const [providers, setProviders] = useState<ViolationsReportingProvider[]>([]);
  const [position, setPosition] = useState<Coordinates>();

  const {
    getCurrentPosition,
    status: locationPermissionStatus,
    requestPermission,
  } = useGeolocationState();

  const requestLocationPermission = useCallback(requestPermission, []);

  useEffect(() => {
    if (locationPermissionStatus !== 'granted') {
      requestLocationPermission().then((permission) => {
        if (permission !== 'granted') setError(new PermissionRequiredError());
      });
    }
  }, [locationPermissionStatus, requestLocationPermission]);

  useEffect(() => {
    if (locationPermissionStatus !== 'granted') return;
    setError(undefined);
    setIsLoading(true);
    getCurrentPosition()
      .then((position) => {
        if (!position) {
          throw new PermissionRequiredError();
        }
        setPosition({
          latitude: position.coordinates.latitude,
          longitude: position.coordinates.longitude,
        });
        return initViolationsReporting({
          lat: position.coordinates.latitude.toString(),
          lng: position.coordinates.longitude.toString(),
        });
      })
      .then((data) => {
        setViolations(data.violations);
        setProviders(data.providers);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [locationPermissionStatus]);

  return {
    isLoading: isLoading && !error,
    isError: !!error,
    error,
    position,
    violations,
    providers,
  };
};
