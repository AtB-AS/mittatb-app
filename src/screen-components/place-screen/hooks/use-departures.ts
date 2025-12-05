import {DepartureRealtimeQuery} from '@atb/api/bff/departures';
import {useDeparturesRealtimeQuery} from './use-departures-realtime-query';
import {
  getDeparturesAugmentedWithRealtimeData,
  isValidDepartureTime,
} from '@atb/departure-list/utils';
import {EstimatedCall} from '@atb/api/types/departures';
import {flatMap} from '@atb/utils/array';
import {useEffect, useMemo, useState} from 'react';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {useFavoritesContext} from '@atb/modules/favorites';
import {DeparturesQueryProps, useDeparturesQuery} from './use-departures-query';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {useInterval} from '@atb/utils/use-interval';
import {animateNextChange} from '@atb/utils/animation';

export type DeparturesProps = {
  quayIds: string[];
  limitPerQuay: number;
  showOnlyFavorites: boolean;
  mode: StopPlacesMode;
  startTime?: string;
};

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
  const lineIds = activeFavoriteDepartures?.map((f) => f.lineId);

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
  } = useDeparturesQuery({
    query: departuresQuery,
    mode,
    favorites: activeFavoriteDepartures,
  });

  const departureRealtimeQuery: DepartureRealtimeQuery | undefined =
    departuresData
      ? {
          quayIds: departuresData.query.ids,
          startTime: departuresData.query.startTime,
          limit: departuresData.query.numberOfDepartures,
          limitPerLine: departuresData.query.limitPerLine,
          timeRange: departuresData.query.timeRange,
          lineIds, // only load data for favorite departures if showOnlyFavorites=true, otherwise undefined
        }
      : undefined;

  const {data: departuresRealtimeData} = useDeparturesRealtimeQuery({
    query: departureRealtimeQuery,
    triggerImmediately: false,
  });

  const augmentedDepartures: EstimatedCall[] = useMemo(() => {
    const estimatedCalls =
      departuresData && flatMap(departuresData.quays, (q) => q.estimatedCalls);

    // this line is just updating locally stored favorites if applicable, not needed to augment data
    estimatedCalls && potentiallyMigrateFavoriteDepartures(estimatedCalls);

    return getDeparturesAugmentedWithRealtimeData(
      estimatedCalls,
      departuresRealtimeData,
    );
  }, [
    departuresData,
    departuresRealtimeData,
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
