import {bonusEnrollmentConfig} from '../bonus';
import {extendedOnboardingConfig} from '../extended-onboarding';
import {sparEnrollmentConfig} from '../smart-park-and-ride';
import {OnboardingCarouselConfig} from './types';

export const onboardingCarouselConfig: OnboardingCarouselConfig[] = [
  bonusEnrollmentConfig,
  sparEnrollmentConfig,
  extendedOnboardingConfig,
];
