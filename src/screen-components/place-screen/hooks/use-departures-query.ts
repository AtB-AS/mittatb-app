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
import {minutesBetween} from '@atb/utils/date';

const DEPARTURES_REFETCH_INTERVAL_SECONDS = 30;
const START_TIME_REFRESH_RATE_MINUTES = 10;

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
 * DEPARTURES_REFETCH_INTERVAL_SECONDS has passed.
 *
 * When data already exists for the query key, the realtime endpoint is used instead,
 * which is more lightweight and only includes data for the updated expectedDepartureTime.
 * The departures (= estimated calls) are then augmented between the realtime data
 * and the original departures data.
 *
 * When startTime is not set on the query, it defaults to the time when getDepartures is called,
 * which is used until START_TIME_REFRESH_RATE_MINUTES is reached. It is then reset.
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
          minutesBetween(existingDeparturesData.startTime, new Date()) >
            START_TIME_REFRESH_RATE_MINUTES)
      ) {
        const startTime = query.startTime ?? new Date().toISOString();
        const departuresQuery = await getDepartures(
          {
            ...query,
            startTime,
            timeRange: query.timeRange ?? getTimeRangeByMode(mode, startTime),
            limitPerLine:
              query.limitPerLine ?? getLimitOfDeparturesPerLineByMode(mode),
          },
          favorites,
        );
        const departures = departuresQuery
          ? flatMap(departuresQuery.quays, (q) => q.estimatedCalls)
          : [];
        return {departures, startTime};
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
    staleTime: DEPARTURES_REFETCH_INTERVAL_SECONDS * ONE_SECOND_MS,
    gcTime: ONE_HOUR_MS,
    refetchInterval: (data) => {
      const lastUpdated = data.state.dataUpdatedAt;
      // Skip refetchInterval until the first successful fetch
      if (!lastUpdated) return false;

      const secondsSincePreviousFetch = (Date.now() - lastUpdated) / 1000;
      const secondsUntilNextFetch =
        DEPARTURES_REFETCH_INTERVAL_SECONDS - secondsSincePreviousFetch;

      return Math.max(secondsUntilNextFetch * ONE_SECOND_MS, 0);
    },
  });

  useEffect(() => {
    if (res.status === 'success') {
      potentiallyMigrateFavoriteDepartures(res.data.departures);
    }
  }, [res.status, res.data, potentiallyMigrateFavoriteDepartures]);

  return res;
};
