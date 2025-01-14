import {StyleSheet} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {
  SearchTime,
  StopPlacesView,
  useStopsDetailsDataQuery,
} from '@atb/place-screen';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Feature, Point} from 'geojson';
import {Location, SearchLocation} from '@atb/favorites';
import {NavigateToTripSearchCallback} from '../types';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {isDefined} from '@atb/utils/presence';

type DeparturesDialogSheetProps = {
  onClose: () => void;
  distance: number | undefined;
  stopPlaceFeature: Feature<Point>;
  navigateToQuay: (stopPlace: StopPlace, quay: Quay) => void;
  navigateToDetails: (
    serviceJourneyId: string,
    serviceDate: string,
    date: string | undefined,
    stopPositionInPattern: number,
    isTripCancelled?: boolean,
  ) => void;
  navigateToTripSearch: NavigateToTripSearchCallback;
};

export const DeparturesDialogSheet = ({
  onClose,
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
  const appStateStatus = useAppStateStatus();

  const stopPlaceIds = getStopPlaceIds(stopPlaceFeature);

  const {
    data: stopDetailsData,
    status: stopDetailsStatus,
    refetch: refetchStopDetails,
  } = useStopsDetailsDataQuery(stopPlaceIds);

  const thereIsSomeQuays = stopDetailsData?.stopPlaces?.some(
    (sp) => sp.quays?.length,
  );

  const StopPlaceViewOrError = () => {
    if (stopDetailsStatus === 'success') {
      if (thereIsSomeQuays) {
        return (
          <StopPlacesView
            stopPlaces={stopDetailsData?.stopPlaces}
            showTimeNavigation={false}
            navigateToDetails={navigateToDetails}
            navigateToQuay={navigateToQuay}
            isFocused={appStateStatus === 'active'}
            searchTime={searchTime}
            setSearchTime={setSearchTime}
            showOnlyFavorites={false}
            setShowOnlyFavorites={(_) => {}}
            testID="departuresContentView"
            mode="Map"
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
          <MessageInfoBox
            type="info"
            message={t(DeparturesTexts.message.emptyResult)}
          />
        </View>
      );
    }

    if (stopDetailsStatus === 'error') {
      return (
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
    <BottomSheetContainer
      title={
        stopPlaceFeature.properties?.name ??
        stopDetailsData?.stopPlaces[0]?.name
      }
      maxHeightValue={0.5}
      onClose={onClose}
      fullHeight
    >
      <View style={styles.departuresContainer}>
        <StopPlaceViewOrError />
      </View>
    </BottomSheetContainer>
  );
};

const getStopPlaceIds = (feature: Feature<Point>): string[] => {
  const stopPlaceId: string | undefined = feature.properties?.['id'];
  const adjSitesRaw: string | undefined = feature.properties?.['adjacentSites'];

  let adjacentSiteIds: string[];
  try {
    adjacentSiteIds = adjSitesRaw ? JSON.parse(adjSitesRaw) : [];
  } catch (_) {
    adjacentSiteIds = [];
  }
  return [stopPlaceId, ...adjacentSiteIds].filter(isDefined);
};

const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  departuresContainer: {
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: theme.spacing.medium,
  },
}));
