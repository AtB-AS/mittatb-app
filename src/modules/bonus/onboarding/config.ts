import {OnboardingCarouselConfig} from '@atb/modules/onboarding';
import {BonusOnboarding_JoinScreen} from './BonusOnboarding_JoinScreen';
import {KnownProgramId} from '@atb/modules/enrollment';

export type BonusOnboardingScreenName = 'BonusOnboarding_JoinScreen';

export const bonusOnboardingCarouselConfig: OnboardingCarouselConfig = {
  id: KnownProgramId.BONUS,
  onboardingScreens: [
    {
      name: 'BonusOnboarding_JoinScreen',
      component: BonusOnboarding_JoinScreen,
    },
  ],
};
