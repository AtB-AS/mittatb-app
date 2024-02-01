import {useAppState} from '@atb/AppContext';

import {useMemo} from 'react';
import {useOnboardingGetCustomShouldShow} from './use-onboarding-get-custom-should-show';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {useOnboardingGetInitialScreen} from './use-onboarding-get-initial-screen';

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
  shouldShowBeforeUserCreated?: boolean;
};

export type LoadedOnboardingSection = StaticOnboardingSection & {
  isOnboarded: boolean; // loaded and added in AppContext
};

export type OnboardingSection = LoadedOnboardingSection & {
  customShouldShow?: boolean; // calculated and added in useOnboardingSections
  initialScreen?: {
    name?: keyof RootStackParamList;
    params?: any;
  };
};

export const staticOnboardingSectionsInPrioritizedOrder: StaticOnboardingSection[] =
  [
    {
      isOnboardedStoreKey: '@ATB_extended_onboarding_onboarded',
      onboardingSectionId: 'extendedOnboarding',
      shouldShowBeforeUserCreated: true,
    },
    {
      isOnboardedStoreKey: '@ATB_onboarded', // variable renamed, but keep old isOnboardedStoreKey
      onboardingSectionId: 'userCreation',
      shouldShowBeforeUserCreated: true,
    },
    {
      isOnboardedStoreKey: '@ATB_location_when_in_use_permission_onboarded',
      onboardingSectionId: 'locationWhenInUsePermission',
    },
    {
      isOnboardedStoreKey: '@ATB_share_travel_habits_onboarded',
      onboardingSectionId: 'shareTravelHabits',
    },
    {
      isOnboardedStoreKey: '@ATB_notification_permission_onboarded',
      onboardingSectionId: 'notificationPermission',
    },
    {
      isOnboardedStoreKey: '@ATB_mobile_token_onboarded',
      onboardingSectionId: 'mobileToken',
    },
    {
      isOnboardedStoreKey: '@ATB_mobile_token_without_travelcard_onboarded',
      onboardingSectionId: 'mobileTokenWithoutTravelcard',
    },
  ];

export const useOnboardingSections = (
  utilizeThisHookInstanceForSessionCounting: boolean,
) => {
  const {loadedOnboardingSections} = useAppState();

  const getCustomShouldShow = useOnboardingGetCustomShouldShow(
    utilizeThisHookInstanceForSessionCounting,
  );

  const getInitialScreen = useOnboardingGetInitialScreen();

  return useMemo(
    () =>
      loadedOnboardingSections.map((loadedOnboardingSection) => ({
        ...loadedOnboardingSection,
        customShouldShow: getCustomShouldShow(
          loadedOnboardingSection.onboardingSectionId,
        ),
        initialScreen: getInitialScreen(
          loadedOnboardingSection.onboardingSectionId,
        ),
      })),
    [getCustomShouldShow, getInitialScreen, loadedOnboardingSections],
  );
};
