import {StyleSheet} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {
  SearchTime,
  StopPlaceView,
  useStopPlaceParentIdQuery,
  useStopsDetailsDataQuery,
} from '@atb/place-screen';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Feature, Point} from 'geojson';
import {Location, SearchLocation} from '@atb/favorites';
import {NavigateToTripSearchCallback} from '../types';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';

type DeparturesDialogSheetProps = {
  onClose: () => void;
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

  const stopPlaceId = stopPlaceFeature.properties?.['id'];

  const {
    data: parentId,
    isFetched: hasFinishedFetchingParentId,
    isError: isParentIdError,
    refetch: refetchParentId,
  } = useStopPlaceParentIdQuery(stopPlaceId);

  const {
    data: stopDetailsData,
    isFetching: isStopDetailsLoading,
    isError: isStopDetailsError,
    refetch: refetchStopDetailsData,
  } = useStopsDetailsDataQuery(parentId ? [parentId] : undefined);

  const stopPlace = stopDetailsData?.stopPlaces?.[0];

  const refresh = () => {
    if (isParentIdError) {
      return refetchParentId();
    }

    if (isStopDetailsError) {
      return refetchStopDetailsData();
    }
  };

  const StopPlaceViewOrError = () => {
    if (
      hasFinishedFetchingParentId &&
      !isStopDetailsLoading &&
      !isStopDetailsError
    ) {
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

    if (
      hasFinishedFetchingParentId &&
      !isStopDetailsLoading &&
      isStopDetailsError
    ) {
      return (
        <View style={styles.paddingHorizontal}>
          <MessageInfoBox
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
    <BottomSheetContainer
      title={stopPlaceFeature.properties?.name ?? stopPlace?.name}
      maxHeightValue={0.5}
      onClose={onClose}
      fullHeight
    >
      <StopPlaceViewOrError />
    </BottomSheetContainer>
  );
};

const useBottomSheetStyles = StyleSheet.createThemeHook((theme) => ({
  departuresContainer: {
    // flex: 1,
    height: '100%',
  },
  paddingHorizontal: {
    paddingHorizontal: theme.spacings.medium,
  },
}));
