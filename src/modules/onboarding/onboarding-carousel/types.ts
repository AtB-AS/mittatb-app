import {
  bonusPilotEnrollmentId,
  BonusPilotEnrollmentScreenNames,
} from '../bonus';
import {extendedOnboardingId} from '../extended-onboarding';
import {ExtendedOnboardingScreenNames} from '../extended-onboarding';

import {
  sparPilotEnrollmentId,
  SparPilotEnrollmentScreenNames,
} from '../smart-park-and-ride';

export type OnboardingCarouselScreenName =
  | BonusPilotEnrollmentScreenNames
  | ExtendedOnboardingScreenNames
  | SparPilotEnrollmentScreenNames;

export type OnboardingCarouselConfigId =
  | typeof bonusPilotEnrollmentId
  | typeof extendedOnboardingId
  | typeof sparPilotEnrollmentId;

export type OnboardingCarouselConfig = {
  id: OnboardingCarouselConfigId;
  enrollmentIds?: string[]; // TODO: remove?
  onboardingScreens: {
    name: OnboardingCarouselScreenName;
    component: React.ComponentType<any>;
  }[];
};
