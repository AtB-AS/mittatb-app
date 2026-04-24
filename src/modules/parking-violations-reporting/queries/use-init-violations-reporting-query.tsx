import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {initViolationsReporting} from '@atb/api/mobility';
import {ViolationsReportingInitQuery} from '@atb/api/types/mobility';

export const getInitViolationsReportingQueryKey = (
  lat?: string,
  lng?: string,
) => ['GET_INIT_VIOLATIONS_REPORTING', lat, lng] as const;

export const useInitViolationsReportingQuery = (
  params?: ViolationsReportingInitQuery,
) => {
  const lat = params?.lat;
  const lng = params?.lng;
  return useQuery({
    queryKey: getInitViolationsReportingQueryKey(lat, lng),
    queryFn: ({signal}) =>
      initViolationsReporting({lat: lat!, lng: lng!}, {signal}),
    enabled: !!lat && !!lng,
    gcTime: ONE_MINUTE_MS,
    retry: 5,
  });
};
