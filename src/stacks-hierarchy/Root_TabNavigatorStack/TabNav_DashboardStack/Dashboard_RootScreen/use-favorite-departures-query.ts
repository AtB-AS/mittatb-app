import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS, ONE_SECOND_MS} from '@atb/utils/durations';
import {
  useFavoritesContext,
  UserFavoriteDepartures,
} from '@atb/modules/favorites';
import {DepartureGroupMetadata, DepartureLineInfo} from '@atb/api/bff/types';
import {
  DepartureFavoritesQuery,
  getFavouriteDepartures,
} from '@atb/api/bff/departure-favorites';
import {getStopPlaceGroupRealtime} from '@atb/api/bff/departures';
import {updateStopsWithRealtime} from '@atb/departure-list/utils';
import {minutesBetween} from '@atb/utils/date';
import {flatten} from 'lodash';

const DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW = 7;
const DEPARTURES_REFETCH_INTERVAL_SECONDS = 30;
const FULL_REFRESH_INTERVAL_MINUTES = 10;

type FavoriteDeparturesData = {
  data: DepartureGroupMetadata['data'];
  metadata: DepartureGroupMetadata['metadata'] | undefined;
  startTime: string;
};

export type UseFavoriteDeparturesQueryProps = {
  dashboardFavoriteDepartures: UserFavoriteDepartures;
  enabled: boolean;
};

/**
 * On initial fetch (or after FULL_REFRESH_INTERVAL_MINUTES), calls the full
 * favorite departures endpoint. On subsequent refetches, uses the lightweight
 * realtime endpoint and merges the data.
 *
 * Refetches automatically every DEPARTURES_REFETCH_INTERVAL_SECONDS,
 * instead of using "tick" like the old code.
 */
export const useFavoriteDeparturesQuery = ({
  dashboardFavoriteDepartures,
  enabled,
}: UseFavoriteDeparturesQueryProps) => {
  const {potentiallyMigrateFavoriteDepartures} = useFavoritesContext();

  // sort favorite ID so the query cache can be used regardless of order 
  const sortedFavoriteIds = dashboardFavoriteDepartures
    .map((f) => f.id)
    .sort()
    .join(',');

  return useQuery({
    queryKey: [
      'favoriteDepartures',
      sortedFavoriteIds,
      dashboardFavoriteDepartures.length,
    ],
    queryFn: async function ({
      client,
      queryKey,
    }): Promise<FavoriteDeparturesData | null> {
      if (dashboardFavoriteDepartures.length === 0) {
        return null;
      }

      const existingData =
        client.getQueryData<FavoriteDeparturesData>(queryKey);

      const fullRefresh =
        !existingData ||
        minutesBetween(existingData.startTime, new Date()) >
          FULL_REFRESH_INTERVAL_MINUTES;

      if (fullRefresh) {
        const startTime = new Date().toISOString();
        const queryInput: DepartureFavoritesQuery = {
          limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
          startTime,
          includeCancelledTrips: true,
        };

        const result = await getFavouriteDepartures(
          dashboardFavoriteDepartures,
          queryInput,
        );

        const stopPlaceGroups = result?.data ?? [];

        // Migrate favorite departures if needed
        const departureLineInfos = flatten(
          flatten(
            stopPlaceGroups.map((stopPlaceGroup) =>
              stopPlaceGroup?.quays.map((quay) =>
                quay.group?.map((groupItem) => groupItem.lineInfo),
              ),
            ),
          ),
        ).filter(
          (departureLineInfo) => !!departureLineInfo,
        ) as DepartureLineInfo[];

        potentiallyMigrateFavoriteDepartures(departureLineInfos);

        return {
          data: stopPlaceGroups,
          metadata: result?.metadata,
          startTime,
        };
      } else {
        // Realtime update
        const lineIds = dashboardFavoriteDepartures.map((f) => f.lineId);

        const realtimeData = await getStopPlaceGroupRealtime(
          existingData.data,
          {
            limitPerLine: DEFAULT_NUMBER_OF_DEPARTURES_PER_LINE_TO_SHOW,
            startTime: existingData.startTime,
            lineIds,
          },
        );

        return {
          data: updateStopsWithRealtime(existingData.data, realtimeData),
          metadata: existingData.metadata,
          startTime: existingData.startTime,
        };
      }
    },
    staleTime: DEPARTURES_REFETCH_INTERVAL_SECONDS * ONE_SECOND_MS,
    gcTime: ONE_HOUR_MS,
    enabled: enabled && dashboardFavoriteDepartures.length > 0,
    refetchInterval: ({state: {dataUpdatedAt}}) => {
      // Skip refetchInterval until the first successful fetch
      if (!dataUpdatedAt) return false;

      const secondsSincePreviousFetch = (Date.now() - dataUpdatedAt) / 1000;
      const secondsUntilNextFetch =
        DEPARTURES_REFETCH_INTERVAL_SECONDS - secondsSincePreviousFetch;

      return Math.max(secondsUntilNextFetch, 0) * ONE_SECOND_MS;
    },
  });
};
