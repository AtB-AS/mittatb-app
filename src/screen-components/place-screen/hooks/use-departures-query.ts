import {DeparturesVariables, getDepartures} from '@atb/api/bff/departures';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';

type UseGetDeparturesQueryProps = {
  query: DeparturesVariables;
};

export const useDeparturesQuery = ({query}: UseGetDeparturesQueryProps) => {
  return useQuery({
    queryKey: ['departureData', query],
    queryFn: () => getDepartures(query),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    refetchInterval: 30 * ONE_SECOND_MS,
  });
};
