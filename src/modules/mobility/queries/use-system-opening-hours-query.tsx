import {useQuery} from '@tanstack/react-query';
import {getSystemOpeningHours} from '@atb/api/mobility';
import {ONE_HOUR_MS} from '@atb/utils/durations';

// An operator's weekly opening hours barely ever change, unlike the live vehicle/station
// fields other mobility queries poll for -- a long staleTime avoids refetching on every visit
// to the help screen within the same session.
export const useSystemOpeningHoursQuery = (systemId: string | undefined) =>
  useQuery({
    queryKey: ['getSystemOpeningHours', systemId],
    queryFn: ({signal}) => getSystemOpeningHours(systemId!, {signal}),
    enabled: !!systemId,
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    retry: 5,
  });
