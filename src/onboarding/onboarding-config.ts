import {OnboardingSectionConfig} from '@atb/onboarding';
import {Platform} from 'react-native';

export const onboardingSectionsInPrioritizedOrder: OnboardingSectionConfig[] =
  [
    {
      isOnboardedStoreKey: '@ATB_extended_onboarding_onboarded',
      onboardingSectionId: 'extendedOnboarding',
      initialScreen: {
        name: 'Root_ExtendedOnboardingStack',
      },
      shouldShowBeforeUserCreated: true,
      shouldShowPredicate: ({
        extendedOnboardingEnabled,
        userCreationIsOnboarded,
      }) => extendedOnboardingEnabled && !userCreationIsOnboarded, // !userCreationIsOnboarded for backward compatibility,
    },
    {
      isOnboardedStoreKey: '@ATB_onboarded', // variable renamed, but keep old isOnboardedStoreKey
      onboardingSectionId: 'userCreation',
      initialScreen: {
        name: 'Root_LoginOptionsScreen',
        params: {},
      },
      shouldShowBeforeUserCreated: true,
      shouldShowPredicate: ({authenticationType}) => authenticationType === 'anonymous',
    },
    {
      isOnboardedStoreKey: '@ATB_location_when_in_use_permission_onboarded',
      onboardingSectionId: 'locationWhenInUsePermission',
      initialScreen: {
        name: 'Root_LocationWhenInUsePermissionScreen',
      },
      shouldShowPredicate: ({locationPermissionStatus}) =>
        locationPermissionStatus === 'denied',
    },
    {
      isOnboardedStoreKey: '@ATB_share_travel_habits_onboarded',
      onboardingSectionId: 'shareTravelHabits',
      initialScreen: {
        name: 'Root_ShareTravelHabitsScreen',
      },
      shouldShowPredicate: ({shouldShowShareTravelHabitsScreen}) =>
        shouldShowShareTravelHabitsScreen,
    },
    {
      isOnboardedStoreKey: '@ATB_notification_permission_onboarded',
      onboardingSectionId: 'notificationPermission',
      initialScreen: {
        name: 'Root_NotificationPermissionScreen',
      },
      shouldShowPredicate: ({
        pushNotificationPermissionStatus,
        pushNotificationsEnabled,
        hasFareContractWithActivatedNotification,
      }) => {
        const pushNotificationPermissionsNotGranted =
          Platform.OS === 'ios'
            ? pushNotificationPermissionStatus === 'undetermined'
            : pushNotificationPermissionStatus === 'denied';

        return (
          pushNotificationsEnabled &&
          pushNotificationPermissionsNotGranted &&
          hasFareContractWithActivatedNotification
        );
      },
    },
    {
      isOnboardedStoreKey: '@ATB_mobile_token_onboarded',
      onboardingSectionId: 'mobileToken',
      initialScreen: {
        name: 'Root_ConsiderTravelTokenChangeScreen',
      },
      shouldShowPredicate: ({
        mobileTokenStatus,
        deviceInspectionStatus,
        travelCardDisabled,
      }) =>
        mobileTokenStatus === 'success' &&
        deviceInspectionStatus === 'not-inspectable' &&
        !travelCardDisabled,
    },
    {
      isOnboardedStoreKey: '@ATB_mobile_token_without_travelcard_onboarded',
      onboardingSectionId: 'mobileTokenWithoutTravelcard',
      initialScreen: {
        name: 'Root_ConsiderTravelTokenChangeScreen',
      },
      shouldShowPredicate: ({
        mobileTokenStatus,
        deviceInspectionStatus,
        travelCardDisabled,
      }) =>
        mobileTokenStatus === 'success' &&
        deviceInspectionStatus === 'not-inspectable' &&
        travelCardDisabled,
    },
  ];
