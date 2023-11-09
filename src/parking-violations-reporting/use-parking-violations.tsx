import {useEffect, useState} from 'react';
import {useGeolocationState} from '@atb/GeolocationContext';
import {initViolationsReporting} from '@atb/api/mobility';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {Coordinates} from '@entur/sdk';

export const useParkingViolations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [violations, setViolations] = useState<ParkingViolationType[]>([]);
  const [providers, setProviders] = useState<ViolationsReportingProvider[]>([]);
  // todo: rename [position, setPosition] to [coordinates, setCoordinates], or [location, setLocation] with GeoLocation type
  const [position, setPosition] = useState<Coordinates>();

  const {getCurrentLocation} = useGeolocationState();

  useEffect(() => {
    const getLocationAndInitReporting = async () => {
      try {
        const location = await getCurrentLocation(true);
        setError(undefined);
        setIsLoading(true);
        setPosition(location.coordinates);
        const violationsReportingData = await initViolationsReporting({
          lat: location.coordinates.latitude.toString(),
          lng: location.coordinates.longitude.toString(),
        });
        setViolations(violationsReportingData.violations);
        setProviders(violationsReportingData.providers);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    getLocationAndInitReporting();
  }, [getCurrentLocation]);

  return {
    isLoading: isLoading && !error,
    isError: !!error,
    error,
    position,
    violations,
    providers,
  };
};
