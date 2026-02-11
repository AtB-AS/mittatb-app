import {Quay, StopPlace} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import React, {useEffect, useMemo} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import {
  DateSelection,
  type DepartureSearchTime,
} from '@atb/components/date-selection';
import {FavoriteToggle} from './FavoriteToggle';
import {QuaySection} from './QuaySection';
import {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import type {ContrastColor} from '@atb-as/theme';
import {useFavoritesContext} from '@atb/modules/favorites';
import {hasFavorites} from '../utils';
import {DeparturesProps, useDepartures} from '../hooks/use-departures';

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
  mode,
  backgroundColor,
}: QuayViewProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavoritesContext();
  const searchStartTime =
    searchTime?.option !== 'now' ? searchTime.date : undefined;

  const departuresProps: DeparturesProps = useMemo(
    () => ({
      quayIds: [quay.id],
      limitPerQuay: NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
      showOnlyFavorites,
      mode,
      startTime: searchStartTime,
    }),
    [mode, quay.id, searchStartTime, showOnlyFavorites],
  );

  const {
    departures,
    departuresIsLoading,
    departuresIsError,
    refetchDepartures,
  } = useDepartures(departuresProps);

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];

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
          {departuresIsError && (
            <View style={styles.messageBox}>
              <MessageInfoBox
                type="error"
                message={t(DeparturesTexts.message.resultFailed)}
                onPressConfig={{
                  action: refetchDepartures,
                  text: t(dictionary.retry),
                }}
              />
            </View>
          )}
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
        </>
      }
      refreshControl={
        <RefreshControl
          refreshing={departuresIsLoading}
          onRefresh={refetchDepartures}
          testID="isLoading"
        />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <QuaySection
          quay={item}
          data={departures}
          isLoading={departuresIsLoading}
          didLoadingDataFail={departuresIsError}
          navigateToDetails={navigateToDetails}
          testID="quay"
          showOnlyFavorites={showOnlyFavorites}
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
