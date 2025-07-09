import {
  bonusPilotEnrollmentId,
  bonusPilotEnrollmentScreenNames,
} from '../bonus';

export type EnrollmentOnboardingScreenName = bonusPilotEnrollmentScreenNames;

export type EnrollmentOnboardingConfigId = typeof bonusPilotEnrollmentId;

export type EnrollmentOnboardingConfig = {
  id: EnrollmentOnboardingConfigId;
  enrollmentIds: string[];
  onboardingScreens: {
    name: EnrollmentOnboardingScreenName;
    component: React.ComponentType<any>;
  }[];
};
