import {Quay, StopPlace} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {RefreshControl, SectionList, View} from 'react-native';
import {QuaySection} from './QuaySection';
import {FavoriteToggle} from './FavoriteToggle';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {WalkingDistance} from '@atb/components/walking-distance';
import {useAnalyticsContext} from '@atb/modules/analytics';
import type {ContrastColor} from '@atb-as/theme';
import {
  DateSelection,
  type DepartureSearchTime,
} from '@atb/components/date-selection';
import type {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {
  NUMBER_OF_DEPARTURES_PER_QUAY_TO_SHOW,
  useStopPlaceData,
} from '../hooks/use-stop-places-data';

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
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const {
    didLoadingDataFail,
    forceRefresh,
    state,
    quayListData,
    searchStartTime,
    placeHasFavorites,
  } = useStopPlaceData({
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
                    expanded={true}
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
                    expanded={true}
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
                typography="body__secondary"
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
  messageBox: {
    marginHorizontal: theme.spacing.medium,
  },
  marginBottom: {
    marginBottom: theme.spacing.medium,
  },
  buttonsContainer: {
    padding: theme.spacing.medium,
    flexDirection: 'row',
  },
  travelButton: {
    flex: 1,
  },
  travelFromButtonPadding: {
    marginRight: theme.spacing.medium / 2,
  },
  travelToButtonPadding: {
    marginLeft: theme.spacing.medium / 2,
  },
  loadingIndicator: {
    padding: theme.spacing.medium,
  },
  title: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  walkingDistance: {
    paddingBottom: theme.spacing.medium,
  },
}));
