import {StyleSheet} from '@atb/theme';
import {Feature, GeoJsonProperties, Point} from 'geojson';
import React, {forwardRef, useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {
  BottomSheetContainer,
  BottomSheetSize,
} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '../screen-header';
import {useTranslation} from '@atb/translations';
import StopPlaceView from '@atb/screens/Departures/StopPlaceView';
import {SearchTime} from '@atb/screens/Departures/utils';
import {Place, Quay} from '@atb/api/types/departures';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';
import SvgClose from '@atb/assets/svg/mono-icons/actions/Close';

type DeparturesDialogSheetProps = {
  close: () => void;
  stopPlaceFeature: Feature<Point, GeoJsonProperties>;
  navigateToQuay: (place: Place, quay: Quay) => void;
  bottomSheetSize: BottomSheetSize;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
};

const DeparturesDialogSheet = forwardRef<View, DeparturesDialogSheetProps>(
  (
    {
      close,
      bottomSheetSize,
      stopPlaceFeature,
      navigateToDetails,
      navigateToQuay,
    },
    focusRef,
  ) => {
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
      <BottomSheetContainer sheetSize={bottomSheetSize}>
        <ScreenHeaderWithoutNavigation
          title={featureName}
          color="background_1"
          style={styles.roundEdgesOnTop}
          leftButton={{
            type: 'close',
            onPress: close,
            icon: <ThemeIcon svg={SvgClose} />,
          }}
        />
        <View
          ref={focusRef}
          accessible={true}
          style={styles.departuresContainer}
        >
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
              searchTime={searchTime}
              setSearchTime={setSearchTime}
              showOnlyFavorites={showOnlyFavorites}
              setShowOnlyFavorites={setShowOnlyFavorites}
              testID="departuresContentView"
            />
          ) : (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </View>
      </BottomSheetContainer>
    );
  },
);

export const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
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
  roundEdgesOnTop: {
    borderTopLeftRadius: theme.border.radius.circle,
    borderTopRightRadius: theme.border.radius.circle,
  },
}));

export default DeparturesDialogSheet;
