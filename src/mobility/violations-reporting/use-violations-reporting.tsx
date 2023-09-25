import {initViolationsReporting} from '@atb/api/mobility';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {useEffect, useState} from 'react';

export const useViolationsReporting = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState<ViolationsReportingProvider[]>([]);
  const [violations, setViolations] = useState<ParkingViolationType[]>([]);

  useEffect(() => {
    initViolationsReporting(
      {lat: '63.47', lng: '10.92'}, //TODO: User position
      {baseURL: 'http://localhost:8080'},
    )
      .then((res) => {
        setProviders(res.providers);
        setViolations(res.violations);
        setIsLoading(false);
      })
      .catch(setError);
  }, []);

  return {
    providers,
    violations,
    isLoading,
    error,
  };
};
