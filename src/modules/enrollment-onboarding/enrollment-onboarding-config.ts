import {bonusEnrollmentConfig} from '../bonus';
import {sparEnrollmentConfig} from '../smart-park-and-ride';
import {EnrollmentOnboardingConfig} from './types';

export const enrollmentOnboardingConfig: EnrollmentOnboardingConfig[] = [
  bonusEnrollmentConfig,
  sparEnrollmentConfig,
];
