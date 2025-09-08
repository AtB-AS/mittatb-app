import {EnrollmentOnboardingConfig} from '@atb/modules/enrollment-onboarding';
import {SmartParkAndRideOnboarding_InformationScreen} from './SmartParkAndRideOnboarding_InformationScreen';
import {SmartParkAndRideOnboarding_AutomaticRegistrationScreen} from './SmartParkAndRideOnboarding_AutomaticRegistrationScreen';
import {SmartParkAndRideOnboarding_AddScreen} from './SmartParkAndRideOnboarding_AddScreen';

export const sparPilotEnrollmentId = 'spar-pilot';

export type SparPilotEnrollmentScreenNames =
  | 'SmartParkAndRideOnboarding_InformationScreen'
  | 'SmartParkAndRideOnboarding_AutomaticRegistrationScreen'
  | 'SmartParkAndRideOnboarding_AddScreen';

export const sparEnrollmentConfig: EnrollmentOnboardingConfig = {
  id: sparPilotEnrollmentId,
  // enrollmentIds: ['spar-pilot'],
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
