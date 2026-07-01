import React, {useCallback} from 'react';
import {
  MapFilterType,
  Map,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/modules/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {ShmoPricingPlan} from '@atb/api/types/mobility';
import type {BenefitType} from '@atb/api/types/benefit';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {ShmoHelpScreenProps} from '@atb/stacks-hierarchy/Root_ShmoHelp/Root_ShmoHelpScreen';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useGetHasReservationOrAvailableFareContract} from '@atb/modules/ticketing';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';
import {TripSearchCallerRoute} from '../TabNav_DashboardStack/types';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export type MapScreenParams = {
  initialFilters?: MapFilterType;
};

const callerRoute: TripSearchCallerRoute = [
  'Root_TabNavigatorStack',
  {
    screen: 'TabNav_MapStack',
    params: {screen: 'Map_RootScreen', params: {}},
  },
];

export const Map_RootScreen = ({
  navigation,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocusedAndActive();

  const navigateToQuay = useCallback(
    (place: StopPlace, quay: Quay) => {
      navigation.navigate('Map_PlaceScreen', {
        place,
        selectedQuayId: quay.id,
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
      navigation.navigate('Root_TabNavigatorStack', {
        screen: 'TabNav_DashboardStack',
        params: {
          screen: 'Dashboard_TripSearchScreen',
          params: {
            [destination]: location,
            callerRoute,
          },
          merge: true,
        },
      });
    },
    [navigation],
  );

  const navigateToShmoSupport = useCallback(
    (params: ShmoHelpScreenProps['route']['params']) => {
      navigation.navigate('Root_ShmoHelpScreen', params);
    },
    [navigation],
  );

  const navigateToShmoOnboarding = useCallback(
    (formFactor?: FormFactor) => {
      navigation.navigate('Root_ShmoOnboardingScreen', {formFactor});
    },
    [navigation],
  );

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
  const getHasReservationOrAvailableFareContract =
    useGetHasReservationOrAvailableFareContract();

  const navigateToLogin = useCallback(() => {
    if (getHasReservationOrAvailableFareContract()) {
      navigation.navigate('Root_LoginAvailableFareContractWarningScreen', {});
    } else if (enable_vipps_login) {
      navigation.navigate('Root_LoginOptionsScreen', {
        showGoBack: true,
        transitionOverride: 'slide-from-bottom',
      });
    } else {
      navigation.navigate('Root_LoginPhoneInputScreen', {});
    }
  }, [
    enable_vipps_login,
    getHasReservationOrAvailableFareContract,
    navigation,
  ]);

  const paymentMethodsScreenParams = useNestedProfileScreenParams(
    'Profile_PaymentMethodsScreen',
  );

  const navigateToPaymentMethods = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', paymentMethodsScreenParams);
  }, [navigation, paymentMethodsScreenParams]);

  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const navigateToBonusScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
  }, [navigation, bonusScreenParams]);

  const navigateToPricingDetails = useCallback(
    (pricingPlan: ShmoPricingPlan, benefit: BenefitType | undefined) => {
      navigation.navigate('Root_ShmoPricingDetailsScreen', {
        pricingPlan,
        benefit,
        transitionOverride: 'slide-from-right',
      });
    },
    [navigation],
  );

  const focusRef = useFocusOnLoad(navigation);

  if (isScreenReaderEnabled)
    return <MapDisabledForScreenReader focusRef={focusRef} />;

  return (
    <Map
      isFocused={isFocused}
      tabBarHeight={tabBarHeight}
      navigateToQuay={navigateToQuay}
      navigateToDetails={navigateToDetails}
      navigateToTripSearch={navigateToTripSearch}
      navigateToShmoSupport={navigateToShmoSupport}
      navigateToShmoOnboarding={navigateToShmoOnboarding}
      navigateToReportParkingViolation={navigateToReportParkingViolation}
      navigateToParkingPhoto={navigateToParkingPhoto}
      navigateToScanQrCode={navigateToScanQrCode}
      navigateToLogin={navigateToLogin}
      navigateToPaymentMethods={navigateToPaymentMethods}
      navigateToBonusScreen={navigateToBonusScreen}
      navigateToPricingDetails={navigateToPricingDetails}
      includeSnackbar={true}
    />
  );
};
