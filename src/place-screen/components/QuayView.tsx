import {Quay, StopPlace} from '@atb/api/types/departures';
import {useFavorites} from '@atb/favorites';
import {SearchTime} from '../types';
import {StyleSheet} from '@atb/theme';
import React, {useEffect} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import DateSelection from './DateSelection';
import FavoriteToggle from './FavoriteToggle';
import QuaySection from './QuaySection';
import {useQuayData} from '../hooks/use-quay-data';
import {hasFavorites} from './StopPlaceView';
import {StopPlacesMode} from '@atb/nearby-stop-places';
import {MessageBox} from '@atb/components/message-box';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {dictionary, useTranslation} from '@atb/translations';

export type QuayViewParams = {
  quay: Quay;
};

export type QuayViewProps = {
  quay: Quay;
  navigateToDetails?: (
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
  stopPlace: StopPlace;
  addToFrontPageOnFavourite?: boolean;
  mode: StopPlacesMode;
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
  addToFrontPageOnFavourite,
  mode,
}: QuayViewProps) {
  const styles = useStyles();
  const {t} = useTranslation();
  const {favoriteDepartures} = useFavorites();
  const searchStartTime =
    searchTime?.option !== 'now' ? searchTime.date : undefined;
  const {state, forceRefresh} = useQuayData(
    quay,
    showOnlyFavorites,
    mode,
    searchStartTime,
  );

  const quayListData: SectionListData<Quay>[] = [{data: [quay]}];
  const didLoadingDataFail = !!state.error;

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
              <MessageBox
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
              />
            </View>
          ) : null}
        </>
      }
      refreshControl={
        <RefreshControl refreshing={state.isLoading} onRefresh={forceRefresh} />
      }
      sections={quayListData}
      testID={testID}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <QuaySection
          quay={item}
          data={state.data}
          didLoadingDataFail={!!state.error}
          navigateToDetails={navigateToDetails}
          testID={'quaySection'}
          stopPlace={stopPlace}
          showOnlyFavorites={showOnlyFavorites}
          addToFrontPageOnFavourite={addToFrontPageOnFavourite}
          allowFavouriteSelection={true}
          searchDate={searchStartTime}
          mode={mode}
        />
      )}
    />
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    marginTop: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
  messageBox: {
    marginHorizontal: theme.spacings.medium,
  },
  marginBottom: {
    marginBottom: 100,
  },
}));
