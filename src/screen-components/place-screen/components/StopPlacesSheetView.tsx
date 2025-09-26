import {Quay, StopPlace} from '@atb/api/types/departures';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {RefreshControl, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import {WalkingDistance} from '@atb/components/walking-distance';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {type DepartureSearchTime} from '@atb/components/date-selection';
import type {StopPlacesMode} from '@atb/screen-components/nearby-stop-places';
import {QuaySection} from '@atb/screen-components/place-screen';
import {BottomSheetSectionList} from '@gorhom/bottom-sheet';
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
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (enabled: boolean) => void;
  isFocused: boolean;
  testID?: string;
  addedFavoritesVisibleOnDashboard?: boolean;
  setTravelTarget?: (target: string) => void;
  distance?: number | undefined;
};

export const StopPlacesSheetView = (props: Props) => {
  const {
    stopPlaces,
    showTimeNavigation = true,
    navigateToQuay,
    navigateToDetails,
    searchTime,
    showOnlyFavorites,
    setShowOnlyFavorites,
    isFocused,
    testID,
    addedFavoritesVisibleOnDashboard,
    setTravelTarget,
    distance,
  } = props;
  const mode: StopPlacesMode = 'Map';
  const styles = useStyles();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const {
    didLoadingDataFail,
    forceRefresh,
    state,
    quayListData,
    searchStartTime,
  } = useStopPlaceData({
    mode,
    searchTime,
    stopPlaces,
    setShowOnlyFavorites,
    isFocused,
    showOnlyFavorites,
  });

  return (
    <BottomSheetSectionList
      style={{flex: 1}}
      nestedScrollEnabled
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

          <WalkingDistance distance={distance} style={styles.walkingDistance} />
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
                  setTravelTarget && setTravelTarget('fromLocation');
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
                  setTravelTarget && setTravelTarget('toLocation');
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
  title: {
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  walkingDistance: {
    paddingBottom: theme.spacing.medium,
  },
}));
