import {DepartureRealtimeQuery} from '@atb/api/bff/departures';
import {
  DEPARTURES_REALTIME_REFETCH_INTERVAL,
  getDeparturesRealtimeQueryKey,
  useDeparturesRealtimeQuery,
} from './use-departures-realtime-query';
import {
  getDeparturesAugmentedWithRealtimeData,
  isValidDepartureTime,
} from '@atb/departure-list/utils';
import {EstimatedCall} from '@atb/api/types/departures';
import {flatMap} from '@atb/utils/array';
import {useEffect, useMemo, useRef, useState} from 'react';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {useFavoritesContext} from '@atb/modules/favorites';
import {
  DeparturesQueryProps,
  getDeparturesQueryKey,
  useDeparturesQuery,
} from './use-departures-query';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {useInterval} from '@atb/utils/use-interval';
import {animateNextChange} from '@atb/utils/animation';
import qs from 'query-string';
import {useQueryClient} from '@tanstack/react-query';

export type DeparturesProps = {
  quayIds: string[];
  limitPerQuay: number;
  showOnlyFavorites: boolean;
  mode: StopPlacesMode;
  startTime?: string;
};

/**
 * First a request is sent to the departures endpoint.
 *
 * After that, data is fetched from the realtime endpoint, which is
 * more lightweight and only includes data for the updated expectedDepartureTime.
 *
 * This hook fetches and conditionally augments the data from the two.
 * The data is only augmented if the realtime query exactly matches that for departures,
 * and if the realtime data was fetched more recently than the departures data.
 *
 * Also the departures are filtered every 10s, hiding departures that already left at least 1 minute ago.
 *
 * When showOnlyFavorites=true, only data for favorites are requested.
 *
 * Note that all input data to the realtime query is based on departuresData.
 * This keeps them in sync, with realtime always following departures, and knowing
 * exactly which query is currently followed by the realtime query.
 */
export const useDepartures = ({
  quayIds,
  limitPerQuay,
  showOnlyFavorites,
  mode,
  startTime,
}: DeparturesProps) => {
  // This is the departures array to be returned, in which the raw data is augmented with realtime data and filtered on time
  const [departures, setDepartures] = useState<EstimatedCall[]>([]);

  const {favoriteDepartures, potentiallyMigrateFavoriteDepartures} =
    useFavoritesContext();

  const activeFavoriteDepartures = showOnlyFavorites
    ? favoriteDepartures
    : undefined;

  const departuresQuery: DeparturesQueryProps['query'] = {
    ids: quayIds,
    numberOfDepartures: limitPerQuay,
    startTime,
  };

  const {
    data: departuresData,
    isLoading: departuresIsLoading,
    isError: departuresIsError,
    refetch: refetchDeparturesData,
    dataUpdatedAt: departuresDataUpdatedAt,
  } = useDeparturesQuery({
    query: departuresQuery,
    mode,
    favorites: activeFavoriteDepartures,
  });

  const departuresQueryKey = departuresData
    ? qs.stringify(
        getDeparturesQueryKey(
          departuresData.query,
          departuresData.mode,
          departuresData.favorites,
        ),
      )
    : undefined;

  const departuresRealtimeQuery: DepartureRealtimeQuery | undefined =
    departuresData
      ? {
          quayIds: departuresData.query.ids,
          startTime: departuresData.query.startTime,
          limit: departuresData.query.numberOfDepartures,
          limitPerLine: departuresData.query.limitPerLine,
          timeRange: departuresData.query.timeRange,
          lineIds: departuresData.favorites?.map((f) => f.lineId),
        }
      : undefined;

  const realtimeFetchingEnabled = useRealtimeFetchingEnabled(
    departuresDataUpdatedAt,
    departuresQueryKey,
    departuresRealtimeQuery,
  );

  const {
    data: departuresRealtimeData,
    dataUpdatedAt: departuresRealtimeDataUpdatedAt,
  } = useDeparturesRealtimeQuery({
    query: departuresRealtimeQuery,
    belongsToQueryKey: departuresQueryKey,
    enabled: realtimeFetchingEnabled,
  });

  const augmentedDepartures: EstimatedCall[] = useMemo(() => {
    const estimatedCalls = departuresData
      ? flatMap(departuresData.quays, (q) => q.estimatedCalls)
      : [];

    // This line is just updating locally stored favorites if applicable, not needed to augment data
    potentiallyMigrateFavoriteDepartures(estimatedCalls);

    const shouldAugmentData =
      departuresRealtimeData?.belongsToDeparturesQueryKey ===
        departuresQueryKey &&
      departuresRealtimeDataUpdatedAt > departuresDataUpdatedAt;

    return shouldAugmentData
      ? getDeparturesAugmentedWithRealtimeData(
          estimatedCalls,
          departuresRealtimeData,
        )
      : estimatedCalls;
  }, [
    departuresData,
    departuresDataUpdatedAt,
    departuresQueryKey,
    departuresRealtimeData,
    departuresRealtimeDataUpdatedAt,
    potentiallyMigrateFavoriteDepartures,
  ]);

  useInterval(
    // Re-filter when the data changes or more than 10 seconds has passed since last update
    () =>
      setDepartures(
        augmentedDepartures.filter((departure) =>
          isValidDepartureTime(departure.expectedDepartureTime),
        ),
      ),
    [augmentedDepartures],
    10 * ONE_SECOND_MS,
    false,
    true,
  );

  useEffect(() => {
    animateNextChange();
  }, [departures]);

  return useMemo(
    () => ({
      departures,
      departuresIsLoading,
      departuresIsError,
      refetchDepartures: refetchDeparturesData,
    }),
    [departures, departuresIsLoading, departuresIsError, refetchDeparturesData],
  );
};

/**
 * At first the data from departures is already up to date, so this delays
 * enabling by one fetch interval, unless the data was cached, in which case
 * it ensures data must not be older than DEPARTURES_REALTIME_REFETCH_INTERVAL.
 */
const useRealtimeFetchingEnabled = (
  dataUpdatedAt: number,
  belongsToQueryKey?: string,
  departuresRealtimeQuery?: DepartureRealtimeQuery,
) => {
  const queryClient = useQueryClient();
  const queryKey = getDeparturesRealtimeQueryKey(
    departuresRealtimeQuery,
    belongsToQueryKey,
  );

  // Convert dataUpdatedAt to ref as it should not trigger updates
  const dataLastUpdatedAtRef = useRef(dataUpdatedAt);
  useEffect(() => {
    const queryData = queryClient.getQueryState(queryKey);
    const departuresRealtimeDataUpdatedAt = queryData?.dataUpdatedAt;
    dataLastUpdatedAtRef.current = Math.max(
      dataUpdatedAt,
      departuresRealtimeDataUpdatedAt ?? 0,
    );
  }, [dataUpdatedAt, queryClient, queryKey]);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const timeSinceLastUpdate = Date.now() - dataLastUpdatedAtRef.current;
    const remainingTimeToNextFetch =
      DEPARTURES_REALTIME_REFETCH_INTERVAL -
      (dataLastUpdatedAtRef.current ? timeSinceLastUpdate : 0);

    const enableImmediately = remainingTimeToNextFetch <= 0;
    setEnabled(enableImmediately);
    const timeoutId = enableImmediately
      ? undefined
      : setTimeout(() => setEnabled(true), remainingTimeToNextFetch);
    return () => clearTimeout(timeoutId);
  }, [belongsToQueryKey]);

  return enabled;
};
