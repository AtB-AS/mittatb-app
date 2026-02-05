import {Quay, StopPlace} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import React, {useEffect, useMemo} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import {QuaySection} from './QuaySection';
import {FavoriteToggle} from './FavoriteToggle';
import type {ContrastColor} from '@atb-as/theme';
import {
  DateSelection,
  type DepartureSearchTime,
} from '@atb/components/date-selection';
import type {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {StopPlacesError} from './StopPlacesError';
import {useFavoritesContext} from '@atb/modules/favorites';
import {StopPlaceAndQuay} from '../types';
import {
  getStopPlaceAndQuays,
  hasFavorites,
  NUMBER_OF_DEPARTURES_IN_BUFFER,
  NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
} from '../utils';
import {DeparturesProps, useDepartures} from '../hooks/use-departures';

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
  testID?: string;
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
    testID,
    mode,
    backgroundColor,
  } = props;

  const styles = useStyles();
  const {favoriteDepartures} = useFavoritesContext();
  const searchStartTime =
    searchTime?.option !== 'now' ? searchTime.date : undefined;

  const stopPlaceAndQuays: StopPlaceAndQuay[] = useMemo(
    () => getStopPlaceAndQuays(stopPlaces),
    [stopPlaces],
  );

  const quays: Quay[] = useMemo(
    () => stopPlaceAndQuays.map(({quay}) => quay),
    [stopPlaceAndQuays],
  );

  const quayListData: SectionListData<StopPlaceAndQuay>[] =
    stopPlaceAndQuays.length ? [{data: stopPlaceAndQuays}] : [];

  const placeHasFavorites = stopPlaces.some((sp) =>
    hasFavorites(
      favoriteDepartures,
      sp.quays?.map((q) => q.id),
    ),
  );

  const quayIds = quays.map((q) => q.id);
  const departuresProps: DeparturesProps = useMemo(
    () => ({
      quayIds,
      limitPerQuay:
        NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW + NUMBER_OF_DEPARTURES_IN_BUFFER,
      showOnlyFavorites,
      mode,
      startTime: searchStartTime,
    }),
    [mode, quayIds, searchStartTime, showOnlyFavorites],
  );

  const {
    departures,
    departuresIsLoading,
    departuresIsError,
    refetchDepartures,
  } = useDepartures(departuresProps);

  // If all favorites are removed while setShowOnlyFavorites is true, reset the
  // value to false
  useEffect(() => {
    if (!placeHasFavorites) setShowOnlyFavorites(false);
  }, [placeHasFavorites, setShowOnlyFavorites]);

  return (
    <SectionList
      ListHeaderComponent={
        <>
          {departuresIsError && (
            <StopPlacesError
              showTimeNavigation={showTimeNavigation}
              forceRefresh={refetchDepartures}
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
        <RefreshControl
          refreshing={departuresIsLoading}
          onRefresh={refetchDepartures}
        />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.quay.id}
      renderItem={({item, index}) => (
        <QuaySection
          quay={item.quay}
          isLoading={departuresIsLoading}
          departuresPerQuay={NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW}
          data={departures}
          didLoadingDataFail={departuresIsError}
          navigateToDetails={navigateToDetails}
          navigateToQuay={(quay) => navigateToQuay(item.stopPlace, quay)}
          testID={'quaySection' + index}
          showOnlyFavorites={showOnlyFavorites}
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
