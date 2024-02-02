import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

import {useAuthState} from '@atb/auth';
import {useShouldShowShareTravelHabitsScreen} from '@atb/beacons/use-should-show-share-travel-habits-screen';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {
  useNotifications,
  usePushNotificationsEnabled,
} from '@atb/notifications';
import {useHasFareContractWithActivatedNotification} from '@atb/notifications/use-has-fare-contract-with-activated-notification';

import {useValidRightNowFareContract} from '@atb/ticketing/use-valid-right-now-fare-contracts';

import {Platform} from 'react-native';

import {useCallback} from 'react';
import {
  LoadedOnboardingSection,
  OnboardingSectionId,
  getOnboardingSectionIsOnboarded,
} from '@atb/onboarding';

export const useOnboardingGetCustomShouldShow = (
  loadedOnboardingSections: LoadedOnboardingSection[],
) => {
  const customShouldShowExtendedOnboarding =
    useCustomShouldShowExtendedOnboarding(loadedOnboardingSections);

  const customShouldShowLocationOnboarding =
    useCustomShouldShowLocationOnboarding();

  const customShouldShowShareTravelHabitsScreen =
    useShouldShowShareTravelHabitsScreen(loadedOnboardingSections);

  const customShouldShowNotificationPermissionScreen =
    useCustomShouldShowNotificationPermissionScreen();

  const customShouldShowMobileTokenOnboarding =
    useCustomShouldShowMobileTokenOnboarding();

  const customShouldShowMobileTokenWithoutTravelcardOnboarding =
    useCustomShouldShowMobileTokenWithoutTravelcardOnboarding();

  return useCallback(
    (onboardingSectionId: OnboardingSectionId) => {
      switch (onboardingSectionId) {
        case 'extendedOnboarding':
          return customShouldShowExtendedOnboarding;
        case 'locationWhenInUsePermission':
          return customShouldShowLocationOnboarding;
        case 'shareTravelHabits':
          return customShouldShowShareTravelHabitsScreen;
        case 'notificationPermission':
          return customShouldShowNotificationPermissionScreen;
        case 'mobileToken':
          return customShouldShowMobileTokenOnboarding;
        case 'mobileTokenWithoutTravelcard':
          return customShouldShowMobileTokenWithoutTravelcardOnboarding;
        default:
          return true;
      }
    },
    [
      customShouldShowExtendedOnboarding,
      customShouldShowLocationOnboarding,
      customShouldShowShareTravelHabitsScreen,
      customShouldShowNotificationPermissionScreen,
      customShouldShowMobileTokenOnboarding,
      customShouldShowMobileTokenWithoutTravelcardOnboarding,
    ],
  );
};

/* --- useCustomShouldShow hooks --- */

const useCustomShouldShowExtendedOnboarding = (
  loadedOnboardingSections: LoadedOnboardingSection[],
) => {
  const {enable_extended_onboarding} = useRemoteConfig();

  const userCreationIsOnboarded = getOnboardingSectionIsOnboarded(
    loadedOnboardingSections,
    'userCreation',
  );

  return (
    enable_extended_onboarding && !userCreationIsOnboarded // !userCreationIsOnboarded for backward compatibility
  );
};

const useCustomShouldShowLocationOnboarding = () => {
  const {status: locationWhenInUsePermissionStatus} = useGeolocationState();

  return locationWhenInUsePermissionStatus === 'denied';
};

const useCustomShouldShowNotificationPermissionScreen = () => {
  const validFareContracts = useValidRightNowFareContract();

  const hasFareContractWithActivatedNotification =
    useHasFareContractWithActivatedNotification();

  const pushNotificationsEnabled = usePushNotificationsEnabled();
  const {permissionStatus: pushNotificationPermissionStatus} =
    useNotifications();

  const pushNotificationPermissionsNotGranted =
    Platform.OS === 'ios'
      ? pushNotificationPermissionStatus === 'undetermined'
      : pushNotificationPermissionStatus === 'denied';

  return (
    pushNotificationsEnabled &&
    pushNotificationPermissionsNotGranted &&
    validFareContracts.length > 0 &&
    hasFareContractWithActivatedNotification
  );
};

const useShouldShowTravelTokenOnboarding = () => {
  const {authenticationType} = useAuthState();
  const {tokens, mobileTokenStatus} = useMobileTokenContextState();
  const inspectableToken = tokens.find((token) => token.isInspectable);
  return (
    !!inspectableToken &&
    !inspectableToken?.isThisDevice &&
    mobileTokenStatus === 'success' &&
    authenticationType === 'phone'
  );
};

const useCustomShouldShowMobileTokenOnboarding = () => {
  const shouldShowTravelTokenOnboarding = useShouldShowTravelTokenOnboarding();
  const {disable_travelcard} = useRemoteConfig();
  return shouldShowTravelTokenOnboarding && !disable_travelcard;
};

const useCustomShouldShowMobileTokenWithoutTravelcardOnboarding = () => {
  const shouldShowTravelTokenOnboarding = useShouldShowTravelTokenOnboarding();
  const {disable_travelcard} = useRemoteConfig();
  return shouldShowTravelTokenOnboarding && disable_travelcard;
};
