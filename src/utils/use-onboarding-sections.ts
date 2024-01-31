import {useAppState} from '@atb/AppContext';
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
import {RootStackParamList} from '@atb/stacks-hierarchy';

import {useValidRightNowFareContract} from '@atb/ticketing/use-valid-right-now-fare-contracts';

import {Platform} from 'react-native';

import {useCallback, useMemo} from 'react';

type IsOnboardedStoreKey =
  | '@ATB_extended_onboarding_onboarded'
  | '@ATB_onboarded'
  | '@ATB_location_when_in_use_permission_onboarded'
  | '@ATB_share_travel_habits_onboarded'
  | '@ATB_notification_permission_onboarded'
  | '@ATB_mobile_token_onboarded'
  | '@ATB_mobile_token_without_travelcard_onboarded';

export type OnboardingSectionId =
  | 'extendedOnboarding'
  | 'userCreation'
  | 'locationWhenInUsePermission'
  | 'shareTravelHabits'
  | 'notificationPermission'
  | 'mobileToken'
  | 'mobileTokenWithoutTravelcard';

type StaticOnboardingSection = {
  isOnboardedStoreKey: IsOnboardedStoreKey;
  onboardingSectionId: OnboardingSectionId;
  initialScreen?: {
    name?: keyof RootStackParamList;
    params?: any;
  };
  shouldShowBeforeUserCreated?: boolean;
};

export type LoadedOnboardingSection = StaticOnboardingSection & {
  isOnboarded: boolean; // loaded and added in AppContext
};

export type OnboardingSection = LoadedOnboardingSection & {
  customShouldShow?: boolean; // calculated and added in useOnboardingSections
};

export const staticOnboardingSectionsInPrioritizedOrder: StaticOnboardingSection[] =
  [
    {
      isOnboardedStoreKey: '@ATB_extended_onboarding_onboarded',
      onboardingSectionId: 'extendedOnboarding',
      initialScreen: {
        name: 'Root_ExtendedOnboardingStack',
      },
      shouldShowBeforeUserCreated: true,
    },
    {
      isOnboardedStoreKey: '@ATB_onboarded', // variable renamed, but keep old isOnboardedStoreKey
      onboardingSectionId: 'userCreation',
      initialScreen: {
        name: 'Root_LoginOptionsScreen',
        params: {},
      },
      shouldShowBeforeUserCreated: true,
    },
    {
      isOnboardedStoreKey: '@ATB_location_when_in_use_permission_onboarded',
      onboardingSectionId: 'locationWhenInUsePermission',
      initialScreen: {
        name: 'Root_LocationWhenInUsePermissionScreen',
      },
    },
    {
      isOnboardedStoreKey: '@ATB_share_travel_habits_onboarded',
      onboardingSectionId: 'shareTravelHabits',
      initialScreen: {
        name: 'Root_ShareTravelHabitsScreen',
      },
    },
    {
      isOnboardedStoreKey: '@ATB_notification_permission_onboarded',
      onboardingSectionId: 'notificationPermission',
      initialScreen: {
        name: 'Root_NotificationPermissionScreen',
      },
    },
    {
      isOnboardedStoreKey: '@ATB_mobile_token_onboarded',
      onboardingSectionId: 'mobileToken',
      initialScreen: {
        name: 'Root_ConsiderTravelTokenChangeScreen',
      },
    },
    {
      isOnboardedStoreKey: '@ATB_mobile_token_without_travelcard_onboarded',
      onboardingSectionId: 'mobileTokenWithoutTravelcard',
      initialScreen: {
        name: 'Root_ConsiderTravelTokenChangeScreen',
      },
    },
  ];

export const useOnboardingSections = (
  utilizeThisHookInstanceForSessionCounting: boolean,
) => {
  const {loadedOnboardingSections} = useAppState();

  const getCustomShouldShow = useGetCustomShouldShow(
    utilizeThisHookInstanceForSessionCounting,
  );

  return useMemo(
    () =>
      loadedOnboardingSections.map((loadedOnboardingSection) => ({
        ...loadedOnboardingSection,
        customShouldShow: getCustomShouldShow(
          loadedOnboardingSection.onboardingSectionId,
        ),
      })),
    [getCustomShouldShow, loadedOnboardingSections],
  );
};

const useGetCustomShouldShow = (
  utilizeThisHookInstanceForSessionCounting: boolean,
) => {
  const customShouldShowExtendedOnboarding =
    useCustomShouldShowExtendedOnboarding();

  const customShouldShowLocationOnboarding =
    useCustomShouldShowLocationOnboarding();

  const customShouldShowShareTravelHabitsScreen =
    useShouldShowShareTravelHabitsScreen(
      utilizeThisHookInstanceForSessionCounting,
    );

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
        // case 'userCreation':
        //   return true;
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

const useCustomShouldShowExtendedOnboarding = () => {
  const {enable_extended_onboarding} = useRemoteConfig();

  const userCreationIsOnboarded =
    useOnboardingSectionIsOnboarded('userCreation');

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

/* --- utils --- */

export const useOnboardingSectionIsOnboarded: (
  onboardingSectionId: OnboardingSectionId,
) => boolean = (onboardingSectionId) => {
  const {loadedOnboardingSections: onboardingSections} = useAppState();
  return (
    getOnboardingSection(onboardingSections, onboardingSectionId)
      ?.isOnboarded ?? false
  );
};

export const getOnboardingSection: (
  onboardingSections: OnboardingSection[],
  onboardingSectionId: OnboardingSectionId,
) => OnboardingSection | undefined = (
  onboardingSections,
  onboardingSectionId,
) =>
  onboardingSections.find(
    (sOS) => sOS.onboardingSectionId === onboardingSectionId,
  );
