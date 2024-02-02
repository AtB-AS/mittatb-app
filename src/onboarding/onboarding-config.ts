import {StaticOnboardingSection} from '@atb/onboarding';

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
