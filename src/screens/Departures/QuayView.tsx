import {Place, Quay} from '@atb/api/types/departures';
import {useFavorites} from '@atb/favorites';
import {SearchTime, hasFavorites} from '@atb/screens/Departures/utils';
import {StyleSheet} from '@atb/theme';
import React, {useEffect, useState} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import DateNavigation from './components/DateNavigator';
import FavoriteToggle from './components/FavoriteToggle';
import QuaySection from './components/QuaySection';
import {useQuayData} from './state/quay-state';

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
}: QuayViewProps) {
  const styles = useStyles();
  const {favoriteDepartures} = useFavorites();

  const quayHasFavorites = hasFavorites(favoriteDepartures, undefined, [
    quay.id,
  ]);

  const {state, refresh} = useQuayData(
    quay,
    showOnlyFavorites && quayHasFavorites,
    searchTime?.option !== 'now' ? searchTime.date : undefined,
  );

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];

  useEffect(() => {
    refresh();
  }, [quay]);

  return (
    <SectionList
      ListHeaderComponent={
        <View style={styles.header}>
          {quayHasFavorites && (
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
          showOnlyFavorites={showOnlyFavorites && quayHasFavorites}
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
