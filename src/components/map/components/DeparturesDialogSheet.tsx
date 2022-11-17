import {StyleSheet, useTheme} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '../../screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import StopPlaceView from '@atb/screens/Departures/StopPlaceView';
import {SearchTime} from '@atb/screens/Departures/utils';
import {StopPlace, Quay} from '@atb/api/types/departures';
import ThemeText from '../../text';
import MessageBox from '@atb/components/message-box';
import {Feature, Point} from 'geojson';
import {useReverseGeocoder} from '@atb/geocoder';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import Button from '@atb/components/button';
import {Location, SearchLocation} from '@atb/favorites/types';
import {NavigateToTripSearchCallback} from '../types';
import {useGeolocationState} from '@atb/GeolocationContext';
import DeparturesDialogSheetTexts from '@atb/translations/components/DeparturesDialogSheet';
import ThemeIcon from '@atb/components/theme-icon';
import walk from '@atb/assets/svg/mono-icons/transportation/Walk';

type DeparturesDialogSheetProps = {
  close: () => void;
  distance: number | undefined;
  stopPlaceFeature: Feature<Point>;
  navigateToQuay: (stopPlace: StopPlace, quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => void;
  navigateToTripSearch: NavigateToTripSearchCallback;
};

const DeparturesDialogSheet = ({
  close,
  distance,
  stopPlaceFeature,
  navigateToDetails,
  navigateToQuay,
  navigateToTripSearch,
}: DeparturesDialogSheetProps) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const styles = useBottomSheetStyles();
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const [longitude, latitude] = stopPlaceFeature.geometry.coordinates;
  const {locationEnabled, location} = useGeolocationState();
  const {
    locations,
    isSearching: isGeocoderSearching,
    error: geocoderError,
    forceRefresh: forceRefreshReverseGeocode,
  } = useReverseGeocoder({longitude, latitude} || null);

  const filteredLocations = locations?.filter(
    (location) =>
      location.layer === 'venue' &&
      stopPlaceFeature.properties?.name.includes(location.name),
  );

  const closestLocation = filteredLocations?.[0];

  const {state: stopDetailsState, forceRefresh: forceRefreshStopDetailsData} =
    useStopsDetailsData(closestLocation && [closestLocation.id]);
  const {
    data: stopDetailsData,
    isLoading: isStopDetailsLoading,
    error: stopDetailsError,
  } = stopDetailsState;

  const stopPlace = stopDetailsData?.stopPlaces?.[0];
  const isLoading = isStopDetailsLoading || isGeocoderSearching;
  const didLoadingDataFail = !!geocoderError || !!stopDetailsError;

  const refresh = () => {
    if (!!geocoderError) {
      return forceRefreshReverseGeocode();
    }

    if (!!stopDetailsError) {
      return forceRefreshStopDetailsData();
    }
  };

  const StopPlaceViewOrError = () => {
    if (!isLoading && !didLoadingDataFail) {
      if (stopPlace?.quays?.length) {
        return (
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
            showOnlyFavorites={false}
            setShowOnlyFavorites={(_) => {}}
            testID="departuresContentView"
            allowFavouriteSelection={false}
            mode={'Departure'}
          />
        );
      }

      return (
        <View style={styles.paddingHorizontal}>
          <MessageBox
            type="info"
            message={t(DeparturesTexts.message.emptyResult)}
          />
        </View>
      );
    }

    if (!isLoading && didLoadingDataFail) {
      return (
        <View style={styles.paddingHorizontal}>
          <MessageBox
            type="error"
            message={t(DeparturesTexts.message.resultFailed)}
            onPress={() => {
              refresh();
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.paddingHorizontal}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const stopPlaceGeoLocation: Location | undefined =
    (stopPlaceFeature.properties && {
      ...(stopPlaceFeature.properties as SearchLocation),
      label: stopPlaceFeature.properties.name,
      coordinates: {latitude, longitude},
      resultType: 'search',
    }) ||
    undefined;

  const currentLocation = locationEnabled && location ? location : undefined;

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
        {distance && (
          <View style={styles.distanceLabel}>
            <ThemeIcon
              svg={walk}
              fill={theme.text.colors.secondary}
            ></ThemeIcon>
            <ThemeText type="body__secondary" color="secondary">
              {distance.toFixed() + ' m'}
            </ThemeText>
          </View>
        )}
        <View style={styles.buttonsContainer}>
          <View style={styles.travelButton}>
            <Button
              text={t(DeparturesDialogSheetTexts.travelFrom.title)}
              onPress={() =>
                stopPlaceGeoLocation &&
                navigateToTripSearch(stopPlaceGeoLocation, 'fromLocation')
              }
              mode="primary"
              style={styles.travelFromButtonPadding}
            />
          </View>
          <View style={styles.travelButton}>
            <Button
              text={t(DeparturesDialogSheetTexts.travelTo.title)}
              onPress={() =>
                stopPlaceGeoLocation &&
                navigateToTripSearch(stopPlaceGeoLocation, 'toLocation')
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
        <StopPlaceViewOrError />
      </View>
    </BottomSheetContainer>
  );
};

const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  departuresContainer: {
    flex: 1,
  },
  distanceLabel: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonsContainer: {
    padding: theme.spacings.medium,
    flexDirection: 'row',
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
