import {useEffect, useState} from 'react';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {initViolationsReporting} from '@atb/api/bff/mobility';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {Coordinates} from '@atb/sdk';

type ParkingViolationsState =
  | 'loading'
  | 'success'
  | 'locationRequirementNotMet'
  | 'violationsReportingDataError';

export const useParkingViolations = () => {
  const [parkingViolationsState, setParkingViolationsState] =
    useState<ParkingViolationsState>('loading');

  const [violations, setViolations] = useState<ParkingViolationType[]>([]);
  const [providers, setProviders] = useState<ViolationsReportingProvider[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates>();

  const {getCurrentCoordinates} = useGeolocationContext();

  useEffect(() => {
    const getLocationAndInitReporting = async () => {
      setParkingViolationsState('loading');
      const coordinates = await getCurrentCoordinates(true);
      setCoordinates(coordinates);
      if (coordinates) {
        try {
          const violationsReportingData = await initViolationsReporting({
            lat: coordinates.latitude.toString(),
            lng: coordinates.longitude.toString(),
          });
          setViolations(violationsReportingData.violations);
          setProviders(violationsReportingData.providers);
          setParkingViolationsState('success');
        } catch (err) {
          console.warn(err);
          setParkingViolationsState('violationsReportingDataError');
        }
      } else {
        setParkingViolationsState('locationRequirementNotMet');
      }
    };
    getLocationAndInitReporting();
  }, [getCurrentCoordinates]);

  return {
    isLoading: parkingViolationsState === 'loading',
    parkingViolationsState,
    coordinates,
    violations,
    providers,
  };
};
