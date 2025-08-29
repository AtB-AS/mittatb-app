import {
  bonusPilotEnrollmentId,
  BonusPilotEnrollmentScreenNames,
} from '../bonus';

import {
  sparPilotEnrollmentId,
  SparPilotEnrollmentScreenNames,
} from '../smart-park-and-ride';

export type EnrollmentOnboardingScreenName =
  | BonusPilotEnrollmentScreenNames
  | SparPilotEnrollmentScreenNames;

export type EnrollmentOnboardingConfigId =
  | typeof bonusPilotEnrollmentId
  | typeof sparPilotEnrollmentId;

export type EnrollmentOnboardingConfig = {
  id: EnrollmentOnboardingConfigId;
  enrollmentIds?: string[];
  onboardingScreens: {
    name: EnrollmentOnboardingScreenName;
    component: React.ComponentType<any>;
  }[];
};
