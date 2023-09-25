import {initViolationsReporting} from '@atb/api/mobility';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {createContext, useContext, useEffect, useState} from 'react';

type ParkingViolationsState = {
  isLoading: boolean;
  error: unknown;
  violations: ParkingViolationType[];
  providers: ViolationsReportingProvider[];
};

const ParkingViolationsContext = createContext<
  ParkingViolationsState | undefined
>(undefined);

const ParkingViolationsContextProvider: React.FC = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState<ViolationsReportingProvider[]>([]);
  const [violations, setViolations] = useState<ParkingViolationType[]>([]);

  useEffect(() => {
    initViolationsReporting(
      {lat: '63.47', lng: '10.92'}, //TODO: User position
    )
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
