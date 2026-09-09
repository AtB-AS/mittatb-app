import {trackNavigation} from '@atb/modules/diagnostics';
import {useThemeContext} from '@atb/theme';
import {APP_VERSION} from '@env';
import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {StatusBar} from 'react-native';
import {Root_TabNavigatorStack} from './Root_TabNavigatorStack';
import {RootStackParamList} from './navigation-types';
import {useTestIds} from './use-test-ids';
import type {NavigationState} from '@react-navigation/routers';
import {useLogger as useReactNavigationLogger} from '@react-navigation/devtools';
import {Root_SelectTravelTokenScreen} from './Root_SelectTravelTokenScreen';
import {Root_ConsiderTravelTokenChangeScreen} from '@atb/stacks-hierarchy/Root_ConsiderTravelTokenChangeScreen';
import {Root_AddEditFavoritePlaceScreen} from './Root_AddEditFavoritePlaceScreen';
import {Root_SearchFavoritePlaceScreen} from './Root_SearchFavoritePlaceScreen';
import {Root_LocationSearchByMapScreen} from '@atb/stacks-hierarchy/Root_LocationSearchByMapScreen';
import {Root_ScanQrCodeScreen} from '@atb/stacks-hierarchy/Root_ScanQrCodeScreen';
import {Root_LocationSearchByTextScreen} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Root_PurchaseOverviewScreen} from './Root_PurchaseOverviewScreen';
import {Root_PurchaseConfirmationScreen} from './Root_PurchaseConfirmationScreen';
import {Root_PurchaseFareZonesSearchByMapScreen} from '@atb/stacks-hierarchy/Root_PurchaseFareZonesSearchByMapScreen';
import {Root_PurchaseFareZonesSearchByTextScreen} from '@atb/stacks-hierarchy/Root_PurchaseFareZonesSearchByTextScreen';
import {Root_PurchaseHarborSearchScreen} from '@atb/stacks-hierarchy/Root_PurchaseHarborSearchScreen';
import {Root_PurchaseAsAnonymousConsequencesScreen} from '@atb/stacks-hierarchy/Root_PurchaseAsAnonymousConsequencesScreen';
import {Root_FareContractDetailsScreen} from '@atb/stacks-hierarchy/Root_FareContractDetailsScreen';
import {Root_RefundConfirmationScreen} from '@atb/stacks-hierarchy/Root_RefundConfirmationScreen';
import {Root_ReceiptScreen} from '@atb/stacks-hierarchy/Root_ReceiptScreen';
import {Root_LoginAvailableFareContractWarningScreen} from '@atb/stacks-hierarchy/Root_LoginAvailableFareContractWarningScreen';
import {Root_LoginOptionsScreen} from '@atb/stacks-hierarchy/Root_LoginOptionsScreen';
import {Root_LoginPhoneInputScreen} from '@atb/stacks-hierarchy/Root_LoginPhoneInputScreen';
import {Root_LoginConfirmCodeScreen} from '@atb/stacks-hierarchy/Root_LoginConfirmCodeScreen';
import {Root_LoginRequiredForFareProductScreen} from '@atb/stacks-hierarchy/Root_LoginRequiredForFareProductScreen';
import {Root_ConfirmationScreen} from './Root_ConfirmationScreen';
import {
  LoadingScreen,
  LoadingScreenBoundary,
  useIsLoadingAppState,
} from '@atb/screen-components/loading-screen';
import {
  Root_ParkingViolationsConfirmationScreen,
  Root_ParkingViolationsPhotoScreen,
  Root_ParkingViolationsQrScreen,
  Root_ParkingViolationsSelectScreen,
} from '@atb/stacks-hierarchy/Root_ShmoHelp';
import {Root_NotificationPermissionScreen} from '@atb/stacks-hierarchy/Root_NotificationPermissionScreen';
import {Root_LocationWhenInUsePermissionScreen} from '@atb/stacks-hierarchy/Root_LocationWhenInUsePermissionScreen';
import {Root_TicketInformationScreen} from './Root_TicketInformationScreen/Root_TicketInformationScreen';
import {Root_ChooseTicketRecipientScreen} from '@atb/stacks-hierarchy/Root_ChooseTicketRecipientScreen';
import {screenOptions} from '@atb/stacks-hierarchy/navigation-utils';
import {useOnboardingContext, useOnboardingFlow} from '@atb/modules/onboarding';
import {useRegisterIntercomUser} from '@atb/modules/chat';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {ForceUpdateScreen} from '@atb/screen-components/force-update-screen';
import {compareVersion} from '@atb/utils/compare-version';
import {Root_ShmoOnboardingScreen} from './Root_ShmoOnboardingScreen';
import {Root_ContactShmoOperatorScreen} from './Root_ShmoHelp/Root_ContactShmoOperatorScreen';
import {Root_ContactShmoOperatorConfirmationScreen} from './Root_ShmoHelp/Root_ContactShmoOperatorConfirmationScreen';
import {AnalyticsContextProvider} from '@atb/modules/analytics';
import {Root_ParkingPhotoScreen} from './Root_ParkingPhotoScreen';
import {Root_TripSelectionScreen} from '@atb/stacks-hierarchy/Root_TripSelectionScreen/Root_TripSelectionScreen';
import {useSetupReactQueryWindowFocus} from '@atb/queries';
import {
  Root_SmartParkAndRideAddScreen,
  Root_SmartParkAndRideEditScreen,
} from './Root_SmartParkAndRide';
import {Root_OnboardingCarouselStack} from './Root_OnboardingCarouselStack';
import {getActiveRouteName} from '@atb/utils/navigation';
import {Root_TravelAidOnboardingScreen} from './Root_TravelAidOnboardingScreen';
import {Root_ShmoHelpScreen} from './Root_ShmoHelp/Root_ShmoHelpScreen';
import {Root_ShmoPricingDetailsScreen} from './Root_ShmoPricingDetailsScreen';
import {useGlobalEventStreamListeners} from '@atb/modules/event-stream';
import {useDeepLinks} from '@atb/modules/deep-links';

const Stack = createStackNavigator<RootStackParamList>();

export const RootStack = () => {
  const isLoadingAppState = useIsLoadingAppState();
  const {getInitialNavigationContainerState} = useOnboardingFlow();
  const {theme} = useThemeContext();
  const navRef = useNavigationContainerRef<RootStackParamList>();

  useReactNavigationLogger(navRef);

  const {setCurrentRouteName} = useOnboardingContext();
  const onNavigationStateChange = useCallback(
    (state?: NavigationState) => {
      const currentRouteName = !state ? '' : getActiveRouteName(state);
      setCurrentRouteName(currentRouteName);
      state && trackNavigation(currentRouteName);
    },
    [setCurrentRouteName],
  );

  const deepLinks = useDeepLinks();

  const {minimum_app_version} = useRemoteConfigContext();

  useTestIds();
  useSetupReactQueryWindowFocus();

  // init Intercom user
  useRegisterIntercomUser();

  useGlobalEventStreamListeners();

  if (isLoadingAppState) {
    return null;
  }

  const statusBarColor = theme.color.background.accent[0].background;

  const ReactNavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.color.background.neutral[1].background,
    },
  };

  const isCurrentAppVersionLowerThanMinVersion =
    APP_VERSION &&
    minimum_app_version &&
    compareVersion(APP_VERSION, minimum_app_version) < 0;

  if (isCurrentAppVersionLowerThanMinVersion) return <ForceUpdateScreen />;

  return (
    <>
      <StatusBar
        barStyle={theme.statusBarStyle}
        translucent={true}
        backgroundColor={statusBarColor}
      />
      <LoadingScreenBoundary>
        <NavigationContainer<RootStackParamList>
          onStateChange={onNavigationStateChange}
          initialState={getInitialNavigationContainerState()}
          ref={navRef}
          theme={ReactNavigationTheme}
          fallback={<LoadingScreen />}
          linking={deepLinks}
        >
          <AnalyticsContextProvider>
            <Stack.Navigator
              screenOptions={screenOptions(
                TransitionPresets.ModalSlideFromBottomIOS,
                {
                  headerShown: false,
                  presentation: 'modal',
                },
              )}
            >
              <Stack.Screen
                name="Root_TabNavigatorStack"
                component={Root_TabNavigatorStack}
              />
              <Stack.Screen
                name="Root_ConsiderTravelTokenChangeScreen"
                component={Root_ConsiderTravelTokenChangeScreen}
              />
              <Stack.Screen
                name="Root_SelectTravelTokenScreen"
                component={Root_SelectTravelTokenScreen}
              />
              <Stack.Screen
                name="Root_LocationSearchByTextScreen"
                component={Root_LocationSearchByTextScreen}
              />
              <Stack.Screen
                name="Root_LocationSearchByMapScreen"
                component={Root_LocationSearchByMapScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_ScanQrCodeScreen"
                component={Root_ScanQrCodeScreen}
              />
              <Stack.Screen
                name="Root_PurchaseOverviewScreen"
                component={Root_PurchaseOverviewScreen}
              />
              <Stack.Screen
                name="Root_PurchaseConfirmationScreen"
                component={Root_PurchaseConfirmationScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_PurchaseFareZonesSearchByMapScreen"
                component={Root_PurchaseFareZonesSearchByMapScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_PurchaseFareZonesSearchByTextScreen"
                component={Root_PurchaseFareZonesSearchByTextScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_PurchaseHarborSearchScreen"
                component={Root_PurchaseHarborSearchScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_TripSelectionScreen"
                component={Root_TripSelectionScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_PurchaseAsAnonymousConsequencesScreen"
                component={Root_PurchaseAsAnonymousConsequencesScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_FareContractDetailsScreen"
                component={Root_FareContractDetailsScreen}
              />
              <Stack.Screen
                name="Root_RefundConfirmationScreen"
                component={Root_RefundConfirmationScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_TicketInformationScreen"
                component={Root_TicketInformationScreen}
              />
              <Stack.Screen
                name="Root_ReceiptScreen"
                component={Root_ReceiptScreen}
              />
              <Stack.Screen
                name="Root_AddEditFavoritePlaceScreen"
                component={Root_AddEditFavoritePlaceScreen}
              />
              <Stack.Screen
                name="Root_SearchFavoritePlaceScreen"
                component={Root_SearchFavoritePlaceScreen}
              />
              <Stack.Screen
                name="Root_LoginAvailableFareContractWarningScreen"
                component={Root_LoginAvailableFareContractWarningScreen}
              />
              <Stack.Screen
                name="Root_LoginOptionsScreen"
                component={Root_LoginOptionsScreen}
              />
              <Stack.Screen
                name="Root_LoginPhoneInputScreen"
                component={Root_LoginPhoneInputScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_LoginConfirmCodeScreen"
                component={Root_LoginConfirmCodeScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_LoginRequiredForFareProductScreen"
                component={Root_LoginRequiredForFareProductScreen}
              />
              <Stack.Screen
                name="Root_ConfirmationScreen"
                component={Root_ConfirmationScreen}
              />
              <Stack.Screen
                name="Root_ShmoHelpScreen"
                component={Root_ShmoHelpScreen}
              />
              <Stack.Screen
                name="Root_ShmoOnboardingScreen"
                component={Root_ShmoOnboardingScreen}
              />
              <Stack.Screen
                name="Root_ShmoPricingDetailsScreen"
                component={Root_ShmoPricingDetailsScreen}
              />
              <Stack.Screen
                name="Root_ContactShmoOperatorScreen"
                component={Root_ContactShmoOperatorScreen}
              />
              <Stack.Screen
                name="Root_ContactShmoOperatorConfirmationScreen"
                component={Root_ContactShmoOperatorConfirmationScreen}
              />
              <Stack.Screen
                name="Root_ParkingViolationsSelectScreen"
                component={Root_ParkingViolationsSelectScreen}
              />
              <Stack.Screen
                name="Root_ParkingViolationsPhotoScreen"
                component={Root_ParkingViolationsPhotoScreen}
              />
              <Stack.Screen
                name="Root_ParkingViolationsQrScreen"
                component={Root_ParkingViolationsQrScreen}
              />
              <Stack.Screen
                name="Root_ParkingViolationsConfirmationScreen"
                component={Root_ParkingViolationsConfirmationScreen}
              />
              <Stack.Screen
                name="Root_NotificationPermissionScreen"
                component={Root_NotificationPermissionScreen}
              />
              <Stack.Screen
                name="Root_LocationWhenInUsePermissionScreen"
                component={Root_LocationWhenInUsePermissionScreen}
              />
              <Stack.Screen
                name="Root_TravelAidOnboardingScreen"
                component={Root_TravelAidOnboardingScreen}
              />
              <Stack.Screen
                name="Root_ChooseTicketRecipientScreen"
                component={Root_ChooseTicketRecipientScreen}
                options={screenOptions(TransitionPresets.SlideFromRightIOS)}
              />
              <Stack.Screen
                name="Root_ParkingPhotoScreen"
                component={Root_ParkingPhotoScreen}
              />
              <Stack.Screen
                name="Root_SmartParkAndRideAddScreen"
                component={Root_SmartParkAndRideAddScreen}
              />
              <Stack.Screen
                name="Root_SmartParkAndRideEditScreen"
                component={Root_SmartParkAndRideEditScreen}
              />
              <Stack.Screen
                name="Root_OnboardingCarouselStack"
                component={Root_OnboardingCarouselStack}
              />
            </Stack.Navigator>
          </AnalyticsContextProvider>
        </NavigationContainer>
      </LoadingScreenBoundary>
    </>
  );
};
