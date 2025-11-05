import {Quay, StopPlace} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import React, {useEffect} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import {
  DateSelection,
  type DepartureSearchTime,
} from '@atb/components/date-selection';
import {FavoriteToggle} from './FavoriteToggle';
import {QuaySection} from './QuaySection';
import {useDeparturesData} from '../hooks/use-departures-data';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {useIsFocused} from '@react-navigation/native';
import type {ContrastColor} from '@atb-as/theme';
import {useFavoritesContext} from '@atb/modules/favorites';
import {hasFavorites} from '../utils';

const NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 1000;

export type QuayViewProps = {
  quay: Quay;
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
  stopPlace: StopPlace;
  addedFavoritesVisibleOnDashboard?: boolean;
  mode: StopPlacesMode;
  backgroundColor: ContrastColor;
};

export function QuayView({
  quay,
  navigateToDetails,
  searchTime,
  setSearchTime,
  showOnlyFavorites,
  setShowOnlyFavorites,
  testID,
  stopPlace,
  addedFavoritesVisibleOnDashboard,
  mode,
  backgroundColor,
}: QuayViewProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavoritesContext();
  const searchStartTime =
    searchTime?.option !== 'now' ? searchTime.date : undefined;
  const isFocused = useIsFocused();

  const {state, forceRefresh} = useDeparturesData(
    [quay.id],
    NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
    showOnlyFavorites,
    isFocused,
    mode,
    searchStartTime,
  );

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];
  const didLoadingDataFail = !!state.isError;

  const placeHasFavorites = hasFavorites(
    favoriteDepartures,
    stopPlace.quays?.map((q) => q.id),
  );

  // If all favorites are removed while setShowOnlyFavorites is true, reset the
  // value to false
  useEffect(() => {
    if (!placeHasFavorites) setShowOnlyFavorites(false);
  }, [placeHasFavorites, setShowOnlyFavorites]);

  return (
    <SectionList
      ListHeaderComponent={
        <>
          {didLoadingDataFail && (
            <View
              style={[
                styles.messageBox,
                mode !== 'Departure' ? styles.marginBottom : undefined,
              ]}
            >
              <MessageInfoBox
                type="error"
                message={t(DeparturesTexts.message.resultFailed)}
                onPressConfig={{
                  action: forceRefresh,
                  text: t(dictionary.retry),
                }}
              />
            </View>
          )}
          {mode === 'Departure' ? (
            <View style={styles.header}>
              {placeHasFavorites && (
                <FavoriteToggle
                  enabled={showOnlyFavorites}
                  setEnabled={setShowOnlyFavorites}
                />
              )}
              <DateSelection
                searchTime={searchTime}
                setSearchTime={setSearchTime}
                backgroundColor={backgroundColor}
              />
            </View>
          ) : null}
        </>
      }
      refreshControl={
        <RefreshControl
          refreshing={state.isLoading}
          onRefresh={forceRefresh}
          testID="isLoading"
        />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <QuaySection
          quay={item}
          data={state.data}
          isLoading={state.isLoading}
          didLoadingDataFail={didLoadingDataFail}
          navigateToDetails={navigateToDetails}
          testID="quaySection"
          showOnlyFavorites={showOnlyFavorites}
          addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
          searchDate={searchStartTime}
          mode={mode}
        />
      )}
    />
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  messageBox: {
    marginHorizontal: theme.spacing.medium,
  },
  marginBottom: {
    marginBottom: 100,
  },
}));
