import {Quay, StopPlace} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {RefreshControl, SectionList, View} from 'react-native';
import {QuaySection} from './QuaySection';
import {FavoriteToggle} from './FavoriteToggle';
import type {ContrastColor} from '@atb-as/theme';
import {
  DateSelection,
  type DepartureSearchTime,
} from '@atb/components/date-selection';
import type {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {
  NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
  useStopPlacesData,
} from '../hooks/use-stop-places-data';
import {StopPlacesError} from './StopPlacesError';

type Props = {
  stopPlaces: StopPlace[];
  showTimeNavigation?: boolean;
  navigateToQuay: (sp: StopPlace, quay: Quay) => void;
  navigateToDetails?: (
    serviceJourneyId: string,
    serviceDate: string,
    date: string | undefined,
    fromStopPosition: number,
  ) => void;
  searchTime: DepartureSearchTime;
  setSearchTime: (searchTime: DepartureSearchTime) => void;
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (enabled: boolean) => void;
  isFocused: boolean;
  testID?: string;
  addedFavoritesVisibleOnDashboard?: boolean;
  mode: StopPlacesMode;
  backgroundColor: ContrastColor;
} & (
  | {
      mode: 'Map';
      setTravelTarget?: (target: string) => void;
      distance?: number | undefined;
    }
  | {
      mode: 'Departure';
    }
  | {
      mode: 'Favourite';
    }
);

export const StopPlacesView = (props: Props) => {
  const {
    stopPlaces,
    showTimeNavigation = true,
    navigateToQuay,
    navigateToDetails,
    searchTime,
    setSearchTime,
    showOnlyFavorites,
    setShowOnlyFavorites,
    isFocused,
    testID,
    mode,
    addedFavoritesVisibleOnDashboard,
    backgroundColor,
  } = props;

  const styles = useStyles();
  const {
    didLoadingDataFail,
    forceRefresh,
    state,
    quayListData,
    searchStartTime,
    placeHasFavorites,
  } = useStopPlacesData({
    mode,
    searchTime,
    stopPlaces,
    setShowOnlyFavorites,
    isFocused,
    showOnlyFavorites,
  });

  return (
    <SectionList
      ListHeaderComponent={
        <>
          {didLoadingDataFail && (
            <StopPlacesError
              showTimeNavigation={showTimeNavigation}
              forceRefresh={forceRefresh}
            />
          )}
          {mode === 'Departure' ? (
            <View
              style={
                showTimeNavigation
                  ? styles.headerWithNavigation
                  : styles.headerWithoutNavigation
              }
            >
              {placeHasFavorites && (
                <FavoriteToggle
                  enabled={showOnlyFavorites}
                  setEnabled={setShowOnlyFavorites}
                />
              )}
              {showTimeNavigation && (
                <DateSelection
                  searchTime={searchTime}
                  setSearchTime={setSearchTime}
                  backgroundColor={backgroundColor}
                />
              )}
            </View>
          ) : null}
        </>
      }
      refreshControl={
        <RefreshControl refreshing={state.isLoading} onRefresh={forceRefresh} />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.quay.id}
      renderItem={({item, index}) => (
        <QuaySection
          quay={item.quay}
          isLoading={state.isLoading}
          departuresPerQuay={NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW}
          data={state.data}
          didLoadingDataFail={didLoadingDataFail}
          navigateToDetails={navigateToDetails}
          navigateToQuay={(quay) => navigateToQuay(item.stopPlace, quay)}
          testID={'quaySection' + index}
          showOnlyFavorites={showOnlyFavorites}
          addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
          searchDate={searchStartTime}
          mode={mode}
        />
      )}
    />
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  headerWithNavigation: {
    paddingTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  headerWithoutNavigation: {
    marginHorizontal: theme.spacing.medium,
  },
}));
