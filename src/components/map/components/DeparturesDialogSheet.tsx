import {StyleSheet} from '@atb/theme';
import {Feature, Point} from 'geojson';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '../../screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import StopPlaceView from '@atb/screens/Departures/StopPlaceView';
import {SearchTime} from '@atb/screens/Departures/utils';
import {Place, Quay} from '@atb/api/types/departures';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import ThemeText from '../../text';

type DeparturesDialogSheetProps = {
  close: () => void;
  stopPlaceFeature: Feature<Point>;
  navigateToQuay: (place: Place, quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
};

const DeparturesDialogSheet = ({
  close,
  stopPlaceFeature,
  navigateToDetails,
  navigateToQuay,
}: DeparturesDialogSheetProps) => {
  const {t} = useTranslation();
  const styles = useBottomSheetStyles();
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const featureId = stopPlaceFeature.properties?.id;
  const featureName = stopPlaceFeature.properties?.name;
  const stopDetails = useStopsDetailsData([featureId]);
  const stopPlace = stopDetails.state.data?.stopPlaces?.[0];

  return (
    <BottomSheetContainer maxHeightValue={0.5} fullHeight>
      <ScreenHeaderWithoutNavigation
        title={featureName}
        color="background_1"
        leftButton={{
          text: t(ScreenHeaderTexts.headerButton.cancel.text),
          type: 'close',
          onPress: close,
        }}
      />
      <View style={styles.departuresContainer}>
        <ThemeText
          type="body__secondary"
          color="secondary"
          style={styles.title}
        >
          {t(DeparturesTexts.header.title)}
        </ThemeText>
        {!stopDetails.state.isLoading && stopPlace ? (
          <StopPlaceView
            stopPlace={stopPlace}
            showTimeNavigation={false}
            navigateToDetails={navigateToDetails}
            navigateToQuay={(quay) => {
              navigateToQuay(stopPlace, quay);
            }}
            isFocused={false}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={showOnlyFavorites}
            setShowOnlyFavorites={setShowOnlyFavorites}
            testID="departuresContentView"
            allowFavouriteSelection={false}
          />
        ) : (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>
    </BottomSheetContainer>
  );
};

const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  departuresContainer: {
    flex: 1,
  },
  loadingIndicator: {
    padding: theme.spacings.medium,
  },
  title: {
    marginLeft: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));

export default DeparturesDialogSheet;
