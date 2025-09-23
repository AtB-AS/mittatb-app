import {OnboardingCarouselConfig} from '@atb/modules/onboarding';
import {SmartParkAndRideOnboarding_InformationScreen} from './SmartParkAndRideOnboarding_InformationScreen';
import {SmartParkAndRideOnboarding_AutomaticRegistrationScreen} from './SmartParkAndRideOnboarding_AutomaticRegistrationScreen';
import {SmartParkAndRideOnboarding_AddScreen} from './SmartParkAndRideOnboarding_AddScreen';

export const sparOnboardingId = 'spar-pilot';

export type SparPilotOnboardingScreenNames =
  | 'SmartParkAndRideOnboarding_InformationScreen'
  | 'SmartParkAndRideOnboarding_AutomaticRegistrationScreen'
  | 'SmartParkAndRideOnboarding_AddScreen';

export const sparOnboardingCarouselConfig: OnboardingCarouselConfig = {
  id: sparOnboardingId,
  onboardingScreens: [
    {
      name: 'SmartParkAndRideOnboarding_InformationScreen',
      component: SmartParkAndRideOnboarding_InformationScreen,
    },
    {
      name: 'SmartParkAndRideOnboarding_AutomaticRegistrationScreen',
      component: SmartParkAndRideOnboarding_AutomaticRegistrationScreen,
    },
    {
      name: 'SmartParkAndRideOnboarding_AddScreen',
      component: SmartParkAndRideOnboarding_AddScreen,
    },
  ],
};
