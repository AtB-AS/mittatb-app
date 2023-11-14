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
export class NoLocationError extends Error {
  constructor() {
    super('Location missing');
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const position = getCurrentPosition();
    if (!position) {
      setError(new NoLocationError());
      return;
    }
    setError(undefined);
    setIsLoading(true);
    setPosition({
      latitude: position.coordinates.latitude,
      longitude: position.coordinates.longitude,
    });
    initViolationsReporting({
      lat: position.coordinates.latitude.toString(),
      lng: position.coordinates.longitude.toString(),
    })
      .then((data) => {
        setViolations(data.violations);
        setProviders(data.providers);
      })
      .catch(setError)
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPermissionStatus, getCurrentPosition, initViolationsReporting]);

  return {
    isLoading: isLoading && !error,
    isError: !!error,
    error,
    position,
    violations,
    providers,
  };
};
