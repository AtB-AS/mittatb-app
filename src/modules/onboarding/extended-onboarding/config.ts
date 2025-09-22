import {ExtendedOnboarding_GoodToKnowScreen} from './ExtendedOnboarding_GoodToKnowScreen';
import {ExtendedOnboarding_AlsoGoodToKnowScreen} from './ExtendedOnboarding_AlsoGoodToKnowScreen';
import {OnboardingCarouselConfig} from '../onboarding-carousel';

export const extendedOnboardingId = 'extended-onboarding';

export type ExtendedOnboardingScreenNames =
  | 'ExtendedOnboarding_GoodToKnowScreen'
  | 'ExtendedOnboarding_AlsoGoodToKnowScreen';

export const extendedOnboardingConfig: OnboardingCarouselConfig = {
  id: extendedOnboardingId,
  onboardingScreens: [
    {
      name: 'ExtendedOnboarding_GoodToKnowScreen',
      component: ExtendedOnboarding_GoodToKnowScreen,
    },
    {
      name: 'ExtendedOnboarding_AlsoGoodToKnowScreen',
      component: ExtendedOnboarding_AlsoGoodToKnowScreen,
    },
  ],
};
