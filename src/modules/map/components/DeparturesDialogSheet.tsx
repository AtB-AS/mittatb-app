import {StyleSheet} from '@atb/theme';
import React, {JSX, useRef} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Feature, Point} from 'geojson';
import {Location, SearchLocation} from '@atb/modules/favorites';
import {NavigateToTripSearchCallback} from '../types';
import {isDefined} from '@atb/utils/presence';
import {
  StopPlacesSheetView,
  useStopsDetailsDataQuery,
} from '@atb/screen-components/place-screen';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {MapBottomSheet} from '@atb/components/bottom-sheet-v2';

type DeparturesDialogSheetProps = {
  onClose: () => void;
  distance: number | undefined;
  stopPlaceFeature: Feature<Point>;
  navigateToQuay: (stopPlace: StopPlace, quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date: string | undefined,
    fromStopPosition: number,
    isTripCancelled?: boolean,
  ) => void;
  navigateToTripSearch: NavigateToTripSearchCallback;
  navigateToScanQrCode: () => void;
  tabBarHeight: number | undefined;
  locationArrowOnPress: () => void;
};

export const DeparturesDialogSheet = ({
  onClose,
  distance,
  stopPlaceFeature,
  navigateToDetails,
  navigateToQuay,
  navigateToTripSearch,
  navigateToScanQrCode,
  locationArrowOnPress,
}: DeparturesDialogSheetProps) => {
  const {t} = useTranslation();
  const styles = useBottomSheetStyles();
  const searchDateRef = useRef(new Date().toISOString());
  const [longitude, latitude] = stopPlaceFeature.geometry.coordinates;

  const stopPlaceIds = getStopPlaceIds(stopPlaceFeature);

  const {
    data: stopDetailsData,
    status: stopDetailsStatus,
    refetch: refetchStopDetails,
  } = useStopsDetailsDataQuery(stopPlaceIds);

  const thereIsSomeQuays = stopDetailsData?.stopPlaces?.some(
    (sp) => sp.quays?.length,
  );

  const stopPlaceGeoLocation: Location | undefined =
    (stopPlaceFeature.properties && {
      ...(stopPlaceFeature.properties as SearchLocation),
      label: stopPlaceFeature.properties.name,
      coordinates: {latitude, longitude},
      resultType: 'search',
    }) ||
    undefined;

  let StopPlaceViewOrError: JSX.Element = <></>;

  {
    if (stopDetailsStatus === 'success') {
      if (thereIsSomeQuays) {
        StopPlaceViewOrError = (
          <StopPlacesSheetView
            stopPlaces={stopDetailsData?.stopPlaces}
            showTimeNavigation={false}
            navigateToDetails={navigateToDetails}
            navigateToQuay={navigateToQuay}
            searchTime={searchDateRef.current}
            testID="departuresContentView"
            distance={distance}
            setTravelTarget={(target) => {
              stopPlaceGeoLocation &&
                navigateToTripSearch(stopPlaceGeoLocation, target);
            }}
          />
        );
      } else {
        StopPlaceViewOrError = (
          <View style={styles.paddingHorizontal}>
            <MessageInfoBox
              type="info"
              message={t(DeparturesTexts.message.emptyResult)}
            />
          </View>
        );
      }
    } else if (stopDetailsStatus === 'error') {
      StopPlaceViewOrError = (
        <View style={styles.paddingHorizontal}>
          <MessageInfoBox
            type="error"
            message={t(DeparturesTexts.message.resultFailed)}
            onPressConfig={{
              action: refetchStopDetails,
              text: t(dictionary.retry),
            }}
          />
        </View>
      );
    } else if (stopDetailsStatus === 'pending') {
      StopPlaceViewOrError = (
        <View style={styles.paddingHorizontal}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  }

  return (
    <MapBottomSheet
      snapPoints={['50%', '90%']}
      canMinimize={true}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      closeCallback={onClose}
      allowBackgroundTouch={true}
      heading={
        stopPlaceFeature.properties?.name ??
        stopDetailsData?.stopPlaces[0]?.name
      }
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      {StopPlaceViewOrError}
    </MapBottomSheet>
  );
};

const getStopPlaceIds = (feature: Feature<Point>): string[] => {
  const stopPlaceId: string | undefined = feature.properties?.['id'];
  const adjSitesRaw: string | undefined = feature.properties?.['adjacentSites'];

  let adjacentSiteIds: string[];
  try {
    adjacentSiteIds = adjSitesRaw ? JSON.parse(adjSitesRaw) : [];
  } catch {
    adjacentSiteIds = [];
  }
  return [stopPlaceId, ...adjacentSiteIds].filter(isDefined);
};

const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  paddingHorizontal: {
    paddingHorizontal: theme.spacing.medium,
  },
}));
