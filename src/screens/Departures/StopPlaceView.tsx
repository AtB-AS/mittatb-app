import {Place, Quay} from '@atb/api/types/departures';
import Feedback from '@atb/components/feedback';
import {useFavorites} from '@atb/favorites';
import {UserFavoriteDepartures} from '@atb/favorites/types';
import {DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW} from '@atb/screens/Departures/state/stop-place-state';
import {publicCodeCompare, SearchTime} from '@atb/screens/Departures/utils';
import {StyleSheet} from '@atb/theme';
import React, {useEffect, useMemo} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import QuaySection from './components/QuaySection';
import {useStopPlaceData} from './state/stop-place-state';

type StopPlaceViewProps = {
  stopPlace: Place;
  navigateToQuay: (quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
  searchTime: SearchTime;
  setSearchTime: (searchTime: SearchTime) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (enabled: boolean) => void;
  testID?: string;
};

export default function StopPlaceView({
  stopPlace,
  navigateToQuay,
  navigateToDetails,
  searchTime,
  setSearchTime,
  showOnlyFavorites,
  setShowOnlyFavorites,
  testID,
}: StopPlaceViewProps) {
  const styles = useStyles();
  const {favoriteDepartures} = useFavorites();
  const {state, refresh} = useStopPlaceData(
    stopPlace,
    showOnlyFavorites,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );
  const quayListData: SectionListData<Quay>[] | undefined = stopPlace.quays
    ? [{data: stopPlace.quays}]
    : undefined;

  const placeHasFavorites = hasFavorites(
    favoriteDepartures,
    stopPlace.id,
    stopPlace.quays?.map((q) => q.id),
  );

  // If all favorites are removed while setShowOnlyFavorites is true, reset the
  // value to false
  useEffect(() => {
    if (!placeHasFavorites) setShowOnlyFavorites(false);
  }, [favoriteDepartures]);

  useEffect(() => {
    refresh();
  }, [stopPlace]);

  useMemo(
    () =>
      stopPlace.quays?.sort((a, b) =>
        publicCodeCompare(a.publicCode, b.publicCode),
      ),
    [stopPlace],
  );

  return (
    <>
      {quayListData && (
        <SectionList
          refreshControl={
            <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
          }
          sections={quayListData}
          testID={testID}
          keyExtractor={(item) => item.id}
          renderItem={({item, index}) => (
            <>
              <QuaySection
                quay={item}
                departuresPerQuay={
                  DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW
                }
                data={state.data}
                navigateToDetails={navigateToDetails}
                navigateToQuay={navigateToQuay}
                testID={'quaySection' + index}
                stopPlace={stopPlace}
                showOnlyFavorites={showOnlyFavorites}
              />
            </>
          )}
        />
      )}
    </>
  );
}

export function hasFavorites(
  favorites: UserFavoriteDepartures,
  stopPlaceId?: string,
  quayIds?: string[],
) {
  return favorites.some(
    (favorite) =>
      stopPlaceId === favorite.stopId ||
      quayIds?.find((quayId) => favorite.quayId === quayId),
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    paddingVertical: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
}));
