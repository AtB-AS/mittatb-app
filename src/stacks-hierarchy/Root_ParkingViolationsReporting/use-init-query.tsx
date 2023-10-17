import {useQuery} from '@tanstack/react-query';
import {initViolationsReporting} from '@atb/api/mobility';
import {Coordinates} from '@atb/utils/coordinates';

const ONE_HOUR_MS = 1000 * 60 * 60;

export const useInitQuery = ({latitude, longitude}: Coordinates) =>
  useQuery({
    queryKey: ['parkingViolations', {latitude, longitude}],
    queryFn: () =>
      initViolationsReporting({
        lat: latitude.toString(),
        lng: longitude.toString(),
      }),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
    enabled: latitude !== 0 && longitude !== 0,
  });
