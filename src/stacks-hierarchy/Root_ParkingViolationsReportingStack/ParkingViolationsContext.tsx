import {initViolationsReporting} from '@atb/api/mobility';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {Coordinates} from '@atb/utils/coordinates';
import {createContext, useContext, useEffect, useState} from 'react';
import {useGeolocationState} from '@atb/GeolocationContext';

export class PermissionReqiredError extends Error {
  constructor() {
    super('Permission required');
  }
}

type ParkingViolationsState = {
  isLoading: boolean;
  error: unknown;
  position: Coordinates | undefined;
  violations: ParkingViolationType[];
  providers: ViolationsReportingProvider[];
};

const ParkingViolationsContext = createContext<
  ParkingViolationsState | undefined
>(undefined);

const ParkingViolationsContextProvider: React.FC = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [providers, setProviders] = useState<ViolationsReportingProvider[]>([]);
  const [violations, setViolations] = useState<ParkingViolationType[]>([]);
  const [position, setPosition] = useState<Coordinates>();
  const {
    location: userPosition,
    status: locationPermissionStatus,
    requestPermission,
  } = useGeolocationState();

  useEffect(() => {
    console.log('location', userPosition, 'status', locationPermissionStatus);
    if (locationPermissionStatus !== 'granted') {
      requestPermission()
        .then((s) => {
          console.log('Permission requested', s);
          s === 'granted'
            ? setError(undefined)
            : setError(new PermissionReqiredError());
        })
        .catch(setError);
    }
    if (userPosition) {
      setPosition({
        latitude: userPosition.coordinates.latitude,
        longitude: userPosition.coordinates.longitude,
      });
      initViolationsReporting({
        lat: userPosition.coordinates.latitude.toString(),
        lng: userPosition.coordinates.longitude.toString(),
      })
        .then((res) => {
          setProviders(res.providers);
          setViolations(res.violations);
          setIsLoading(false);
        })
        .catch(setError);
    }
  }, [userPosition, locationPermissionStatus]);

  return (
    <ParkingViolationsContext.Provider
      value={{
        isLoading,
        error,
        position,
        violations,
        providers,
      }}
    >
      {children}
    </ParkingViolationsContext.Provider>
  );
};

export function useParkingViolationsState() {
  const context = useContext(ParkingViolationsContext);
  if (context === undefined) {
    throw new Error(
      'useParkingViolationsState must be used within a ParkingViolationsContextProvider',
    );
  }
  return context;
}

export {ParkingViolationsContextProvider};
