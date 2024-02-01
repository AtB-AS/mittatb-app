import {useCallback} from 'react';
import {
  OnboardingSection,
  OnboardingSectionId,
} from './use-onboarding-sections';

export const useOnboardingGetInitialScreen = () =>
  useCallback(
    (
      onboardingSectionId: OnboardingSectionId,
    ): OnboardingSection['initialScreen'] => {
      switch (onboardingSectionId) {
        case 'extendedOnboarding':
          return {
            name: 'Root_ExtendedOnboardingStack',
          };
        case 'userCreation':
          return {
            name: 'Root_LoginOptionsScreen',
            params: {},
          };
        case 'locationWhenInUsePermission':
          return {
            name: 'Root_LocationWhenInUsePermissionScreen',
          };
        case 'shareTravelHabits':
          return {
            name: 'Root_ShareTravelHabitsScreen',
          };
        case 'notificationPermission':
          return {
            name: 'Root_NotificationPermissionScreen',
          };
        case 'mobileToken':
          return {
            name: 'Root_ConsiderTravelTokenChangeScreen',
          };
        case 'mobileTokenWithoutTravelcard':
          return {
            name: 'Root_ConsiderTravelTokenChangeScreen',
          };
        default:
          return;
      }
    },
    [],
  );
