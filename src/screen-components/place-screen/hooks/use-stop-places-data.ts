import {DepartureSearchTime} from '@atb/components/date-selection';
import {useFavoritesContext} from '@atb/modules/favorites';
import {StopPlaceAndQuay} from '../types';
import {useEffect, useMemo} from 'react';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {useDeparturesData} from './use-departures-data';
import {SectionListData} from 'react-native';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {hasFavorites, publicCodeCompare} from '../utils';

type Props = {
  searchTime: DepartureSearchTime;
  stopPlaces: StopPlace[];
  setShowOnlyFavorites: (enabled: boolean) => void;
  isFocused: boolean;
  mode: StopPlacesMode;
  showOnlyFavorites: boolean;
};

export const NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 5;
export const NUMBER_OF_DEPARTURES_IN_BUFFER = 5;

export const useStopPlaceData = ({
  searchTime,
  stopPlaces,
  setShowOnlyFavorites,
  isFocused,
  mode,
  showOnlyFavorites,
}: Props) => {
  const {favoriteDepartures} = useFavoritesContext();
  const searchStartTime =
    searchTime?.option !== 'now' ? searchTime.date : undefined;

  const stopPlaceAndQuays: StopPlaceAndQuay[] = useMemo(
    () =>
      stopPlaces
        .flatMap(
          (sp) => sp.quays?.map((quay) => ({stopPlace: sp, quay: quay})) || [],
        )
        .sort((a, b) =>
          publicCodeCompare(a.quay.publicCode, b.quay.publicCode),
        ),
    [stopPlaces],
  );

  const quays: Quay[] = stopPlaceAndQuays.map(({quay}) => quay);

  const {state, forceRefresh} = useDeparturesData(
    quays.map((q) => q.id),
    NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW + NUMBER_OF_DEPARTURES_IN_BUFFER,
    showOnlyFavorites,
    isFocused,
    mode,
    searchStartTime,
  );
  const didLoadingDataFail = !!state.error;

  const quayListData: SectionListData<StopPlaceAndQuay>[] =
    stopPlaceAndQuays.length ? [{data: stopPlaceAndQuays}] : [];

  const placeHasFavorites = stopPlaces.some((sp) =>
    hasFavorites(
      favoriteDepartures,
      sp.quays?.map((q) => q.id),
    ),
  );

  // If all favorites are removed while setShowOnlyFavorites is true, reset the
  // value to false
  useEffect(() => {
    if (!placeHasFavorites) setShowOnlyFavorites(false);
  }, [placeHasFavorites, setShowOnlyFavorites]);

  return {
    state,
    forceRefresh,
    didLoadingDataFail,
    quayListData,
    searchStartTime,
    placeHasFavorites,
  };
};
