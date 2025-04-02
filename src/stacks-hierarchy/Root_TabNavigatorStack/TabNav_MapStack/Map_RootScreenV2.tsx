import React, {RefObject, useCallback, useEffect, useRef} from 'react';
import {
  MapFilterType,
  MapV2,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/components/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {FinishedScooterSheet} from '@atb/mobility/components/sheets/FinishedScooterSheet';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export type MapScreenParams = {
  initialFilters?: MapFilterType;
  showFinishedSheet?: boolean;
  bookingId?: string;
};

export const Map_RootScreenV2 = ({
  navigation,
  route,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const {close: closeBottomSheet, open: openBottomSheet} =
    useBottomSheetContext();
  // NOTE: This ref is not used for anything since the map doesn't support
  // screen readers, but a ref is required when opening bottom sheets.
  const onCloseFocusRef = useRef<RefObject<any>>(null);
  const {isShmoDeepIntegrationEnabled} = useFeatureTogglesContext();

  const navigateToQuay = useCallback(
    (place: StopPlace, quay: Quay) => {
      navigation.navigate('Map_PlaceScreen', {
        place,
        selectedQuayId: quay.id,
        mode: 'Departure',
      });
    },
    [navigation],
  );

  const navigateToDetails = useCallback(
    (
      serviceJourneyId: string,
      serviceDate: string,
      date: string | undefined,
      fromStopPosition: number,
      isTripCancelled?: boolean,
    ) => {
      if (!serviceJourneyId || !date) return;
      navigation.navigate('Map_DepartureDetailsScreen', {
        items: [
          {
            serviceJourneyId,
            serviceDate,
            date,
            fromStopPosition,
            isTripCancelled,
          },
        ],
        activeItemIndex: 0,
      });
    },
    [navigation],
  );

  useEffect(() => {
    if (route.params?.showFinishedSheet && isShmoDeepIntegrationEnabled) {
      openBottomSheet(
        () => (
          <FinishedScooterSheet
            bookingId={route.params?.bookingId ?? ''}
            onClose={() => {
              closeBottomSheet();
              navigation.setParams({showFinishedSheet: undefined});
            }}
            navigateSupportCallback={(operatorId, bookingId) => {
              closeBottomSheet();
              navigation.navigate('Root_ScooterHelpScreen', {
                operatorId: operatorId,
                bookingId: bookingId,
              });
            }}
          />
        ),
        onCloseFocusRef,
        false,
      );
    }
  }, [
    route.params?.showFinishedSheet,
    isShmoDeepIntegrationEnabled,
    route.params?.bookingId,
    openBottomSheet,
    closeBottomSheet,
    navigation,
  ]);

  const navigateToTripSearch: TravelFromAndToLocationsCallback = useCallback(
    (location, destination) => {
      navigation.navigate({
        name: 'Dashboard_TripSearchScreen',
        params: {
          [destination]: location,
          callerRoute: {name: 'Map_RootScreen'},
        },
        merge: true,
      });
    },
    [navigation],
  );

  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

  return (
    <MapV2
      navigateToQuay={navigateToQuay}
      navigateToDetails={navigateToDetails}
      navigateToTripSearch={navigateToTripSearch}
      includeSnackbar={true}
    />
  );
};
