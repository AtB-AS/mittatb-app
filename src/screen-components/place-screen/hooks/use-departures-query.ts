import {DeparturesVariables, getDepartures} from '@atb/api/bff/departures';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_MINUTE_MS} from '@atb/utils/durations';
import qs from 'query-string';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {getLimitOfDeparturesPerLineByMode, getTimeRangeByMode} from '../utils';
import {DEPARTURES_REALTIME_QUERY_KEY} from './use-departures-realtime-query';
import {useEffect} from 'react';

export type DeparturesQueryProps = {
  query: Omit<DeparturesVariables, 'startTime'> & {startTime?: string};
  mode: StopPlacesMode;
};

export const useDeparturesQuery = ({query, mode}: DeparturesQueryProps) => {
  const queryClient = useQueryClient();

  const res = useQuery({
    queryKey: ['DEPARTURES', qs.stringify(query), mode],
    queryFn: () => {
      const startTime = query.startTime ?? new Date().toISOString();
      return getDepartures({
        ...query,
        startTime,
        timeRange: query.timeRange ?? getTimeRangeByMode(mode, startTime),
        limitPerLine:
          query.limitPerLine ?? getLimitOfDeparturesPerLineByMode(mode),
      });
    },
    staleTime: 10 * ONE_MINUTE_MS,
    gcTime: ONE_HOUR_MS,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (res.status === 'success') {
      // remove rather than invalidate, in order to not trigger immediate refetch of realtime data
      queryClient.removeQueries({
        queryKey: [DEPARTURES_REALTIME_QUERY_KEY],
      });
    }
  }, [queryClient, res.status]);

  return res;
};
