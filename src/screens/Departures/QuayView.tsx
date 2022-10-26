import {Place, Quay} from '@atb/api/types/departures';
import {useFavorites} from '@atb/favorites';
import {SearchTime} from '@atb/screens/Departures/utils';
import {StyleSheet} from '@atb/theme';
import React, {useEffect} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import DateNavigation from './components/DateNavigator';
import FavoriteToggle from './components/FavoriteToggle';
import QuaySection from './components/QuaySection';
import {useQuayData} from './state/quay-state';
import {hasFavorites} from './StopPlaceView';
import {PlaceScreenMode} from '@atb/screens/Departures/PlaceScreen';

export type QuayViewParams = {
  quay: Quay;
};

export type QuayViewProps = {
  quay: Quay;
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
  stopPlace: Place;
  mode: PlaceScreenMode;
};

export default function QuayView({
  quay,
  navigateToDetails,
  searchTime,
  setSearchTime,
  showOnlyFavorites,
  setShowOnlyFavorites,
  testID,
  stopPlace,
  mode,
}: QuayViewProps) {
  const styles = useStyles();
  const {favoriteDepartures} = useFavorites();
  const {state, refresh} = useQuayData(
    quay,
    showOnlyFavorites,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
    mode === 'Favourite' ? 1 : undefined,
  );

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];

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
  }, [quay]);

  return (
    <SectionList
      ListHeaderComponent={
        mode === 'Departure' ? (
          <View style={styles.header}>
            {placeHasFavorites && (
              <FavoriteToggle
                enabled={showOnlyFavorites}
                setEnabled={setShowOnlyFavorites}
              />
            )}
            <DateNavigation
              searchTime={searchTime}
              setSearchTime={setSearchTime}
            />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={state.isLoading} onRefresh={refresh} />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <QuaySection
          quay={item}
          data={state.data}
          navigateToDetails={navigateToDetails}
          testID={'quaySection'}
          stopPlace={stopPlace}
          showOnlyFavorites={showOnlyFavorites}
          allowFavouriteSelection={true}
        />
      )}
    />
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    paddingVertical: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
}));
