import {getStopsDetails} from '@atb/api/departures/stops-nearest';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const useStopsDetailsDataQuery = (ids: string[]) =>
  useQuery({
    enabled: ids.length > 0,
    queryKey: ['stopDetailsData', ids],
    queryFn: () => getStopsDetails({ids}),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
