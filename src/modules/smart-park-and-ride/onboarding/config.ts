import {OnboardingCarouselConfig} from '@atb/modules/onboarding';
import {SmartParkAndRideOnboarding_InformationScreen} from './SmartParkAndRideOnboarding_InformationScreen';
import {SmartParkAndRideOnboarding_AutomaticRegistrationScreen} from './SmartParkAndRideOnboarding_AutomaticRegistrationScreen';
import {SmartParkAndRideOnboarding_ContactInfoScreen} from './SmartParkAndRideOnboarding_ContactInfoScreen';

export const sparOnboardingId = 'spar-pilot';

export type SparPilotOnboardingScreenName =
  | 'SmartParkAndRideOnboarding_InformationScreen'
  | 'SmartParkAndRideOnboarding_AutomaticRegistrationScreen'
  | 'SmartParkAndRideOnboarding_ContactInfoScreen';

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
      name: 'SmartParkAndRideOnboarding_ContactInfoScreen',
      component: SmartParkAndRideOnboarding_ContactInfoScreen,
    },
  ],
};
