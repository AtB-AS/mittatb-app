import {
  bonusPilotEnrollmentId,
  BonusPilotEnrollmentScreenNames,
} from '../bonus';

export type EnrollmentOnboardingScreenName = BonusPilotEnrollmentScreenNames;

export type EnrollmentOnboardingConfigId = typeof bonusPilotEnrollmentId;

export type EnrollmentOnboardingConfig = {
  id: EnrollmentOnboardingConfigId;
  enrollmentIds: string[];
  onboardingScreens: {
    name: EnrollmentOnboardingScreenName;
    component: React.ComponentType<any>;
  }[];
};
