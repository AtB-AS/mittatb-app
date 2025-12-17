import {bonusOnboardingCarouselConfig} from '@atb/modules/bonus';
import {extendedOnboardingCarouselConfig} from '../extended-onboarding';
import {OnboardingCarouselConfig} from './types';
import {sparOnboardingCarouselConfig} from '@atb/modules/smart-park-and-ride';

export const onboardingCarouselConfigs: OnboardingCarouselConfig[] = [
  bonusOnboardingCarouselConfig,
  sparOnboardingCarouselConfig,
  extendedOnboardingCarouselConfig,
];
