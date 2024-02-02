import {RootStackParamList} from '@atb/stacks-hierarchy';

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

export type StaticOnboardingSection = {
  isOnboardedStoreKey: IsOnboardedStoreKey;
  onboardingSectionId: OnboardingSectionId;
  initialScreen?: {
    name?: keyof RootStackParamList;
    params?: any;
  };
  shouldShowBeforeUserCreated?: boolean;
};

export type LoadedOnboardingSection = StaticOnboardingSection & {
  isOnboarded: boolean;
};

export type OnboardingSection = LoadedOnboardingSection & {
  customShouldShow?: boolean;
};
