import {bonusOnboardingId, BonusOnboardingScreenName} from '@atb/modules/bonus';
import {extendedOnboardingId} from '../extended-onboarding';
import {ExtendedOnboardingScreenName} from '../extended-onboarding';
import {
  sparOnboardingId,
  SparPilotOnboardingScreenName,
} from '@atb/modules/smart-park-and-ride';

export type OnboardingCarouselScreenName =
  | BonusOnboardingScreenName
  | ExtendedOnboardingScreenName
  | SparPilotOnboardingScreenName;

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
