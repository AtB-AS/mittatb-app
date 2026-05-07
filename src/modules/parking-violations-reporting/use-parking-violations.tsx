import {useState, useEffect} from 'react';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {
  ParkingViolationType,
  ViolationsReportingProvider,
} from '@atb/api/types/mobility';
import {Coordinates} from '@atb/utils/coordinates';
import {useInitViolationsReportingQuery} from './queries/use-init-violations-reporting-query';

type ParkingViolationsState =
  | 'loading'
  | 'success'
  | 'locationRequirementNotMet'
  | 'violationsReportingDataError';

export const useParkingViolations = () => {
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [parkingViolationsState, setParkingViolationsState] =
    useState<ParkingViolationsState>('loading');

  const {getCurrentCoordinates} = useGeolocationContext();

  useEffect(() => {
    const resolveCoordinates = async () => {
      const coords = await getCurrentCoordinates(true);
      if (coords) {
        setCoordinates(coords);
      } else {
        setParkingViolationsState('locationRequirementNotMet');
      }
    };
    resolveCoordinates();
  }, [getCurrentCoordinates]);

  const queryParams = coordinates
    ? {
        lat: coordinates.latitude.toString(),
        lng: coordinates.longitude.toString(),
      }
    : undefined;

  const {data, isSuccess, isError} =
    useInitViolationsReportingQuery(queryParams);

  useEffect(() => {
    if (!coordinates) return;
    if (isSuccess) {
      setParkingViolationsState('success');
    } else if (isError) {
      setParkingViolationsState('violationsReportingDataError');
    }
  }, [coordinates, isSuccess, isError]);

  const violations: ParkingViolationType[] = data?.violations ?? [];
  const providers: ViolationsReportingProvider[] = data?.providers ?? [];

  return {
    isLoading: parkingViolationsState === 'loading',
    parkingViolationsState,
    coordinates,
    violations,
    providers,
  };
};
