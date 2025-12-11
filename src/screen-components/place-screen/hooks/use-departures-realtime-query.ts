import {
  DepartureRealtimeQuery,
  getDeparturesRealtime,
} from '@atb/api/bff/departures';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import qs from 'query-string';

const DEPARTURES_REALTIME_QUERY_KEY = 'DEPARTURES_REALTIME';
export const DEPARTURES_REALTIME_REFETCH_INTERVAL = 30 * ONE_SECOND_MS;

type DeparturesRealtimeQueryProps = {
  query?: DepartureRealtimeQuery;
  belongsToQueryKey?: string;
  enabled: boolean;
};

export const getDeparturesRealtimeQueryKey = (
  query: DeparturesRealtimeQueryProps['query'],
  belongsToQueryKey: DeparturesRealtimeQueryProps['belongsToQueryKey'],
) => [
  DEPARTURES_REALTIME_QUERY_KEY,
  qs.stringify(query ?? {}),
  belongsToQueryKey,
];

export const useDeparturesRealtimeQuery = ({
  query,
  belongsToQueryKey,
  enabled,
}: DeparturesRealtimeQueryProps) =>
  useQuery({
    enabled,
    queryKey: getDeparturesRealtimeQueryKey(query, belongsToQueryKey),
    queryFn: () => getDeparturesRealtime(query, belongsToQueryKey),
    refetchInterval: DEPARTURES_REALTIME_REFETCH_INTERVAL,
    staleTime: DEPARTURES_REALTIME_REFETCH_INTERVAL,
    gcTime: ONE_HOUR_MS,
  });
