import {bonusEnrollmentConfig} from '@atb/modules/bonus';
import {extendedOnboardingConfig} from '../extended-onboarding';
import {OnboardingCarouselConfig} from './types';
import {sparEnrollmentConfig} from '@atb/modules/smart-park-and-ride';

export const onboardingCarouselConfig: OnboardingCarouselConfig[] = [
  bonusEnrollmentConfig,
  sparEnrollmentConfig,
  extendedOnboardingConfig,
];
