import {getStopsDetails} from '@atb/api/departures/stops-nearest';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from "@atb/utils/durations.ts";

export const useStopsDetailsDataQuery = (ids?: Array<string>) =>
  useQuery({
    enabled: ids !== undefined,
    queryKey: ['stopDetailsData', ids],
    queryFn: () => ids && getStopsDetails({ids: ids}),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
