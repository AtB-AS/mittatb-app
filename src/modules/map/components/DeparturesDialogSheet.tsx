import {StyleSheet, useThemeContext} from '@atb/theme';
import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {DeparturesTexts, dictionary, useTranslation} from '@atb/translations';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Feature, Point} from 'geojson';
import {Location, SearchLocation} from '@atb/modules/favorites';
import {NavigateToTripSearchCallback} from '../types';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import {isDefined} from '@atb/utils/presence';
import {
  StopPlacesView,
  useStopsDetailsDataQuery,
} from '@atb/screen-components/place-screen';
import type {DepartureSearchTime} from '@atb/components/date-selection';
import {BottomSheetMap} from '@atb/components/bottom-sheet-map';
import {Close} from '@atb/assets/svg/mono-icons/actions';

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
  tabBarHeight: number | undefined;
  positionArrowCallback: () => void;
};

export const DeparturesDialogSheet = ({
  onClose,
  distance,
  stopPlaceFeature,
  navigateToDetails,
  navigateToQuay,
  navigateToTripSearch,
  tabBarHeight,
  positionArrowCallback,
}: DeparturesDialogSheetProps) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useBottomSheetStyles(tabBarHeight ?? 0)();
  const [searchTime, setSearchTime] = useState<DepartureSearchTime>({
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
            backgroundColor={theme.color.background.neutral[1]}
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
    <BottomSheetMap
      snapPoints={['60%']}
      closeCallback={onClose}
      enableDynamicSizing={false}
      allowBackgroundTouch={true}
      heading={
        stopPlaceFeature.properties?.name ??
        stopDetailsData?.stopPlaces[0]?.name
      }
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      positionArrowCallback={positionArrowCallback}
    >
      <View style={styles.listWrapper}>
        <StopPlaceViewOrError />
      </View>
    </BottomSheetMap>
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

const useBottomSheetStyles = (tabBarHeight: number) =>
  StyleSheet.createThemeHook((theme) => ({
    paddingHorizontal: {
      paddingHorizontal: theme.spacing.medium,
    },
    listWrapper: {
      paddingBottom: tabBarHeight,
    },
  }));
