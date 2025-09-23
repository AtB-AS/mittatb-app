import {
  bonusOnboardingId,
  BonusOnboardingScreenNames,
} from '@atb/modules/bonus';
import {extendedOnboardingId} from '../extended-onboarding';
import {ExtendedOnboardingScreenNames} from '../extended-onboarding';
import {
  sparOnboardingId,
  SparPilotOnboardingScreenNames,
} from '@atb/modules/smart-park-and-ride';

export type OnboardingCarouselScreenName =
  | BonusOnboardingScreenNames
  | ExtendedOnboardingScreenNames
  | SparPilotOnboardingScreenNames;

export type OnboardingCarouselConfigId =
  | typeof bonusOnboardingId
  | typeof extendedOnboardingId
  | typeof sparOnboardingId;

export type OnboardingCarouselConfig = {
  id: OnboardingCarouselConfigId;
  onboardingScreens: {
    name: OnboardingCarouselScreenName;
    component: React.ComponentType<any>;
  }[];
};
