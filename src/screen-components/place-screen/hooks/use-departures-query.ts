import {
  DepartureRealtimeQuery,
  DeparturesVariables,
  getDepartures,
  getDeparturesRealtime,
} from '@atb/api/bff/departures';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import qs from 'query-string';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {getLimitOfDeparturesPerLineByMode, getTimeRangeByMode} from '../utils';
import {
  useFavoritesContext,
  UserFavoriteDepartures,
} from '@atb/modules/favorites';
import {flatMap} from '@atb/utils/array';
import {getDeparturesAugmentedWithRealtimeData} from '@atb/departure-list/utils';
import {EstimatedCall} from '@atb/api/types/departures';
import {useEffect} from 'react';
import {secondsBetween} from '@atb/utils/date';

const DEPARTURES_REALTIME_REFETCH_INTERVAL = 30 * ONE_SECOND_MS;
const START_TIME_REFRESH_RATE_SECONDS = 10 * 60; // 10 min

type DeparturesData = {
  departures: EstimatedCall[];
  startTime: string;
};

export type DeparturesQueryProps = {
  query: Omit<DeparturesVariables, 'startTime'> & {
    startTime?: string;
  };
  mode: StopPlacesMode;
  favorites?: UserFavoriteDepartures;
};

/**
 * First a request is sent to the departures endpoint.
 *
 * The refetch interval ensures that the data is always updated after
 * DEPARTURES_REALTIME_REFETCH_INTERVAL has passed.
 *
 * When data already exists for the query key, the realtime endpoint is used instead,
 * which is more lightweight and only includes data for the updated expectedDepartureTime.
 * The departures (= estimated calls) are then augmented between the realtime data
 * and the original departures data.
 *
 * When startTime is not set on the query, it defaults to the time when getDepartures is called,
 * which is used until START_TIME_REFRESH_RATE_SECONDS is reached. It is then reset.
 */
export const useDeparturesQuery = ({
  query,
  mode,
  favorites,
}: DeparturesQueryProps) => {
  const {potentiallyMigrateFavoriteDepartures} = useFavoritesContext();

  const res = useQuery({
    queryKey: [
      'DEPARTURES',
      qs.stringify(query),
      mode,
      qs.stringify(favorites ?? {}),
    ],
    queryFn: async function ({client, queryKey}): Promise<DeparturesData> {
      const existingDeparturesData =
        client.getQueryData<DeparturesData>(queryKey);

      if (
        !existingDeparturesData ||
        (!query.startTime &&
          secondsBetween(existingDeparturesData.startTime, new Date()) >
            START_TIME_REFRESH_RATE_SECONDS)
      ) {
        const startTime = query.startTime ?? new Date().toISOString();
        const newDeparturesQuery = await getDepartures(
          {
            ...query,
            startTime,
            timeRange: query.timeRange ?? getTimeRangeByMode(mode, startTime),
            limitPerLine:
              query.limitPerLine ?? getLimitOfDeparturesPerLineByMode(mode),
          },
          favorites,
        );
        const newDepartures = newDeparturesQuery
          ? flatMap(newDeparturesQuery.quays, (q) => q.estimatedCalls)
          : [];
        return {departures: newDepartures, startTime};
      } else {
        const {startTime} = existingDeparturesData;
        const departuresRealtimeQuery: DepartureRealtimeQuery = {
          quayIds: query.ids,
          startTime,
          limit: query.numberOfDepartures,
          limitPerLine: query.limitPerLine,
          timeRange: query.timeRange,
          lineIds: favorites?.map((f) => f.lineId),
        };

        const departuresRealtimeData = await getDeparturesRealtime(
          departuresRealtimeQuery,
        );

        return {
          departures: getDeparturesAugmentedWithRealtimeData(
            existingDeparturesData.departures,
            departuresRealtimeData,
          ),
          startTime,
        };
      }
    },
    staleTime: DEPARTURES_REALTIME_REFETCH_INTERVAL,
    gcTime: ONE_HOUR_MS,
    refetchInterval: (data) => {
      const lastUpdated = data.state.dataUpdatedAt;
      // Skip refetchInterval until the first successful fetch
      if (!lastUpdated) return false;

      const timeSinceLastUpdate = Date.now() - lastUpdated;
      const remaining =
        DEPARTURES_REALTIME_REFETCH_INTERVAL - timeSinceLastUpdate;

      return Math.max(remaining, 0);
    },
  });

  useEffect(() => {
    if (res.status === 'success') {
      potentiallyMigrateFavoriteDepartures(res.data.departures);
    }
  }, [res.status, res.data, potentiallyMigrateFavoriteDepartures]);

  return res;
};
