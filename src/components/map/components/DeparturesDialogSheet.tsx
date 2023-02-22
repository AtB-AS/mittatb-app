import {StyleSheet} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '../../screen-header';
import {dictionary, ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {
  SearchTime,
  StopPlaceView,
  useStopsDetailsData,
} from '@atb/place-screen';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {MessageBox} from '@atb/components/message-box';
import {Feature, Point} from 'geojson';
import {useReverseGeocoder} from '@atb/geocoder';
import {Location, SearchLocation} from '@atb/favorites/types';
import {NavigateToTripSearchCallback} from '../types';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

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

export const DeparturesDialogSheet = ({
  close,
  distance,
  stopPlaceFeature,
  navigateToDetails,
  navigateToQuay,
  navigateToTripSearch,
}: DeparturesDialogSheetProps) => {
  const {t} = useTranslation();
  const styles = useBottomSheetStyles();
  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });
  const [longitude, latitude] = stopPlaceFeature.geometry.coordinates;
  const {
    locations,
    isSearching: isGeocoderSearching,
    error: geocoderError,
    forceRefresh: forceRefreshReverseGeocode,
  } = useReverseGeocoder({longitude, latitude} || null);
  const appStateStatus = useAppStateStatus();

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
            isFocused={appStateStatus === 'active'}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={false}
            setShowOnlyFavorites={(_) => {}}
            testID="departuresContentView"
            allowFavouriteSelection={false}
            mode={'Map'}
            distance={distance}
            setTravelTarget={(target) => {
              stopPlaceGeoLocation &&
                navigateToTripSearch(stopPlaceGeoLocation, target);
            }}
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
            onPressConfig={{
              action: refresh,
              text: t(dictionary.retry),
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
        <StopPlaceViewOrError />
      </View>
    </BottomSheetContainer>
  );
};

const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  departuresContainer: {
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: theme.spacings.medium,
  },
}));
