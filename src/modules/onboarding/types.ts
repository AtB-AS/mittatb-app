import {RootStackParamList} from '@atb/stacks-hierarchy';
import {PermissionStatus} from 'react-native-permissions';
import {AuthenticationType} from '@atb/modules/auth';
import {NotificationPermissionStatus} from '@atb/modules/notifications';
import {MobileTokenStatus} from '@atb/modules/mobile-token';

type IsOnboardedStoreKey =
  | '@ATB_extended_onboarding_onboarded'
  | '@ATB_onboarded'
  | '@ATB_location_when_in_use_permission_onboarded'
  | '@ATB_share_travel_habits_onboarded'
  | '@ATB_notification_permission_onboarded'
  | '@ATB_mobile_token_onboarded'
  | '@ATB_mobile_token_without_travelcard_onboarded'
  | '@ATB_smart_park_and_ride_onboarded';

export type OnboardingSectionId =
  | 'extendedOnboarding'
  | 'userCreation'
  | 'locationWhenInUsePermission'
  | 'shareTravelHabits'
  | 'notificationPermission'
  | 'mobileToken'
  | 'mobileTokenWithoutTravelcard'
  | 'smartParkAndRide';

export type ShouldShowArgsType = {
  locationPermissionStatus: PermissionStatus | null;
  pushNotificationPermissionStatus: NotificationPermissionStatus;
  authenticationType: AuthenticationType;
  isOnboardingLoginEnabled: boolean;
  isPushNotificationsEnabled: boolean;
  hasFareContractWithActivatedNotification: boolean;
  travelCardDisabled: boolean;
  mobileTokenStatus: MobileTokenStatus;
  extendedOnboardingEnabled: boolean;
  userCreationIsOnboarded: boolean;
  shouldShowShareTravelHabitsScreen: boolean;
  isSmartParkAndRideScreen: boolean;
};

export type OnboardingSectionConfig = {
  isOnboardedStoreKey: IsOnboardedStoreKey;
  onboardingSectionId: OnboardingSectionId;
  initialScreen?: {
    name?: keyof RootStackParamList;
    params?: any;
  };
  shouldShowBeforeUserCreated?: boolean;
  shouldShowPredicate: (args: ShouldShowArgsType) => boolean;
};

export type LoadedOnboardingSection = OnboardingSectionConfig & {
  isOnboarded: boolean;
};

export type OnboardingSection = LoadedOnboardingSection & {
  shouldShow: boolean;
};
