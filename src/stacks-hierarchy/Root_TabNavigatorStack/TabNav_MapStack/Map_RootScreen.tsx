import React, {useCallback} from 'react';
import {
  MapFilterType,
  Map,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/modules/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {ScooterHelpScreenProps} from '@atb/stacks-hierarchy/Root_ScooterHelp/Root_ScooterHelpScreen';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useHasReservationOrAvailableFareContract} from '@atb/modules/ticketing';

export type MapScreenParams = {
  initialFilters?: MapFilterType;
};

export const Map_RootScreen = ({
  navigation,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const {close} = useBottomSheetContext();
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // on screen blur (navigating away from map tab), close bottomsheet
        close();
      };
    }, [close]),
  );

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

  const navigateToScooterSupport = useCallback(
    (params: ScooterHelpScreenProps['route']['params']) => {
      navigation.navigate('Root_ScooterHelpScreen', params);
    },
    [navigation],
  );

  const navigateToScooterOnboarding = useCallback(() => {
    navigation.navigate('Root_ShmoOnboardingScreen');
  }, [navigation]);

  const navigateToReportParkingViolation = useCallback(() => {
    navigation.navigate('Root_ParkingViolationsSelectScreen');
  }, [navigation]);

  const navigateToParkingPhoto = useCallback(
    (bookingId: string) => {
      navigation.navigate('Root_ParkingPhotoScreen', {bookingId});
    },
    [navigation],
  );

  const navigateToScanQrCode = useCallback(() => {
    navigation.navigate('Root_ScanQrCodeScreen');
  }, [navigation]);

  const {enable_vipps_login} = useRemoteConfigContext();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();

  const navigateToLogin = useCallback(() => {
    if (hasReservationOrAvailableFareContract) {
      navigation.navigate('Root_LoginAvailableFareContractWarningScreen', {});
    } else if (enable_vipps_login) {
      navigation.navigate('Root_LoginOptionsScreen', {
        showGoBack: true,
        transitionOverride: 'slide-from-bottom',
      });
    } else {
      navigation.navigate('Root_LoginPhoneInputScreen', {});
    }
  }, [enable_vipps_login, hasReservationOrAvailableFareContract, navigation]);

  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

  return (
    <Map
      isFocused={isFocused}
      tabBarHeight={tabBarHeight}
      navigateToQuay={navigateToQuay}
      navigateToDetails={navigateToDetails}
      navigateToTripSearch={navigateToTripSearch}
      navigateToScooterSupport={navigateToScooterSupport}
      navigateToScooterOnboarding={navigateToScooterOnboarding}
      navigateToReportParkingViolation={navigateToReportParkingViolation}
      navigateToParkingPhoto={navigateToParkingPhoto}
      navigateToScanQrCode={navigateToScanQrCode}
      navigateToLogin={navigateToLogin}
      includeSnackbar={true}
    />
  );
};
