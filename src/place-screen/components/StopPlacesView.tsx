import {Quay, StopPlace} from '@atb/api/types/departures';
import {Feedback} from '@atb/components/feedback';
import {useFavorites, UserFavoriteDepartures} from '@atb/favorites';
import {SearchTime, StopPlaceAndQuay} from '../types';
import {StyleSheet} from '@atb/theme';
import React, {useEffect, useMemo} from 'react';
import {RefreshControl, SectionList, SectionListData, View} from 'react-native';
import {QuaySection} from './QuaySection';
import {FavoriteToggle} from './FavoriteToggle';
import {DateSelection} from './DateSelection';
import {StopPlacesMode} from '@atb/nearby-stop-places/types';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {useDeparturesData} from '../hooks/use-departures-data';
import {WalkingDistance} from '@atb/components/walking-distance';
import {useAnalytics} from '@atb/analytics';

const NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW = 5;
const NUMBER_OF_DEPARTURES_IN_BUFFER = 5;

type Props = {
  stopPlaces: StopPlace[];
  showTimeNavigation?: boolean;
  navigateToQuay: (sp: StopPlace, quay: Quay) => void;
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
  isFocused: boolean;
  testID?: string;
  addedFavoritesVisibleOnDashboard?: boolean;
  mode: StopPlacesMode;
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
  } = props;
  const styles = useStyles();
  const {favoriteDepartures} = useFavorites();
  const {t} = useTranslation();
  const analytics = useAnalytics();
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
      sp.id,
      sp.quays?.map((q) => q.id),
    ),
  );

  // If all favorites are removed while setShowOnlyFavorites is true, reset the
  // value to false
  useEffect(() => {
    if (!placeHasFavorites) setShowOnlyFavorites(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteDepartures]);

  const lastIndex = quays?.length ? quays.length - 1 : 0;

  return (
    <SectionList
      ListHeaderComponent={
        <>
          {didLoadingDataFail && (
            <View
              style={[
                styles.messageBox,
                !showTimeNavigation ? styles.marginBottom : undefined,
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
          {mode === 'Map' ? (
            <>
              <WalkingDistance
                distance={props.distance}
                style={styles.walkingDistance}
              />
              <View style={styles.buttonsContainer}>
                <View style={styles.travelButton}>
                  <Button
                    text={t(DeparturesDialogSheetTexts.travelFrom.title)}
                    onPress={() => {
                      analytics.logEvent(
                        'Map',
                        'Stop place travelFrom button clicked',
                        {id: stopPlaces[0].id},
                      );
                      props.setTravelTarget &&
                        props.setTravelTarget('fromLocation');
                    }}
                    mode="primary"
                    style={styles.travelFromButtonPadding}
                  />
                </View>
                <View style={styles.travelButton}>
                  <Button
                    text={t(DeparturesDialogSheetTexts.travelTo.title)}
                    onPress={() => {
                      analytics.logEvent(
                        'Map',
                        'Stop place travelTo button clicked',
                        {id: stopPlaces[0].id},
                      );
                      props.setTravelTarget &&
                        props.setTravelTarget('toLocation');
                    }}
                    mode="primary"
                    style={styles.travelToButtonPadding}
                  />
                </View>
              </View>
              <ThemeText
                type="body__secondary"
                color="secondary"
                style={styles.title}
              >
                {t(DeparturesTexts.header.title)}
              </ThemeText>
            </>
          ) : undefined}
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
        <>
          <QuaySection
            quay={item.quay}
            isLoading={state.isLoading}
            departuresPerQuay={NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW}
            data={state.data}
            didLoadingDataFail={didLoadingDataFail}
            navigateToDetails={navigateToDetails}
            navigateToQuay={(quay) => navigateToQuay(item.stopPlace, quay)}
            testID={'quaySection' + index}
            stopPlace={item.stopPlace}
            showOnlyFavorites={showOnlyFavorites}
            addedFavoritesVisibleOnDashboard={addedFavoritesVisibleOnDashboard}
            searchDate={searchStartTime}
            mode={mode}
          />
          {mode === 'Departure' && index === lastIndex && (
            <Feedback
              viewContext="departures"
              metadata={quayListData}
              avoidResetOnMetadataUpdate
            />
          )}
        </>
      )}
    />
  );
};

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
    paddingTop: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
  headerWithoutNavigation: {
    marginHorizontal: theme.spacings.medium,
  },
  messageBox: {
    marginHorizontal: theme.spacings.medium,
  },
  marginBottom: {
    marginBottom: theme.spacings.medium,
  },
  buttonsContainer: {
    padding: theme.spacings.medium,
    flexDirection: 'row',
  },
  travelButton: {
    flex: 1,
  },
  travelFromButtonPadding: {
    marginRight: theme.spacings.medium / 2,
  },
  travelToButtonPadding: {
    marginLeft: theme.spacings.medium / 2,
  },
  loadingIndicator: {
    padding: theme.spacings.medium,
  },
  title: {
    marginTop: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
  walkingDistance: {
    paddingBottom: theme.spacings.medium,
  },
}));
