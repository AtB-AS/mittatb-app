import {FOCUS_LATITUDE, FOCUS_LONGITUDE} from '@env';
import {initViolationsReporting} from '@atb/api/mobility';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {Coordinates} from '@atb/utils/coordinates';
import {createContext, useContext, useEffect, useState} from 'react';

export const DEFAULT_POSITION: Coordinates = {
  latitude: parseFloat(FOCUS_LATITUDE),
  longitude: parseFloat(FOCUS_LONGITUDE),
};

type ParkingViolationsState = {
  isLoading: boolean;
  error: unknown;
  position: Coordinates;
  violations: ParkingViolationType[];
  providers: ViolationsReportingProvider[];
};

const ParkingViolationsContext = createContext<
  ParkingViolationsState | undefined
>(undefined);

const ParkingViolationsContextProvider: React.FC = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState<Coordinates>(DEFAULT_POSITION);
  const [providers, setProviders] = useState<ViolationsReportingProvider[]>([]);
  const [violations, setViolations] = useState<ParkingViolationType[]>([]);

  useEffect(() => {
    const userPosition = DEFAULT_POSITION; //TODO: get actual position
    setPosition(userPosition);
    initViolationsReporting({
      lat: userPosition.latitude.toString(),
      lng: userPosition.longitude.toString(),
    })
      .then((res) => {
        setProviders(res.providers);
        setViolations(res.violations);
        setIsLoading(false);
      })
      .catch(setError);
  }, []);

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
