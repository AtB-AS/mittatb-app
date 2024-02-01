import {RootStackParamList} from '@atb/stacks-hierarchy';

import {useMemo} from 'react';
import {useOnboardingGetCustomShouldShow} from './use-onboarding-get-custom-should-show';
import {useOnboardingState} from '@atb/onboarding';

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

export const useOnboardingSections: (
  utilizeThisHookInstanceForSessionCounting: boolean,
) => OnboardingSection[] = (utilizeThisHookInstanceForSessionCounting) => {
  const {loadedOnboardingSections} = useOnboardingState();

  const getCustomShouldShow = useOnboardingGetCustomShouldShow(
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
