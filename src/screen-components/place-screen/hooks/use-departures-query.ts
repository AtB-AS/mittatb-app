import {DeparturesVariables, getDepartures} from '@atb/api/bff/departures';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_MINUTE_MS} from '@atb/utils/durations';
import qs from 'query-string';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {getLimitOfDeparturesPerLineByMode, getTimeRangeByMode} from '../utils';
import {UserFavoriteDepartures} from '@atb/modules/favorites';

export type DeparturesQueryProps = {
  query: Omit<DeparturesVariables, 'startTime'> & {
    startTime?: string;
  };
  mode: StopPlacesMode;
  favorites?: UserFavoriteDepartures;
};

export const getDeparturesQueryKey = (
  query: DeparturesQueryProps['query'],
  mode: DeparturesQueryProps['mode'],
  favorites: DeparturesQueryProps['favorites'],
) => ['DEPARTURES', qs.stringify(query), mode, qs.stringify(favorites ?? {})];

export const useDeparturesQuery = ({
  query,
  mode,
  favorites,
}: DeparturesQueryProps) => {
  return useQuery({
    queryKey: getDeparturesQueryKey(query, mode, favorites),
    queryFn: () => {
      const startTime = query.startTime ?? new Date().toISOString();
      return getDepartures(
        {
          ...query,
          startTime,
          timeRange: query.timeRange ?? getTimeRangeByMode(mode, startTime),
          limitPerLine:
            query.limitPerLine ?? getLimitOfDeparturesPerLineByMode(mode),
        },
        mode,
        favorites,
      );
    },
    staleTime: 10 * ONE_MINUTE_MS,
    gcTime: ONE_HOUR_MS,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
