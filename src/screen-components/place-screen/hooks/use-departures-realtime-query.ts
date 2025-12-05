import {
  DepartureRealtimeQuery,
  getDeparturesRealtime,
} from '@atb/api/bff/departures';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {useEffect, useState} from 'react';
import qs from 'query-string';

export const DEPARTURES_REALTIME_QUERY_KEY = 'DEPARTURES_REALTIME';
const DEPARTURES_REALTIME_REFETCH_INTERVAL = 30 * ONE_SECOND_MS;

type DeparturesRealtimeQueryProps = {
  query?: DepartureRealtimeQuery;
  triggerImmediately: boolean;
};

export const useDeparturesRealtimeQuery = ({
  query,
  triggerImmediately,
}: DeparturesRealtimeQueryProps) => {
  // Support option to not trigger immediately by disabling at first
  const [enabled, setEnabled] = useState(triggerImmediately);
  useEffect(() => {
    const timeoutId = setTimeout(
      () => setEnabled(true),
      DEPARTURES_REALTIME_REFETCH_INTERVAL,
    );
    return () => clearTimeout(timeoutId);
  }, []);

  return useQuery({
    enabled,
    queryKey: [DEPARTURES_REALTIME_QUERY_KEY, qs.stringify(query ?? {})],
    queryFn: () => getDeparturesRealtime(query),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
    refetchInterval: DEPARTURES_REALTIME_REFETCH_INTERVAL,
  });
};
