import {Place, Quay} from '@atb/api/types/departures';
import Feedback from '@atb/components/feedback';
import {useFavorites} from '@atb/favorites';
import {UserFavoriteDepartures} from '@atb/favorites/types';
import {DEFAULT_NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW} from '@atb/screens/Departures/state/stop-place-state';
import {
  getLimitOfDeparturesPerLineByMode,
  SearchTime,
} from '@atb/screens/Departures/utils';
import {StyleSheet} from '@atb/theme';
import React, {useEffect, useMemo} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import QuaySection from './components/QuaySection';
import {useStopPlaceData} from './state/stop-place-state';
import FavoriteToggle from '@atb/screens/Departures/components/FavoriteToggle';
import DateSelection from '@atb/screens/Departures/components/DateSelection';
import {PlaceScreenMode} from '@atb/screens/Departures/PlaceScreen';

type StopPlaceViewProps = {
  stopPlace: Place;
  showTimeNavigation?: boolean;
  navigateToQuay: (quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
  ) => void;
  allowFavouriteSelection: boolean;
  searchTime: SearchTime;
  setSearchTime: (searchTime: SearchTime) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (enabled: boolean) => void;
  isFocused: boolean;
  testID?: string;
  mode: PlaceScreenMode;
};

export default function StopPlaceView({
  stopPlace,
  showTimeNavigation = true,
  navigateToQuay,
  navigateToDetails,
  allowFavouriteSelection,
  searchTime,
  setSearchTime,
  showOnlyFavorites,
  setShowOnlyFavorites,
  isFocused,
  testID,
  mode,
}: StopPlaceViewProps) {
  const styles = useStyles();
  const {favoriteDepartures} = useFavorites();
  const {state, refresh} = useStopPlaceData(
    stopPlace,
    showOnlyFavorites,
    isFocused,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
    getLimitOfDeparturesPerLineByMode(mode),
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
          ListHeaderComponent={
            mode === 'Departure' ? (
              <View
                style={
                  showTimeNavigation
                    ? styles.headerWithNavigation
                    : styles.headerWithoutNavigation
                }
              >
                {allowFavouriteSelection && placeHasFavorites && (
                  <FavoriteToggle
                    enabled={showOnlyFavorites}
                    setEnabled={setShowOnlyFavorites}
                  />
                )}
                {showTimeNavigation && (
                  <DateSelection
                    searchTime={searchTime}
                    setSearchTime={setSearchTime}
                  />
                )}
              </View>
            ) : null
          }
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
                allowFavouriteSelection={allowFavouriteSelection}
                mode={mode}
              />
              {mode === 'Departure' && index === 0 && (
                <Feedback
                  viewContext="departures"
                  metadata={quayListData}
                  avoidResetOnMetadataUpdate
                />
              )}
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

function publicCodeCompare(a?: string, b?: string): number {
  // Show quays with no public code last
  if (!a) return 1;
  if (!b) return -1;
  // If both public codes are numbers, compare as numbers (e.g. 2 < 10)
  if (parseInt(a) && parseInt(b)) {
    return parseInt(a) - parseInt(b);
  }
  // Otherwise compare as strings (e.g. K1 < K2)
  return a.localeCompare(b);
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  headerWithNavigation: {
    paddingVertical: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
  headerWithoutNavigation: {
    marginHorizontal: theme.spacings.medium,
  },
}));
