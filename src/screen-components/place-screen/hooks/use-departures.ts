import {isValidDepartureTime} from '@atb/departure-list/utils';
import {useMemo} from 'react';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {useFavoritesContext} from '@atb/modules/favorites';
import {DeparturesQueryProps, useDeparturesQuery} from './use-departures-query';
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

  return useMemo(() => {
    animateNextChange();
    return {
      departures: departuresData?.departures ?? [],
      departuresIsLoading,
      departuresIsError,
      refetchDepartures: refetchDeparturesData,
    };
  }, [
    departuresData,
    departuresIsLoading,
    departuresIsError,
    refetchDeparturesData,
  ]);
};
