import {BonusOnboardingScreenName} from '@atb/modules/bonus';
import {extendedOnboardingId} from '../extended-onboarding';
import {ExtendedOnboardingScreenName} from '../extended-onboarding';
import {
  sparOnboardingId,
  SparPilotOnboardingScreenName,
} from '@atb/modules/smart-park-and-ride';
import {KnownProgramId} from '@atb/modules/enrollment';

export type OnboardingCarouselScreenName =
  | BonusOnboardingScreenName
  | ExtendedOnboardingScreenName
  | SparPilotOnboardingScreenName;

export type OnboardingCarouselConfigId =
  | typeof KnownProgramId.BONUS
  | typeof extendedOnboardingId
  | typeof sparOnboardingId;

export type OnboardingCarouselConfig = {
  id: OnboardingCarouselConfigId;
  onboardingScreens: {
    name: OnboardingCarouselScreenName;
    component: React.ComponentType<any>;
  }[];
};
