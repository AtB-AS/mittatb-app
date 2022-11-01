import {StyleSheet} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '../../screen-header';
import {
  NearbyTexts,
  ScreenHeaderTexts,
  useTranslation,
  AssistantTexts,
} from '@atb/translations';
import StopPlaceView from '@atb/screens/Departures/StopPlaceView';
import {SearchTime} from '@atb/screens/Departures/utils';
import {Place, Quay} from '@atb/api/types/departures';
import ThemeText from '../../text';
import MessageBox from '@atb/components/message-box';
import {Feature, Point} from 'geojson';
import {useReverseGeocoder} from '@atb/geocoder';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import Button from '@atb/components/button';
import {SelectionLocationCallback} from '../types';
import {Location, SearchLocation} from '@atb/favorites/types';

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
  onLocationSelect: SelectionLocationCallback;
};

const DeparturesDialogSheet = ({
  close,
  stopPlaceFeature,
  navigateToDetails,
  navigateToQuay,
  onLocationSelect,
}: DeparturesDialogSheetProps) => {
  const {t} = useTranslation();
  const styles = useBottomSheetStyles();
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const message = t(NearbyTexts.results.messages.emptyResult);
  const [longitude, latitude] = stopPlaceFeature.geometry.coordinates;
  const {closestLocation, isSearching} = useReverseGeocoder(
    {longitude, latitude} || null,
  );

  const {state} = useStopsDetailsData(closestLocation && [closestLocation.id]);
  const stopPlace = state.data?.stopPlaces?.[0];
  const isLoading = state.isLoading || isSearching;

  const stopPlaceGeoLocation: Location | undefined =
    (stopPlaceFeature.properties && {
      ...(stopPlaceFeature.properties as SearchLocation),
      // id: stopPlaceFeature.properties.id,
      // name: stopPlaceFeature.properties.name,
      coordinates: {latitude, longitude},
      resultType: 'search',
    }) ||
    undefined;

  return (
    <BottomSheetContainer maxHeightValue={0.5} fullHeight>
      <ScreenHeaderWithoutNavigation
        title={stopPlaceFeature.properties?.name ?? stopPlace?.name}
        color="background_1"
        leftButton={{
          text: t(ScreenHeaderTexts.headerButton.close.text),
          type: 'close',
          onPress: close,
        }}
      />
      <View style={styles.departuresContainer}>
        <View style={styles.buttonsContainer}>
          <View style={styles.travelButton}>
            <Button
              text={t(AssistantTexts.location.travelFrom.title)}
              onPress={() =>
                onLocationSelect(stopPlaceGeoLocation, 'fromLocation')
              }
              mode="primary"
              style={styles.travelFromButtonPadding}
            />
          </View>
          <View style={styles.travelButton}>
            <Button
              text={t(AssistantTexts.location.travelTo.title)}
              onPress={() =>
                onLocationSelect(stopPlaceGeoLocation, 'toLocation')
              }
              mode="primary"
              style={styles.travelToButtonPadding}
            />
          </View>
        </View>
        <ThemeText
          type="body__secondary"
          color="secondary"
          style={[styles.title, styles.paddingHorizontal]}
        >
          {t(DeparturesTexts.header.title)}
        </ThemeText>
        {!isLoading ? (
          !!stopPlace?.quays?.length ? (
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
            <View style={styles.paddingHorizontal}>
              <MessageBox type="info" message={message} />
            </View>
          )
        ) : (
          <View style={styles.paddingHorizontal}>
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
  buttonsContainer: {
    padding: theme.spacings.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelButton: {
    flex: 1,
  },
  travelFromButtonPadding: {
    marginRight: theme.spacings.small,
  },
  travelToButtonPadding: {
    marginLeft: theme.spacings.small,
  },
  loadingIndicator: {
    padding: theme.spacings.medium,
  },
  paddingHorizontal: {
    paddingHorizontal: theme.spacings.medium,
  },
  title: {
    paddingBottom: theme.spacings.small,
  },
}));

export default DeparturesDialogSheet;
