import {bonusOnboardingCarouselConfig} from '@atb/modules/bonus';
import {extendedOnboardingConfig} from '../extended-onboarding';
import {OnboardingCarouselConfig} from './types';
import {sparOnboardingCarouselConfig} from '@atb/modules/smart-park-and-ride';

export const onboardingCarouselConfig: OnboardingCarouselConfig[] = [
  bonusOnboardingCarouselConfig,
  sparOnboardingCarouselConfig,
  extendedOnboardingConfig,
];
