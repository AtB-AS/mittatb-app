import {DeparturesVariables, getDepartures} from '@atb/api/bff/departures';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_MINUTE_MS} from '@atb/utils/durations';

type UseGetDeparturesQueryProps = {
  query: DeparturesVariables;
};

export const useGetDeparturesQuery = ({query}: UseGetDeparturesQueryProps) => {
  return useQuery({
    queryKey: ['departureData', query],
    queryFn: () => getDepartures(query),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
    refetchInterval: ONE_MINUTE_MS / 2,
  });
};
