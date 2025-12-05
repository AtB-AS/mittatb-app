import {DeparturesVariables, getDepartures} from '@atb/api/bff/departures';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_MINUTE_MS} from '@atb/utils/durations';

type DeparturesQueryProps = {
  query: DeparturesVariables;
};

export const useDeparturesQuery = ({query}: DeparturesQueryProps) => {
  return useQuery({
    queryKey: ['DEPARTURES', query],
    queryFn: () => getDepartures(query),
    staleTime: 10 * ONE_MINUTE_MS,
    gcTime: ONE_HOUR_MS,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
