import {isValidDepartureTime} from '@atb/departure-list/utils';
import {EstimatedCall} from '@atb/api/types/departures';
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
  const [departures, setDepartures] = useState<EstimatedCall[]>([]);

  const {favoriteDepartures} = useFavoritesContext();

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
  } = useDeparturesQuery({
    query: departuresQuery,
    mode,
    favorites: activeFavoriteDepartures,
  });

  useInterval(
    // Re-filter when the data changes or more than 10 seconds has passed since last update
    () =>
      setDepartures(
        (departuresData?.departures ?? []).filter((departure) =>
          isValidDepartureTime(departure.expectedDepartureTime),
        ),
      ),
    [departuresData],
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
